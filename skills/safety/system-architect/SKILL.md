---
name: system-architect
description: "Use when performing security audits, performance analysis, or system architecture reviews. Acts as a senior system and security architect providing concrete recommendations with priority levels."
---

# System Architect

A senior system and security architect skill for auditing infrastructure, identifying vulnerabilities, and providing actionable hardening recommendations.

## When to Use

- Setting up a new server or environment
- Security audit before deployment
- Investigating performance issues
- Reviewing system architecture
- After major configuration changes
- Periodic security checkups

## Quick Commands

| Command | Purpose |
|---------|---------|
| `/architect security` | Full security audit |
| `/architect ports` | Check exposed ports and services |
| `/architect firewall` | Review firewall configuration |
| `/architect permissions` | Audit file and directory permissions |
| `/architect docker` | Docker security review |
| `/architect performance` | Performance analysis |
| `/architect scan` | Run automated security scanner |

## Security Scanner Integration

Use custom registry or public tools for automated dependency scanning.

### Option 1: Custom Registry Image

If you have a custom `security:scanner` image (see `docs/registry-config.md`):

```bash
# Local scanning
docker run --rm -v $(pwd):/app ${REGISTRY}/security:scanner \
  security-scan --type=composer --path=/app
```

```yaml
# CI/CD
security:
  image: ${REGISTRY}/security:scanner
  stage: test
  script:
    - security-scan --type=composer
  allow_failure: true
```

### Option 2: Public Tools (No Custom Image Required)

**PHP/Composer:**
```yaml
security:composer:
  image: php:8.3-cli
  stage: test
  script:
    - curl -sS https://getcomposer.org/installer | php
    - php composer.phar audit
  allow_failure: true
```

**Node.js/npm:**
```yaml
security:npm:
  image: node:20
  stage: test
  script:
    - npm audit --audit-level=high
  allow_failure: true
```

**Python/pip:**
```yaml
security:pip:
  image: python:3.12
  stage: test
  script:
    - pip install pip-audit
    - pip-audit -r requirements.txt
  allow_failure: true
```

**Multi-language (Trivy):**
```yaml
security:trivy:
  image: aquasec/trivy:latest
  stage: test
  script:
    - trivy fs --exit-code 0 --severity HIGH,CRITICAL .
  allow_failure: true
```

### Supported Scan Types

| Type | Tool (Public) | Custom Image |
|------|---------------|--------------|
| PHP/Composer | `composer audit` | `security-scan --type=composer` |
| Node.js/npm | `npm audit` | `security-scan --type=npm` |
| Python/pip | `pip-audit` | `security-scan --type=pip` |
| Multi-language | `trivy` | `security-scan --type=all` |
| Secrets | `gitleaks` | `security-scan --type=secrets` |

## Priority Levels

All findings are rated by severity:

| Level | Meaning | Action Required |
|-------|---------|-----------------|
| **CRITICAL** | Active vulnerability, immediate risk | Fix NOW |
| **HIGH** | Significant security gap | Fix within 24 hours |
| **MEDIUM** | Best practice violation | Fix within 1 week |
| **LOW** | Minor improvement opportunity | Fix when convenient |
| **INFO** | Informational, no action needed | Document only |

## Security Audit Protocol

### Phase 1: Network Exposure

Check what's exposed to the network.

#### Linux/macOS

```bash
# List all listening ports
sudo ss -tlnp
# or
sudo netstat -tlnp

# Check for services bound to 0.0.0.0 (all interfaces)
sudo ss -tlnp | grep '0.0.0.0'

# Check firewall status
sudo ufw status verbose          # Ubuntu/Debian
sudo firewall-cmd --list-all     # RHEL/CentOS
sudo iptables -L -n              # Raw iptables

# Scan own ports (requires nmap)
nmap -sT localhost
```

#### Windows

```powershell
# List all listening ports
netstat -an | findstr LISTENING

# Check Windows Firewall status
netsh advfirewall show allprofiles

# List firewall rules
netsh advfirewall firewall show rule name=all

# PowerShell: Get detailed port info
Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess | Sort-Object LocalPort
```

### Phase 2: Service Security

Audit running services and their configurations.

#### Linux/macOS

```bash
# List all running services
systemctl list-units --type=service --state=running

# Check SSH configuration
sudo cat /etc/ssh/sshd_config | grep -E '^(PermitRootLogin|PasswordAuthentication|Port)'

# Check for services running as root
ps aux | awk '$1=="root" {print $11}' | sort -u

# Check sudo configuration
sudo cat /etc/sudoers | grep -v '^#' | grep -v '^$'
```

#### Windows

```powershell
# List running services
Get-Service | Where-Object {$_.Status -eq 'Running'} | Select-Object Name, DisplayName, StartType

# Check Remote Desktop status
(Get-ItemProperty 'HKLM:\System\CurrentControlSet\Control\Terminal Server').fDenyTSConnections

# Check Windows services running as SYSTEM
Get-WmiObject Win32_Service | Where-Object {$_.StartName -eq 'LocalSystem' -and $_.State -eq 'Running'} | Select-Object Name, DisplayName
```

