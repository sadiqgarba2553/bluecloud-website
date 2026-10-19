# Remove reproducible app leftovers while retaining current builds and upgrade fixtures.
# Preview: powershell -NoProfile -File scripts/clean-artifacts.ps1 -WhatIf
[CmdletBinding(SupportsShouldProcess=$true)]
param()
$ErrorActionPreference='Stop'
Set-StrictMode -Version Latest
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\..')).TrimEnd('\')
$targets=[Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
function Add-Target([string]$Relative){[void]$targets.Add([IO.Path]::GetFullPath((Join-Path $root $Relative)))}
function Is-OlderVersion([string]$Candidate,[string]$Current){
    & node -e 'const s=require(process.argv[1]); const [a,b]=process.argv.slice(2); if(!s.valid(a)||!s.valid(b))process.exit(2); process.exit(s.lt(a,b)?0:1);' (Join-Path $root 'apps/launcher/node_modules/semver') $Candidate $Current
    if($LASTEXITCODE -gt 1){throw 'Version comparison failed; install launcher dependencies before cleanup.'}
    return ($LASTEXITCODE -eq 0)
}

# Cache and test-run output inside apps; dependency and runnable build trees stay intact.
$pending=[Collections.Generic.Queue[string]]::new()
$pending.Enqueue((Join-Path $root 'apps'))
while($pending.Count){
    foreach($directory in Get-ChildItem -LiteralPath $pending.Dequeue() -Directory -Force){
        if($directory.Attributes -band [IO.FileAttributes]::ReparsePoint){continue}
        if($directory.Name -in @('node_modules','.git','dist','release','native')){continue}
        if($directory.Name -in @('__pycache__','.pytest_cache','test-results','playwright-report','coverage')){[void]$targets.Add($directory.FullName)}
        else{$pending.Enqueue($directory.FullName)}
    }
}
foreach($name in @(
    'artifacts/coneic-associations-msix',
    'artifacts/coneic-associations-msix-v2',
    'artifacts/coneic-associations-validation/playback', # failed relative-path probe; passing run retained
    'artifacts/launcher-tests','artifacts/ui-tests',
    'artifacts/build-coneic-shell.sh','artifacts/coneic-desktop-logo.png','artifacts/coneic-package-logo.png',
    'apps/tooldeck/native/qpdf','apps/tooldeck/native/qpdf-12.4.2-msvc64.zip'
)){Add-Target $name}

$launcherVersion=(Get-Content -LiteralPath (Join-Path $root 'apps/launcher/package.json') -Raw | ConvertFrom-Json).version
$tooldeckVersion=(Get-Content -LiteralPath (Join-Path $root 'apps/tooldeck/package.json') -Raw | ConvertFrom-Json).version
$quranlyVersion=(Get-Content -LiteralPath (Join-Path $root 'apps/quranly/package.json') -Raw | ConvertFrom-Json).version
foreach($product in @(
    @{Directory='artifacts/launcher';Name='BlueCloud-Launcher';Version=$launcherVersion},
    @{Directory='artifacts/tooldeck';Name='Tooldeck';Version=$tooldeckVersion},
    @{Directory='artifacts/quranly';Name='Quranly';Version=$quranlyVersion},
    @{Directory='apps/quranly/release';Name='Quranly';Version=$quranlyVersion}
)){
    $directory=Join-Path $root $product.Directory
    if(-not (Test-Path -LiteralPath $directory)){continue}
    foreach($file in Get-ChildItem -LiteralPath $directory -File -Force){
        $pattern='^'+[regex]::Escape($product.Name)+'-Setup-(.+)-x64\.exe(?:\.blockmap)?$'
        if($file.Name -match $pattern){
            if(Is-OlderVersion $Matches[1] $product.Version){[void]$targets.Add($file.FullName)}
        }
        elseif($file.Name -eq 'builder-debug.yml'){[void]$targets.Add($file.FullName)}
    }
}
$releases=Join-Path $root 'artifacts/app-releases'
if(Test-Path -LiteralPath $releases){
    foreach($directory in Get-ChildItem -LiteralPath $releases -Directory){
        if($directory.Name -like 'launcher-v*' -and $directory.Name -ne 'launcher-v0.1.0-alpha.1'){
            if(Is-OlderVersion $directory.Name.Substring(10) $launcherVersion){[void]$targets.Add($directory.FullName)}
        }
    }
    # Keep alpha.1's signed feed and previous app ZIPs: upgrade tests use them.
    $baseline=Join-Path $releases 'launcher-v0.1.0-alpha.1'
    if(Test-Path -LiteralPath $baseline){foreach($file in Get-ChildItem -LiteralPath $baseline -File -Filter '*-Setup-*.exe'){[void]$targets.Add($file.FullName)}}
}

# Keep the compact MSIX validation evidence before discarding its duplicated runtime.
$evidenceSource=Join-Path $root 'artifacts/coneic-associations-msix-v2'
$evidenceDestination=Join-Path $root 'artifacts/coneic-associations-validation/msix'
if(Test-Path -LiteralPath $evidenceSource){
    if($PSCmdlet.ShouldProcess($evidenceDestination,'Preserve MSIX audit reports')){
        New-Item -ItemType Directory -Path $evidenceDestination -Force | Out-Null
        foreach($name in @('payload-audit.json','msix-audit.json','build-result.json','makeappx.log')){
            $file=Join-Path $evidenceSource $name
            if(Test-Path -LiteralPath $file){Copy-Item -LiteralPath $file -Destination (Join-Path $evidenceDestination $name)}
        }
    }
}
$removed=@();$bytes=0L
foreach($target in ($targets | Sort-Object)){
    if(-not (Test-Path -LiteralPath $target)){continue}
    $resolved=(Resolve-Path -LiteralPath $target).Path
    if(-not $resolved.StartsWith($root+'\',[StringComparison]::OrdinalIgnoreCase)){throw "Cleanup path escaped the repository: $resolved"}
    $cursor=$resolved
    while($cursor -ne $root){
        $item=Get-Item -LiteralPath $cursor -Force
        if($item.Attributes -band [IO.FileAttributes]::ReparsePoint){throw "Cleanup refuses linked paths: $cursor"}
        $cursor=Split-Path -Parent $cursor
    }
    $relative=$resolved.Substring($root.Length+1).Replace('\','/')
    $tracked=@(& git -C $root ls-files -- $relative)
    if($LASTEXITCODE -ne 0){throw 'Could not check tracked files.'}
    if($tracked.Count){throw "Cleanup refuses source-controlled files: $relative"}
    $item=Get-Item -LiteralPath $resolved -Force
    $size=0L
    if($item.PSIsContainer){
        foreach($file in Get-ChildItem -LiteralPath $resolved -Recurse -Force){
            if($file.Attributes -band [IO.FileAttributes]::ReparsePoint){throw "Cleanup refuses linked contents: $($file.FullName)"}
            if(-not $file.PSIsContainer){$size+=$file.Length}
        }
    }else{$size=$item.Length}
    if($PSCmdlet.ShouldProcess($resolved,'Remove generated or superseded app artifacts')){
        Remove-Item -LiteralPath $resolved -Recurse -Force
        $bytes+=$size;$removed+=@{Path=$relative;Bytes=$size}
    }
}
if(-not $WhatIfPreference){
    $report=Join-Path $root 'artifacts/app-cleanup-report.json'
    @{Removed=$removed;BytesFreed=$bytes;Timestamp=[DateTime]::UtcNow.ToString('o')} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $report -Encoding UTF8
}
Write-Output ("Removed {0} generated paths; reclaimed {1:N2} GiB." -f $removed.Count,($bytes/1GB))
