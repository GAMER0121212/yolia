$ErrorActionPreference = 'Stop'

try {
  Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Public
  $profile = Get-NetConnectionProfile -InterfaceAlias 'Wi-Fi'
  Write-Host "Red Wi-Fi: $($profile.Name)"
  Write-Host "Categoria: $($profile.NetworkCategory)"
} catch {
  Write-Host "No se pudo revertir la red: $($_.Exception.Message)"
}

Write-Host 'Listo. Ya puedes cerrar esta ventana.'
Start-Sleep -Seconds 5
