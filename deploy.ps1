[CmdletBinding()]
param(
    [string]$CommitMessage = "Deploy frontend-only portfolio demos"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$gitSafeDirectory = $repoRoot.Replace("\", "/")
$projectDirectory = Join-Path $repoRoot "portfolio-react"
$distDirectory = Join-Path $projectDirectory "dist"
$assetsTarget = Join-Path $repoRoot "assets"
$indexTarget = Join-Path $repoRoot "index.html"

function Assert-CommandSucceeded {
    param([string]$Step)

    if ($LASTEXITCODE -ne 0) {
        throw "$Step ha fallado con código de salida $LASTEXITCODE."
    }
}

function Assert-SafeDeploymentTarget {
    param([string]$Target)

    $fullTarget = [System.IO.Path]::GetFullPath($Target)
    $rootPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) +
        [System.IO.Path]::DirectorySeparatorChar

    if (-not $fullTarget.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Destino de despliegue no seguro: $fullTarget"
    }
}

Assert-SafeDeploymentTarget -Target $assetsTarget
Assert-SafeDeploymentTarget -Target $indexTarget

Write-Host "Construyendo portfolio React..." -ForegroundColor Cyan
Push-Location -LiteralPath $projectDirectory
try {
    # npm.cmd y no npm: en PowerShell, "npm" resuelve al wrapper npm.ps1, que
    # accede a $MyInvocation.Statement y revienta bajo Set-StrictMode -Version
    # Latest en Windows PowerShell 5.1 antes siquiera de lanzar el build.
    npm.cmd run build
    Assert-CommandSucceeded -Step "El build"
}
finally {
    Pop-Location
}

$distIndex = Join-Path $distDirectory "index.html"
$distAssets = Join-Path $distDirectory "assets"
if (-not (Test-Path -LiteralPath $distIndex) -or -not (Test-Path -LiteralPath $distAssets)) {
    throw "El build no contiene index.html y assets; se cancela el despliegue."
}

Write-Host "Sustituyendo el build publicado..." -ForegroundColor Cyan
Remove-Item -LiteralPath $assetsTarget -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $indexTarget -Force -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path $distDirectory "*") -Destination $repoRoot -Recurse -Force

Write-Host "Preparando commit..." -ForegroundColor Cyan
git -c "safe.directory=$gitSafeDirectory" -C $repoRoot add --all
Assert-CommandSucceeded -Step "git add"

git -c "safe.directory=$gitSafeDirectory" -C $repoRoot diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "No hay cambios nuevos que publicar." -ForegroundColor Yellow
    exit 0
}
if ($LASTEXITCODE -ne 1) {
    throw "No se pudo comprobar el contenido preparado para el commit."
}

git -c "safe.directory=$gitSafeDirectory" -C $repoRoot commit -m $CommitMessage
Assert-CommandSucceeded -Step "git commit"

Write-Host "Publicando en el remoto..." -ForegroundColor Cyan
git -c "safe.directory=$gitSafeDirectory" -C $repoRoot push
Assert-CommandSucceeded -Step "git push"

Write-Host "Despliegue completado correctamente." -ForegroundColor Green
