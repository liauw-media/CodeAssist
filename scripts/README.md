# CodeAssist Scripts

Scripts for safe operations, backups, test result management, and autonomous development.

---

## Autonomous Development

CodeAssist provides **two modes** of autonomous development:

### Mode Comparison

| Mode | Command | Use Case | Requirements |
|------|---------|----------|--------------|
| **Interactive** | `/autonomous --issue 123` | In-session, supervised | GitHub MCP, Claude Code |
| **Headless** | `npx tsx ralph-runner.ts --issue=123` | Background, CI/CD, overnight | API key, Node.js 18+ |

### When to Use Which

**Use `/autonomous` (Interactive) when:**
- You're actively working in Claude Code
- You want to monitor progress in real-time
- You need to intervene during the loop
- You're working on a single issue

**Use Ralph (Headless) when:**
- You want unattended overnight runs
- You're processing multiple issues from an epic
- You're integrating with CI/CD pipelines
- You need Docker containerization

---

## Ralph Wiggum - Headless Runner

Autonomous development loop powered by the Claude Agent SDK. Runs quality gates, auto-fixes issues, and creates PRs when targets are met.

### Quick Start

```bash
# Install dependencies
cd scripts
npm install

# Validate configuration (dry run)
npx tsx ralph-runner.ts --issue=123 --dry-run

# Run on a single issue
npx tsx ralph-runner.ts --issue=123

# Run with production preset (stricter thresholds)
npx tsx ralph-runner.ts --issue=123 --preset=production

# Supervised mode (pause after each iteration)
npx tsx ralph-runner.ts --issue=123 --supervised
```

### Prerequisites

1. **Claude Code** installed: `curl -fsSL https://claude.ai/install.sh | bash`
2. **API key**: `export ANTHROPIC_API_KEY=your-key`
3. **GitHub CLI**: `gh auth login`
4. **Node.js 18+**

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    RALPH WIGGUM LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│  1. FETCH ISSUE → Read from GitHub/GitLab                      │
│  2. CREATE BRANCH → feature/{issue-id}-implement               │
│  3. IMPLEMENT → Code based on issue requirements               │
│  4. RUN QUALITY GATES (parallel groups)                        │
│     ├── Group 1: /test, /security, /build (required)           │
│     ├── Group 2: /review, /mentor, /ux (quality)               │
│     └── Group 3: /architect, /devops (advisory)                │
│  5. EVALUATE → Score >= 95? Create PR : Auto-fix & retry       │
│  6. CREATE PR → feature → staging (requires human review)      │
└─────────────────────────────────────────────────────────────────┘
```

### Quality Gates

| Gate | Weight | Required | Auto-Fix | Description |
|------|--------|----------|----------|-------------|
| `/test` | 25 | ✅ | ✅ | Tests pass + 80% coverage |
| `/security` | 25 | ✅ | ✅ | No critical/high vulnerabilities |
| `/build` | 15 | ✅ | ✅ | Project compiles |
| `/review` | 20 | ❌ | ✅ | Code quality, smells, duplication |
| `/mentor` | 10 | ❌ | ❌ | Architecture review |
| `/ux` | 5 | ❌ | ❌ | Accessibility (frontend only) |
| `/architect` | 0 | ❌ | ❌ | System security & performance |
| `/devops` | 0 | ❌ | ❌ | CI/CD and infrastructure |

### Configuration

Create `.claude/autonomous.yml`:

```yaml
target_score: 95
max_iterations: 15

gates:
  test:
    weight: 25
    required: true
    auto_fix: true
    parallel_group: 1
    timeout_ms: 300000  # 5 minutes

presets:
  production:
    target_score: 98
