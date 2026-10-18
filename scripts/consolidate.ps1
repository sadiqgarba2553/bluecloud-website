$ErrorActionPreference = 'Stop'
$workspacePath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$artifactPath = Join-Path $workspacePath 'artifacts/consolidation'
New-Item -ItemType Directory -Force -Path $artifactPath | Out-Null
git -C $workspacePath bundle create (Join-Path $artifactPath 'bluecloud-before.bundle') --all
$rootPatchPath = Join-Path $artifactPath 'bluecloud-before.patch'
git -C $workspacePath diff --binary "--output=$rootPatchPath"

function Import-Source($sourcePath, $relativeTarget, $snapshotName) {
  $targetPath = [IO.Path]::GetFullPath((Join-Path $workspacePath $relativeTarget))
  if (!$targetPath.StartsWith($workspacePath + [IO.Path]::DirectorySeparatorChar)) { throw 'Target outside workspace' }
  New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
  git -C $sourcePath bundle create (Join-Path $artifactPath "$snapshotName.bundle") --all
  $patchPath = Join-Path $artifactPath "$snapshotName.patch"
  git -C $sourcePath diff --binary "--output=$patchPath"
  $files = git -C $sourcePath -c core.quotepath=false ls-files --cached --others --exclude-standard
  foreach ($relativePath in ($files | Sort-Object -Unique)) {
    if ($relativePath -match '(^|/)(node_modules|dist|release|\.agents|agent|\.git)(/|$)' -or $relativePath -match '\.(apk|exe|dll|zip|7z)$' -or $relativePath -match '(^|/)\.env(\.|$)' -and $relativePath -notmatch '\.example$') { continue }
    $inputPath = Join-Path $sourcePath $relativePath
    if (!(Test-Path -LiteralPath $inputPath -PathType Leaf)) { continue }
    $outputPath = Join-Path $targetPath $relativePath
    New-Item -ItemType Directory -Force -Path (Split-Path $outputPath) | Out-Null
    Copy-Item -LiteralPath $inputPath -Destination $outputPath
  }
  foreach ($envName in @('.env.local', '.env.desktop.local')) {
    $envPath = Join-Path $sourcePath $envName
    if (Test-Path -LiteralPath $envPath) { Copy-Item -LiteralPath $envPath -Destination (Join-Path $targetPath $envName) }
  }
  Write-Output "Imported $snapshotName into $relativeTarget; history saved in artifacts/consolidation"
}

Import-Source 'C:/Users/Garba Ibrahim/Desktop/quranly pc' 'apps/quranly' 'quranly'
Import-Source 'C:/Users/Garba Ibrahim/Desktop/Coneic-VLC' 'apps/coneic' 'coneic'

# Preserve the old public demos outside the deployed public directory.
$legacyPublic = Join-Path $workspacePath 'archive/legacy-public'
New-Item -ItemType Directory -Force -Path $legacyPublic | Out-Null
foreach ($directory in (Get-ChildItem -LiteralPath (Join-Path $workspacePath 'public') -Directory)) {
  if ($directory.Name -eq 'coneic') { continue }
  $resolvedSource = $directory.FullName
  $resolvedTarget = [IO.Path]::GetFullPath((Join-Path $legacyPublic $directory.Name))
  if (!$resolvedSource.StartsWith($workspacePath + '\') -or !$resolvedTarget.StartsWith($workspacePath + '\')) { throw 'Archive target outside workspace' }
  if (!(Test-Path -LiteralPath $resolvedTarget)) { Move-Item -LiteralPath $resolvedSource -Destination $resolvedTarget }
}

$legacyTooldeck = Join-Path $workspacePath 'tool deck'
$archivedTooldeck = Join-Path $workspacePath 'archive/tooldeck-original'
if (Test-Path -LiteralPath $legacyTooldeck) {
  if (!$archivedTooldeck.StartsWith($workspacePath + '\')) { throw 'Invalid Tooldeck archive path' }
  Move-Item -LiteralPath $legacyTooldeck -Destination $archivedTooldeck
}
Write-Output 'Consolidation completed. Original external repositories were retained.'
