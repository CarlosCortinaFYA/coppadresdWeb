<#
.SYNOPSIS
  Despliegue manual de la web pública de Agentic Wellness.

.DESCRIPTION
  Replica exactamente los pasos de .github/workflows/deploy-web.yml.
  Úsalo mientras la cuenta del repositorio tenga GitHub Actions bloqueado
  por facturación.

.EXAMPLE
  .\scripts\deploy-manual.ps1

.EXAMPLE
  .\scripts\deploy-manual.ps1 -SkipInstall
#>
[CmdletBinding()]
param(
    [string]$Bucket = "agenticwellness-web-prod",
    [string]$DistributionId = "E1ZP9OC19HM5K4",
    [string]$Region = "us-east-2",
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
Push-Location (Split-Path $PSScriptRoot -Parent)

try {
    if (-not $SkipInstall) {
        Write-Host "Instalando dependencias..."
        npm ci --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw "npm ci fallo" }
    }

    Write-Host "Compilando..."
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build fallo" }
    if (-not (Test-Path "dist/index.html")) { throw "no existe dist/index.html" }

    # Orden identico al workflow: assets con hash, HTML, luego limpieza de huerfanos.
    Write-Host "Subiendo assets..."
    aws s3 sync dist/assets "s3://$Bucket/assets" `
        --size-only --cache-control "public, max-age=31536000, immutable" --region $Region
    if ($LASTEXITCODE -ne 0) { throw "sync de assets fallo" }

    Write-Host "Subiendo estaticos de raiz..."
    aws s3 sync dist "s3://$Bucket" `
        --exclude "index.html" --exclude "assets/*" `
        --cache-control "public, max-age=3600" --region $Region
    if ($LASTEXITCODE -ne 0) { throw "sync de raiz fallo" }

    Write-Host "Publicando index.html sin cache..."
    aws s3 cp dist/index.html "s3://$Bucket/index.html" `
        --cache-control "no-cache, must-revalidate" `
        --content-type "text/html; charset=utf-8" --region $Region
    if ($LASTEXITCODE -ne 0) { throw "copia de index.html fallo" }

    Write-Host "Limpiando assets huerfanos..."
    aws s3 sync dist/assets "s3://$Bucket/assets" `
        --delete --size-only --cache-control "public, max-age=31536000, immutable" --region $Region
    if ($LASTEXITCODE -ne 0) { throw "limpieza de assets fallo" }

    Write-Host "Invalidando CloudFront..."
    $invalidation = aws cloudfront create-invalidation `
        --distribution-id $DistributionId --paths "/*" `
        --query "Invalidation.Id" --output text
    if ($LASTEXITCODE -ne 0) { throw "invalidacion fallo" }
    Write-Host "Invalidacion: $invalidation"

    aws cloudfront wait invalidation-completed `
        --distribution-id $DistributionId --id $invalidation

    Write-Host "Verificando produccion..."
    curl.exe -sS -o NUL -w "www.agenticwellness.ai -> %{http_code}`n" `
        -H "Cache-Control: no-cache" https://www.agenticwellness.ai/

    Write-Host "Despliegue completado."
}
finally {
    Pop-Location
}
