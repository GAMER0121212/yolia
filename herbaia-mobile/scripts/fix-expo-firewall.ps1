$ErrorActionPreference = 'Stop'

try {
  Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private
} catch {
  Write-Host "No se pudo cambiar la red a Privada: $($_.Exception.Message)"
}

$node = 'C:\Program Files\nodejs\node.exe'
if (Get-NetFirewallApplicationFilter -PolicyStore ActiveStore -ErrorAction SilentlyContinue | Where-Object { $_.Program -eq $node }) {
  Write-Host 'Ya existia una regla de Node.js'
}

New-NetFirewallRule -DisplayName 'Node.js Expo Go' -Direction Inbound -Program $node -Action Allow -Profile Any -ErrorAction SilentlyContinue | Out-Null
New-NetFirewallRule -DisplayName 'Herbaia Expo 8081' -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow -Profile Any -ErrorAction SilentlyContinue | Out-Null
New-NetFirewallRule -DisplayName 'Herbaia API 3000' -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Any -ErrorAction SilentlyContinue | Out-Null

$profile = Get-NetConnectionProfile -InterfaceAlias 'Wi-Fi'
Write-Host "Red Wi-Fi: $($profile.Name)"
Write-Host "Categoria: $($profile.NetworkCategory)"
Write-Host 'Listo. Ya puedes cerrar esta ventana.'
Start-Sleep -Seconds 6
