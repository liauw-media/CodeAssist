# Windows Security Audit Commands

Reference commands for security auditing Windows systems.

## Network Exposure

```powershell
# List all listening ports
netstat -an | findstr LISTENING

# Detailed with process info
Get-NetTCPConnection -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess,@{Name="Process";Expression={(Get-Process -Id $_.OwningProcess).ProcessName}}

# Check for services bound to all interfaces (0.0.0.0)
netstat -an | findstr "0.0.0.0.*LISTENING"

# Check Windows Firewall status
Get-NetFirewallProfile | Select-Object Name,Enabled

# List firewall rules (inbound)
Get-NetFirewallRule -Direction Inbound -Enabled True | Select-Object DisplayName,Action
```

## Remote Access

```powershell
# Check RDP status
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections"

# Check RDP NLA (Network Level Authentication)
Get-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication"

# List installed remote access software
Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -match "VNC|TeamViewer|AnyDesk|NoMachine|Remote"} | Select-Object Name,Version

# Check Remote Desktop Users group
net localgroup "Remote Desktop Users"
```

## Service Security

```powershell
# List running services
Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name,DisplayName,StartType

# Find services running as SYSTEM
Get-WmiObject Win32_Service | Where-Object {$_.StartName -eq "LocalSystem" -and $_.State -eq "Running"} | Select-Object Name,StartName

# Check for auto-start services
Get-Service | Where-Object {$_.StartType -eq "Automatic"} | Select-Object Name,DisplayName
```

## User Accounts

```powershell
# List local users
Get-LocalUser | Select-Object Name,Enabled,PasswordRequired,PasswordLastSet

# List administrators
net localgroup Administrators

# Check for accounts with no password expiry
Get-LocalUser | Where-Object {$_.PasswordNeverExpires} | Select-Object Name

# Check password policy
net accounts
```

## File Permissions

```powershell
# Check permissions on sensitive directories
icacls "C:\Windows\System32\config"
icacls "C:\Users"

# Find world-writable directories in Program Files
Get-ChildItem "C:\Program Files" -Directory | ForEach-Object {
    $acl = Get-Acl $_.FullName
    if ($acl.Access | Where-Object {$_.IdentityReference -match "Everyone|Users" -and $_.FileSystemRights -match "Write"}) {
        $_.FullName
    }
}
```

## Common Fixes

### Enable Windows Firewall

```powershell
# Enable all profiles
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

### Disable RDP (if not needed)

```powershell
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 1
```

### Enable RDP NLA

```powershell
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name "UserAuthentication" -Value 1
```

### Set Strong Password Policy

```powershell
# Via secpol.msc or:
net accounts /minpwlen:12 /maxpwage:90 /minpwage:1 /uniquepw:5
```

### Block Unused Ports

```powershell
# Block inbound on specific port
New-NetFirewallRule -DisplayName "Block Port 3389" -Direction Inbound -LocalPort 3389 -Protocol TCP -Action Block
```

## SSL/TLS

```powershell
# Check certificate on local HTTPS service
$uri = "https://localhost:443"
$req = [Net.HttpWebRequest]::Create($uri)
$req.GetResponse() | Out-Null
$cert = $req.ServicePoint.Certificate
$cert.GetExpirationDateString()

# Check TLS settings in registry
Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server' -ErrorAction SilentlyContinue
```

## Windows Defender

```powershell
# Check Defender status
Get-MpComputerStatus | Select-Object AntivirusEnabled,RealTimeProtectionEnabled,AntivirusSignatureLastUpdated

# Run quick scan
Start-MpScan -ScanType QuickScan

# Check for threats
Get-MpThreatDetection
```
