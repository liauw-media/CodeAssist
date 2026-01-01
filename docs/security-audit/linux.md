# Linux Security Audit Commands

Reference commands for security auditing Linux systems.

## Network Exposure

```bash
# List all listening ports
sudo ss -tlnp
# or
sudo netstat -tlnp

# Check for services bound to all interfaces
sudo ss -tlnp | grep '0.0.0.0'

# Check firewall status
sudo ufw status verbose          # Ubuntu/Debian
sudo firewall-cmd --list-all     # RHEL/CentOS
sudo iptables -L -n              # Raw iptables

# Scan own ports
nmap -sT localhost
```

## Service Security

```bash
# List running services
systemctl list-units --type=service --state=running

# Check SSH configuration
sudo grep -E '^(PermitRootLogin|PasswordAuthentication|Port)' /etc/ssh/sshd_config

# Find services running as root
ps aux | awk '$1=="root" {print $11}' | sort -u

# Check sudo configuration
sudo cat /etc/sudoers | grep -v '^#' | grep -v '^$'
```

## File Permissions

```bash
# Find world-writable files
find / -type f -perm -0002 -ls 2>/dev/null | head -20

# Find world-writable directories
find / -type d -perm -0002 -ls 2>/dev/null | head -20

# Find SUID/SGID files
find / -type f \( -perm -4000 -o -perm -2000 \) -ls 2>/dev/null

# Check sensitive files
ls -la /etc/passwd /etc/shadow /etc/sudoers

# Find files with no owner
find / -nouser -o -nogroup 2>/dev/null | head -20
```

## Authentication

```bash
# List users with login shells
grep -E '/bin/(ba)?sh$' /etc/passwd

# Check for empty passwords
sudo awk -F: '($2 == "") {print $1}' /etc/shadow

# List root-equivalent users (UID 0)
awk -F: '($3 == 0) {print $1}' /etc/passwd

# Check password aging
sudo chage -l root

# List SSH authorized keys
find /home -name authorized_keys -exec cat {} \; 2>/dev/null
```

## Common Fixes

### Disable SSH Root Login

```bash
sudo sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### Disable SSH Password Auth

```bash
sudo sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### Enable Firewall (Ubuntu/Debian)

```bash
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

### Install fail2ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Enable Automatic Updates

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## SSL/TLS

```bash
# Check certificate expiry
echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

# Check supported TLS versions
nmap --script ssl-enum-ciphers -p 443 localhost
```
