$ErrorActionPreference='Stop'
$workspacePath=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
function Archive-Item($relativeSource,$relativeTarget) {
  $sourcePath=[IO.Path]::GetFullPath((Join-Path $workspacePath $relativeSource))
  $targetPath=[IO.Path]::GetFullPath((Join-Path $workspacePath $relativeTarget))
  if(!$sourcePath.StartsWith($workspacePath+'\') -or !$targetPath.StartsWith($workspacePath+'\')){throw 'Archive path outside workspace'}
  if(Test-Path -LiteralPath $sourcePath){New-Item -ItemType Directory -Force -Path (Split-Path $targetPath)|Out-Null;Move-Item -LiteralPath $sourcePath -Destination $targetPath}
}
foreach($item in (Get-ChildItem (Join-Path $workspacePath 'public') -File)) {
  if($item.Name -notin @('_redirects','robots.txt','sitemap.xml','icon_no_background.PNG','logo.png','quranlylogo.png','tooldecklogo.png','sw.js')){Archive-Item ('public/'+$item.Name) ('archive/legacy-public/'+$item.Name)}
}
foreach($item in (Get-ChildItem (Join-Path $workspacePath 'src/pages') -File)) {
  if($item.Name -notin @('ConeicPrivacyPolicy.jsx','ConeicInstallerCodes.jsx','LegalPages.css')){Archive-Item ('src/pages/'+$item.Name) ('archive/legacy-source/pages/'+$item.Name)}
}
foreach($item in (Get-ChildItem (Join-Path $workspacePath 'src/components') -File)) {
  if($item.Name -ne 'SEO.jsx'){Archive-Item ('src/components/'+$item.Name) ('archive/legacy-source/components/'+$item.Name)}
}
Archive-Item 'src/firebase.js' 'archive/legacy-source/firebase.js'
foreach($dir in @('api-test-client','career-application','port','prism-studio')){Archive-Item $dir ('archive/'+$dir)}
Write-Output 'Legacy website source and public files archived outside the deployed site.'