```

### Custom Gate Definitions

Gate definitions are loaded from `scripts/gates/*.yml`. Create custom gates:

```yaml
# gates/custom-gate.yml
name: custom-gate
description: My custom quality gate
tools:
  - Read
  - Glob
  - Grep
prompt: |
  You are a custom quality gate. Analyze the codebase for [specific criteria].

  OUTPUT JSON ONLY:
  {
    "passed": boolean,
    "issues": [...],
    "score": number
  }
```

### Docker Deployment

```bash
# Build
docker build -t ralph-wiggum scripts/

# Run
docker run -e ANTHROPIC_API_KEY=your-key \
  -e GITHUB_TOKEN=your-token \
  -v $(pwd):/workspace \
  ralph-wiggum --issue=123

# With version pinning
docker build --build-arg CLAUDE_CLI_VERSION=1.0.0 -t ralph-wiggum scripts/
```

### Architecture

```
ralph-runner.ts
├── RateLimiter        - API call rate limiting
├── CircuitBreaker     - Failure isolation (5 failures → 5min cooldown)
├── CheckpointManager  - Crash recovery state persistence
├── AuditLogger        - Tool call audit trail with rotation
├── MetricsCollector   - Run metrics and statistics
├── StructuredLogger   - JSON logging with levels
└── RunContext         - Coordinates all components
```

**Key Features:**
- Dependency injection for testability
- Type guards for SDK interfaces
- Gate execution timeouts (default: 5 minutes)
- External YAML gate definitions

### Safety Features

- ❌ **NEVER** push to main/master/staging
- ❌ **NEVER** include "Co-Authored-By: Claude"
- ❌ **NEVER** force push or auto-merge
- ✅ **ALWAYS** use PR workflow

### Human Intervention

Comment on GitHub issue:

| Command | Action |
|---------|--------|
| `@claude {instruction}` | Execute and continue |
| `@pause` / `@resume` | Control loop |
| `@skip-gate {gate}` | Skip with justification |

See [ralph-runner.ts](ralph-runner.ts) for full implementation.

---

## Playwright Report Sync (Tailscale NAS)

View Playwright test screenshots, videos, and traces from anywhere on your Tailscale network.

### Quick Setup

**On your NAS (one-time):**
```bash
# SSH to your NAS and run:
./scripts/playwright-nas-setup.sh
```

**On your test servers:**
```bash
# Create config
cp scripts/playwright-report.env.example .playwright-report.env
# Edit with your NAS details

# Run tests with auto-sync
./scripts/playwright-post-test.sh

# Or sync manually after tests
npx playwright test
./scripts/playwright-report-sync.sh
```

### Scripts

| Script | Where to Run | Purpose |
|--------|--------------|---------|
| `playwright-nas-setup.sh` | On NAS | Configure Tailscale serve + cleanup |
| `playwright-report-sync.sh` | On test server | Sync results to NAS |
| `playwright-post-test.sh` | On test server | Run tests + auto-sync |

### Configuration

Create `.playwright-report.env`:
```env
PLAYWRIGHT_NAS_HOST=your-nas.tailnet.ts.net
PLAYWRIGHT_NAS_PATH=/volume1/playwright-reports
PLAYWRIGHT_NAS_USER=admin
PLAYWRIGHT_REPORT_RETENTION=30
```

### Access Reports

After sync, view at:
```
https://your-nas.tailnet.ts.net:8080/latest/playwright-report/
```

### Security Notes

- Reports are **Tailscale-network only** (not public internet)
- Never use `tailscale funnel` (makes reports public)
- Cleanup runs daily, deleting reports older than 30 days
- Test artifacts may contain sensitive data (passwords in screenshots)

### Alternative Setups (No Tailscale)

**CI Artifacts (GitHub Actions):**
```yaml
- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report-${{ github.sha }}
    path: playwright-report/
    retention-days: 30
```

**S3/MinIO:**
```bash
# After tests
aws s3 sync playwright-report/ s3://your-bucket/reports/$(date +%Y-%m-%d)/
```

**Simple HTTP Server (internal network):**
```bash
# On report server
cd /path/to/reports
python -m http.server 8080
# Or: npx serve -l 8080
```

**Docker with Caddy + Basic Auth:**
```yaml
# docker-compose.yml
services:
  reports:
    image: caddy:alpine
    ports: ["8080:80"]
    volumes:
      - ./playwright-report:/srv
      - ./Caddyfile:/etc/caddy/Caddyfile
```
```
# Caddyfile
:80 {
    root * /srv
    file_server browse
    basicauth * {
        team JDJhJDE0JHNvbWVoYXNoZWRwYXNz
    }
}
```

---

## Database Backup Scripts

Scripts for backing up and restoring databases before destructive operations.

## Quick Start

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Create a backup
./scripts/backup-database.sh

# Run tests with automatic backup
./scripts/safe-test.sh npm test

# Run migrations with automatic backup
./scripts/safe-migrate.sh php artisan migrate

# Restore from latest backup
./scripts/restore-database.sh --latest
```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `backup-database.sh` | Create a timestamped backup |
| `restore-database.sh` | Restore from a backup file |
| `safe-test.sh` | Backup + run tests |
| `safe-migrate.sh` | Backup + run migrations |

## Supported Databases

- MySQL / MariaDB
- PostgreSQL
- SQLite

## Configuration

Scripts read database configuration from your `.env` file:

### Laravel / PHP
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=secret
```

### Node.js / Prisma
```env
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"
```

### Python / Django
```env
DB_HOST=localhost
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret
```

## Backup Location

Backups are stored in `backups/` directory:
```
backups/
  database_2025-01-06_15-30-00.sql
  database_2025-01-06_16-45-00.sql
  ...
```

The scripts keep the last 30 backups and automatically clean up older ones.

## Usage Examples

### Before running tests
```bash
# Instead of:
npm test

# Use:
./scripts/safe-test.sh npm test
```

### Before migrations
```bash
# Instead of:
php artisan migrate

# Use:
./scripts/safe-migrate.sh php artisan migrate
```

### Manual backup
```bash
./scripts/backup-database.sh
```

### Restore after a mistake
```bash
# Restore most recent backup
./scripts/restore-database.sh --latest

# Or restore specific backup
./scripts/restore-database.sh backups/database_2025-01-06_15-30-00.sql
```

## Continuous Backup Strategy

For production environments, these scripts are for development safety. For production, use:

### MySQL
```bash
# Cron job for daily backups
0 2 * * * mysqldump -u user -p'password' database > /backups/daily_$(date +\%Y\%m\%d).sql

# Or use automysqlbackup
apt install automysqlbackup
```

### PostgreSQL
```bash
# Cron job for daily backups
0 2 * * * pg_dump database > /backups/daily_$(date +\%Y\%m\%d).sql

# Or use pg_dump with compression
0 2 * * * pg_dump database | gzip > /backups/daily_$(date +\%Y\%m\%d).sql.gz
```

### Cloud Services

| Service | Backup Feature |
|---------|----------------|
| AWS RDS | Automated backups, point-in-time recovery |
| Google Cloud SQL | Automated backups |
| DigitalOcean | Managed database backups |
| PlanetScale | Automatic branching and backups |
| Supabase | Point-in-time recovery |

## Recovery Strategy

### Development
1. Run `./scripts/restore-database.sh --latest`
2. Verify data is correct
3. Continue development

### Production
1. Stop application traffic (maintenance mode)
2. Identify correct backup point
3. Restore from backup
4. Run any migrations that occurred after backup
5. Verify data integrity
6. Resume traffic

### Data Loss Prevention Checklist
- [ ] Daily automated backups enabled
- [ ] Backups stored off-site (different server/region)
- [ ] Backup restoration tested monthly
- [ ] Point-in-time recovery available for critical databases
- [ ] Retention policy defined (e.g., 30 days daily, 12 months monthly)

## Windows Users

These scripts require bash. Use:
- Git Bash (comes with Git for Windows)
- WSL (Windows Subsystem for Linux)
- MSYS2

```bash
# In Git Bash
./scripts/backup-database.sh
```