### Phase 3: File Permissions

Check for insecure file permissions.

#### Linux/macOS

```bash
# Find world-writable files
find / -type f -perm -0002 -ls 2>/dev/null | head -20

# Find world-writable directories
find / -type d -perm -0002 -ls 2>/dev/null | head -20

# Find SUID/SGID files
find / -type f \( -perm -4000 -o -perm -2000 \) -ls 2>/dev/null

# Check sensitive file permissions
ls -la /etc/passwd /etc/shadow /etc/sudoers

# Find files with no owner
find / -nouser -o -nogroup 2>/dev/null | head -20
```

#### Windows

```powershell
# Check permissions on sensitive directories
icacls "C:\Windows\System32"
icacls "$env:USERPROFILE"

# Find files with Everyone:Full Control
Get-ChildItem -Path C:\ -Recurse -ErrorAction SilentlyContinue |
    Get-Acl -ErrorAction SilentlyContinue |
    Where-Object { $_.AccessToString -match 'Everyone.*FullControl' } |
    Select-Object -First 20 Path
```

### Phase 4: Authentication & Access

Review authentication mechanisms.

#### Linux/macOS

```bash
# List users with login shells
grep -E '/bin/(ba)?sh$' /etc/passwd

# Check for empty passwords
sudo awk -F: '($2 == "") {print $1}' /etc/shadow

# List users with UID 0 (root equivalent)
awk -F: '($3 == 0) {print $1}' /etc/passwd

# Check password aging
sudo chage -l root

# List SSH authorized keys
find /home -name authorized_keys -exec cat {} \; 2>/dev/null
```

#### Windows

```powershell
# List local administrators
net localgroup Administrators

# Check password policy
net accounts

# List users
Get-LocalUser | Select-Object Name, Enabled, PasswordRequired, PasswordLastSet

# Check for users that never expire
Get-LocalUser | Where-Object {$_.PasswordNeverExpires -eq $true}
```

### Phase 5: Docker Security (if applicable)

#### Cross-platform

```bash
# Check Docker daemon exposure
docker info 2>/dev/null | grep -E 'Server Version|Storage Driver|Security Options'

# List containers running as root
docker ps -q | xargs docker inspect --format '{{.Name}}: User={{.Config.User}}' 2>/dev/null

# Check for privileged containers
docker ps -q | xargs docker inspect --format '{{.Name}}: Privileged={{.HostConfig.Privileged}}' 2>/dev/null

# Check exposed ports
docker ps --format "{{.Names}}: {{.Ports}}"

# Check volume mounts (sensitive paths)
docker ps -q | xargs docker inspect --format '{{.Name}}: {{range .Mounts}}{{.Source}}->{{.Destination}} {{end}}' 2>/dev/null

# Check for containers with host network
docker ps -q | xargs docker inspect --format '{{.Name}}: NetworkMode={{.HostConfig.NetworkMode}}' 2>/dev/null | grep host
```

### Phase 6: SSL/TLS Configuration

```bash
# Check SSL certificate expiry (replace domain)
echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates

# Check supported TLS versions
nmap --script ssl-enum-ciphers -p 443 localhost

# Check for weak ciphers (nginx)
grep -r ssl_ciphers /etc/nginx/

# Check for weak ciphers (Apache)
grep -r SSLCipherSuite /etc/apache2/ /etc/httpd/
```

## Findings Template

Document findings using this format:

```markdown
## Security Audit Findings - [DATE]

### CRITICAL

| Issue | Location | Recommendation |
|-------|----------|----------------|
| SSH root login enabled | /etc/ssh/sshd_config | Set PermitRootLogin no |

### HIGH

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Port 3306 exposed to internet | firewall | Bind MySQL to 127.0.0.1 |

### MEDIUM

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Password auth enabled for SSH | /etc/ssh/sshd_config | Use key-based auth only |

### LOW

| Issue | Location | Recommendation |
|-------|----------|----------------|
| No fail2ban installed | system | Install and configure fail2ban |
```

## Docchange Integration

After completing an audit, log the summary:

```bash
# Log audit completion
docchange "Security audit completed - found X critical, Y high, Z medium issues"

# Log individual fixes
docchange "FIXED: Disabled SSH root login"
docchange "FIXED: Bound MySQL to localhost only"
docchange "FIXED: Installed and configured fail2ban"
```

For major audits, create a detailed findings file:

```bash
# Create detailed audit report
cat > ~/docs/$(date +%Y-%m-%d)/security-audit.md << 'EOF'
# Security Audit Report

## Summary
- Critical: 0
- High: 2
- Medium: 5
- Low: 3

## Findings
[Detailed findings here]

## Remediation Plan
[Steps to fix issues]
EOF

docchange "Security audit report - see security-audit.md"
```

## Common Security Issues & Fixes

### CRITICAL: SSH Root Login Enabled

```bash
# Check
grep PermitRootLogin /etc/ssh/sshd_config

# Fix
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Log
docchange "FIXED: Disabled SSH root login"
```

