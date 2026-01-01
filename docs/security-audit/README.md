# Security Audit Reference

Platform-specific commands for security auditing. Use with the `system-architect` skill.

## Quick Start

```bash
# Use the /architect or /security command
/architect audit this system
/security check network exposure
```

## Reference Docs

| Platform | Document |
|----------|----------|
| Linux/macOS | [linux.md](linux.md) |
| Windows | [windows.md](windows.md) |
| Docker | [docker.md](docker.md) |

## What's Covered

### Network Exposure
- Listening ports
- Services bound to 0.0.0.0
- Firewall status
- SSL/TLS configuration

### Authentication
- SSH/RDP configuration
- Password policies
- User accounts
- Privilege escalation

### Services
- Running services
- Auto-start programs
- Service accounts

### Docker (if applicable)
- Container exposure
- Privileged mode
- Secrets in environment
- Image security

## Usage

These docs provide **reference commands only**. For audit methodology and prioritization, see:

```
skills/safety/system-architect/SKILL.md
```

## Severity Levels

| Level | Action |
|-------|--------|
| CRITICAL | Fix immediately |
| HIGH | Fix within 24h |
| MEDIUM | Fix within 1 week |
| LOW | Fix when convenient |
