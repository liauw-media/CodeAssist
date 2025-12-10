# Resource Limiting Skill

Protect shared servers from resource exhaustion during development tasks.

## When to Use

- Running tests on a server that hosts other sites
- Running migrations on a shared database server
- Running any CPU/RAM intensive task on production/staging
- When you notice server becoming unresponsive during tasks

## The Problem

Development tasks like tests, builds, and migrations can consume 100% CPU/RAM, causing:
- Other websites on the server to stop responding
- SSH connections to hang
- Database connections to time out
- Server to become unreachable until task finishes

## Solution: Resource Limiting

### Quick Commands

**For tests (recommended):**
```bash
nice -n 19 ionice -c 3 vendor/bin/pest --processes=1
nice -n 19 ionice -c 3 npm test
nice -n 19 ionice -c 3 pytest
```

**For any heavy command:**
```bash
nice -n 19 ionice -c 3 <your-command>
```

### Tools

| Tool | Built-in? | What it Does |
|------|-----------|--------------|
| `nice -n 19` | Yes | Lowest CPU priority - other processes get CPU first |
| `ionice -c 3` | Yes | Lowest I/O priority - other processes get disk first |
| `cpulimit -l 50` | No | Hard limit to 50% CPU (install: `apt install cpulimit`) |
| `--processes=1` | N/A | Disable parallel testing |

### By Task Type

#### Running Tests
```bash
# Best for shared servers
nice -n 19 ionice -c 3 vendor/bin/pest --processes=1

# If you have cpulimit installed
cpulimit -l 50 -- vendor/bin/pest
```

#### Running Migrations
```bash
nice -n 19 php artisan migrate
nice -n 19 python manage.py migrate
```

#### Running Builds
```bash
nice -n 19 npm run build
nice -n 19 composer install
```

#### Running Heavy Scripts
```bash
nice -n 19 ionice -c 3 php artisan queue:work --once
```

### Advanced: systemd Resource Control

For Linux servers with systemd:
```bash
# Limit to 50% CPU and 1GB RAM
systemd-run --scope -p CPUQuota=50% -p MemoryMax=1G vendor/bin/pest

# Limit to 25% CPU and 512MB RAM
systemd-run --scope -p CPUQuota=25% -p MemoryMax=512M npm test
```

### Detection: Is This a Shared Server?

```bash
# Check for web servers
pgrep nginx && echo "Nginx running - shared server likely"
pgrep apache2 && echo "Apache running - shared server likely"
pgrep mysql && echo "MySQL running - shared server likely"

# Check for other PHP processes
pgrep -c php-fpm && echo "PHP-FPM running - shared server"
```

**Rule:** If web servers are running, use resource limits.

## Checklist

Before running heavy tasks on shared servers:

- [ ] Check if this is a shared/production server
- [ ] Use `nice -n 19` for CPU priority
- [ ] Use `ionice -c 3` for disk I/O priority
- [ ] Use `--processes=1` to disable parallel execution
- [ ] Consider running in CI/CD instead of on server

## Best Practice

**Add to your project's CLAUDE.md:**
```markdown
## Server Environment

This is a shared server hosting multiple sites.
ALWAYS use resource limits when running tests or heavy tasks:

```bash
nice -n 19 ionice -c 3 vendor/bin/pest --processes=1
```
```

## Related Skills

- `database-backup` - Backup before heavy operations
- `defense-in-depth` - Multiple safety layers