### CRITICAL: Database Exposed to Internet

```bash
# Check MySQL
sudo ss -tlnp | grep 3306

# Fix MySQL - bind to localhost
# In /etc/mysql/mysql.conf.d/mysqld.cnf:
# bind-address = 127.0.0.1

# Fix PostgreSQL - in postgresql.conf:
# listen_addresses = 'localhost'

# Log
docchange "FIXED: Bound database to localhost only"
```

### HIGH: No Firewall Active

```bash
# Ubuntu/Debian
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Log
docchange "FIXED: Enabled UFW firewall with default deny incoming"
```

### HIGH: Weak SSH Configuration

```bash
# Recommended /etc/ssh/sshd_config settings:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowTcpForwarding no

# Log
docchange "FIXED: Hardened SSH configuration"
```

### MEDIUM: No Automatic Updates

```bash
# Ubuntu/Debian
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Log
docchange "FIXED: Enabled automatic security updates"
```

### MEDIUM: No fail2ban

```bash
# Install
sudo apt install fail2ban

# Basic config
sudo cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Log
docchange "FIXED: Installed and configured fail2ban"
```

## Docker Security Checklist

- [ ] Containers not running as root
- [ ] No privileged containers unless necessary
- [ ] Sensitive ports bound to localhost
- [ ] No sensitive host paths mounted
- [ ] Images from trusted sources only
- [ ] Resource limits set (memory, CPU)
- [ ] No secrets in environment variables
- [ ] Docker socket not exposed

### Fix: Docker Compose Port Binding

```yaml
# INSECURE - exposed to all interfaces
ports:
  - "5432:5432"

# SECURE - localhost only
ports:
  - "127.0.0.1:5432:5432"
```

## Full Audit Checklist

### Network Security
- [ ] Firewall enabled and configured
- [ ] Only necessary ports exposed
- [ ] Services bound to localhost where possible
- [ ] No unnecessary services running
- [ ] SSL/TLS properly configured

### Authentication
- [ ] SSH key-based auth only
- [ ] Root login disabled
- [ ] Strong password policy
- [ ] No empty passwords
- [ ] fail2ban or similar installed

### File System
- [ ] No world-writable sensitive files
- [ ] Proper ownership on system files
- [ ] SUID/SGID files reviewed
- [ ] Sensitive files protected (600/640)

### Services
- [ ] Services running as non-root users
- [ ] Unnecessary services disabled
- [ ] Service configurations hardened
- [ ] Logs properly configured

### Updates
- [ ] System packages up to date
- [ ] Automatic security updates enabled
- [ ] EOL software identified and planned for upgrade

### Docker (if applicable)
- [ ] Containers not privileged
- [ ] Images from trusted sources
- [ ] Secrets not in environment variables
- [ ] Resource limits configured

## Output Format

When running an audit, output findings in this format:

```
================================================================================
SECURITY AUDIT REPORT
Date: 2024-01-15
Host: server-name
================================================================================

CRITICAL (0)
------------
None found.

HIGH (2)
--------
[HIGH] MySQL bound to 0.0.0.0:3306
       Location: /etc/mysql/mysql.conf.d/mysqld.cnf
       Fix: Set bind-address = 127.0.0.1

[HIGH] SSH password authentication enabled
       Location: /etc/ssh/sshd_config
       Fix: Set PasswordAuthentication no

MEDIUM (3)
----------
[MEDIUM] No fail2ban installed
         Fix: apt install fail2ban && systemctl enable fail2ban

[MEDIUM] Automatic updates not configured
         Fix: apt install unattended-upgrades

[MEDIUM] SSH MaxAuthTries not set
         Location: /etc/ssh/sshd_config
         Fix: Set MaxAuthTries 3

LOW (1)
-------
[LOW] SSH X11Forwarding enabled
      Location: /etc/ssh/sshd_config
      Fix: Set X11Forwarding no

================================================================================
SUMMARY: 0 Critical | 2 High | 3 Medium | 1 Low
================================================================================
```

## Integration with Other Skills

**Use with:**
- `server-documentation` - Log all findings and fixes
- `defense-in-depth` - Apply layered security
- `database-backup` - Before making changes

**Workflow:**
1. Run security audit
2. Document findings via docchange
3. Prioritize by severity
4. Fix issues starting with CRITICAL
5. Log each fix via docchange
6. Re-audit to verify fixes

## Tips

1. **Run audits regularly** - Monthly at minimum, weekly for production
2. **Document everything** - Use docchange for all findings and fixes
3. **Prioritize ruthlessly** - CRITICAL first, always
4. **Test fixes** - Verify services still work after hardening
5. **Keep backups** - Before major security changes
6. **Monitor logs** - Security is ongoing, not one-time

## Authority

This skill embeds senior security architect expertise:
- OWASP security guidelines
- CIS benchmarks for system hardening
- Industry best practices from major cloud providers
- Real-world production security experience

---

**Bottom Line**: Security is not optional. Run regular audits, document findings, fix issues by priority, and log everything with docchange.
