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

function Resolve-NpmPath {
    # -CommandType Application es la clave: fuerza a resolver el ejecutable real
    # (npm.cmd en Windows) y descarta el wrapper npm.ps1, que accede a
    # $MyInvocation.Statement y lanza excepción bajo Set-StrictMode -Version
    # Latest en Windows PowerShell 5.1, antes siquiera de arrancar el build.
    $npm = Get-Command -Name "npm" -CommandType Application -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if (-not $npm) {
        throw "No se ha encontrado npm en el PATH. Instala Node.js o revisa la variable PATH."
    }

    return $npm.Source
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

$npmPath = Resolve-NpmPath

Push-Location -LiteralPath $projectDirectory
try {
    if (-not (Test-Path -LiteralPath (Join-Path $projectDirectory "node_modules"))) {
        Write-Host "Instalando dependencias..." -ForegroundColor Cyan
        & $npmPath ci
        Assert-CommandSucceeded -Step "La instalación de dependencias"
    }

    Write-Host "Construyendo portfolio React..." -ForegroundColor Cyan
    & $npmPath run build
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
