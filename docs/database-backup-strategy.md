# Database Backup & Safety Strategy

*Version: 1.0 | Last Updated: 2025-10-30*

---

## 🚨 CRITICAL: Why This Matters

**Real incidents that prompted this guide:**
- 2 production databases wiped without backups when tests were run
- Commands executed against wrong environment
- Migrations run on production instead of development
- Data loss requiring days of recovery work

**This guide prevents these disasters.**

---

## Table of Contents

1. [Mandatory Rules for All Developers & AI Agents](#mandatory-rules)
2. [Pre-Execution Checklist](#pre-execution-checklist)
3. [Backup Scripts Reference](#backup-scripts-reference)
4. [Database-Specific Implementations](#database-specific-implementations)
5. [Periodic Backup Strategy](#periodic-backup-strategy)
6. [Testing Strategy](#testing-strategy)
7. [Disaster Recovery Procedures](#disaster-recovery-procedures)
8. [CI/CD Integration](#cicd-integration)
9. [Monitoring & Alerts](#monitoring-alerts)
10. [Best Practices](#best-practices)

---

## Mandatory Rules

### ⚠️ ABSOLUTE REQUIREMENTS - NO EXCEPTIONS

**BEFORE running ANY of the following, a database backup is MANDATORY:**
- ❌ Running tests (unit, integration, e2e, feature, acceptance)
- ❌ Running database migrations (up or down)
- ❌ Running database seeds/fixtures
- ❌ Running any command that reads/writes to database
- ❌ Running any deployment scripts
- ❌ Running any data modification scripts
- ❌ Running database schema changes
- ❌ Running database clean/reset commands

**NEVER:**
- ❌ Run tests against production database
- ❌ Run commands without verifying environment first
- ❌ Skip backup steps "just this once"
- ❌ Assume the environment is safe
- ❌ Trust environment variables without verification
- ❌ Run direct database queries without backup
- ❌ Use production database for development/testing

### Environment Safety Rules

**Development/Testing environments ONLY:**
- ✅ `DB_HOST` = `localhost` or `127.0.0.1` or `::1`
- ✅ `APP_ENV` = `development` or `testing` or `local`
- ✅ `DB_DATABASE` contains `_dev`, `_test`, `_local`, or similar

**Production indicators (STOP IMMEDIATELY):**
- 🚨 `APP_ENV` = `production` or `prod`
- 🚨 `DB_DATABASE` contains `prod`, `production`, `live`
- 🚨 `DB_HOST` is a remote IP or domain (not localhost)
- 🚨 Any certificate-based authentication
- 🚨 Read-replica or cluster endpoints

---

## Pre-Execution Checklist

### Before EVERY database-touching command:

```bash
# 1. VERIFY ENVIRONMENT
echo "==========================================="
echo "ENVIRONMENT VERIFICATION"
echo "==========================================="
echo "Environment: $APP_ENV"
echo "Database: $DB_DATABASE"
echo "Database Host: $DB_HOST"
echo "Database Port: $DB_PORT"
echo "Connection Type: $DB_CONNECTION"
echo "==========================================="

# 2. CHECK FOR PRODUCTION INDICATORS
if [[ "$APP_ENV" == "production" ]] || \
   [[ "$APP_ENV" == "prod" ]] || \
   [[ "$DB_DATABASE" == *"prod"* ]] || \
   [[ "$DB_DATABASE" == *"production"* ]] || \
   [[ "$DB_DATABASE" == *"live"* ]] || \
   [[ "$DB_HOST" != "localhost" && "$DB_HOST" != "127.0.0.1" ]]; then
    echo "🚨 PRODUCTION DATABASE DETECTED!"
    echo "Operation ABORTED for safety."
    exit 1
fi

# 3. VERIFY DATABASE CONNECTION
# [Database-specific command - see section below]

# 4. CREATE MANDATORY BACKUP
echo "Creating mandatory backup..."
./scripts/backup-database.sh

# 5. VERIFY BACKUP SUCCESS
if [ $? -ne 0 ]; then
    echo "❌ Backup FAILED - operation aborted"
    exit 1
fi

# 6. ONLY NOW - Run your command
echo "✅ Safe to proceed"
```

---

## Backup Scripts Reference

### Core Backup Scripts

All scripts are located in `scripts/` directory:

#### 1. `backup-database.sh`
**Purpose**: Create timestamped database backup
**When to use**: Before ANY database operation
**Usage**:
```bash
./scripts/backup-database.sh
```

**Features**:
- Automatic environment verification
- Production database protection
- Timestamped backup files
- Size verification
- Auto-cleanup (keeps last 10 backups)
- Multi-database support (PostgreSQL, MySQL, SQLite, MongoDB)

**Output**: `backups/[database]_[timestamp].sql` or `.dump`

---

#### 2. `restore-database.sh`
**Purpose**: Restore database from backup
**When to use**: After data corruption, failed migration, or test damage
**Usage**:
```bash
# List available backups
./scripts/restore-database.sh

# Restore specific backup
./scripts/restore-database.sh backups/mydb_20251030_143022.sql
```

**Features**:
- Interactive confirmation
- Production restore protection
- Backup file verification
- Database-specific restore commands

---

#### 3. `safe-test.sh`
**Purpose**: Wrapper for test commands with automatic backup
**When to use**: ALWAYS when running tests
**Usage**:
```bash
# Python
./scripts/safe-test.sh pytest
./scripts/safe-test.sh python manage.py test

# Node.js
./scripts/safe-test.sh npm test
./scripts/safe-test.sh npm run test:e2e

# PHP
./scripts/safe-test.sh phpunit
./scripts/safe-test.sh ./vendor/bin/phpunit

# Go
./scripts/safe-test.sh go test ./...

# Ruby
./scripts/safe-test.sh rspec
./scripts/safe-test.sh bundle exec rails test
```

**Features**:
- Automatic environment verification
- Pre-test backup
- Post-test status reporting
- Exit code preservation

---

#### 4. `setup-periodic-backups.sh`
**Purpose**: Setup automated periodic backups via cron
**When to use**: During project initialization or when enabling auto-backups
**Usage**:
```bash
./scripts/setup-periodic-backups.sh
```

**Default schedule**: Every 6 hours
**Customization**: Edit crontab with `crontab -e`

---

## Database-Specific Implementations

### PostgreSQL

**Backup command**:
```bash
pg_dump -U $DB_USERNAME -h $DB_HOST -p ${DB_PORT:-5432} \
  --format=custom \
  --file="backups/${DB_DATABASE}_${TIMESTAMP}.dump" \
  "$DB_DATABASE"
```

**Restore command**:
```bash
pg_restore -U $DB_USERNAME -h $DB_HOST -p ${DB_PORT:-5432} \
  --clean --if-exists \
  -d "$DB_DATABASE" \
  "$BACKUP_FILE"
```

**Verify connection**:
```bash
psql -U $DB_USERNAME -h $DB_HOST -p ${DB_PORT:-5432} \
  -c "SELECT current_database();" -t
```

**Environment variables required**:
- `DB_USERNAME`
- `DB_PASSWORD` (via PGPASSWORD or .pgpass)
- `DB_HOST`
- `DB_PORT` (default: 5432)
- `DB_DATABASE`

---

### MySQL/MariaDB

**Backup command**:
```bash
mysqldump -u $DB_USERNAME -p"$DB_PASSWORD" \
  -h $DB_HOST -P ${DB_PORT:-3306} \
  --single-transaction \
  --routines --triggers \
  "$DB_DATABASE" > "backups/${DB_DATABASE}_${TIMESTAMP}.sql"
```

**Restore command**:
```bash
mysql -u $DB_USERNAME -p"$DB_PASSWORD" \
  -h $DB_HOST -P ${DB_PORT:-3306} \
  "$DB_DATABASE" < "$BACKUP_FILE"
```

**Verify connection**:
```bash
mysql -u $DB_USERNAME -p"$DB_PASSWORD" \
  -h $DB_HOST -P ${DB_PORT:-3306} \
  -e "SELECT DATABASE();" -s -N
```

**Environment variables required**:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT` (default: 3306)
- `DB_DATABASE`

---

### SQLite

**Backup command**:
```bash
sqlite3 "$DB_DATABASE" ".backup 'backups/${DB_DATABASE}_${TIMESTAMP}.db'"
# Or simple file copy:
cp "$DB_DATABASE" "backups/${DB_DATABASE}_${TIMESTAMP}.db"
```

**Restore command**:
```bash
cp "$BACKUP_FILE" "$DB_DATABASE"
```

**Verify connection**:
```bash
sqlite3 "$DB_DATABASE" "SELECT 'connected';"
```

**Environment variables required**:
- `DB_DATABASE` (file path)

---

### MongoDB

**Backup command**:
```bash
mongodump \
  --uri="mongodb://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:${DB_PORT:-27017}/$DB_DATABASE" \
  --out="backups/${DB_DATABASE}_${TIMESTAMP}"
```

**Restore command**:
```bash
mongorestore \
  --uri="mongodb://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:${DB_PORT:-27017}/$DB_DATABASE" \
  --drop \
  "$BACKUP_FILE"
```

**Verify connection**:
```bash
mongosh "mongodb://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:${DB_PORT:-27017}/$DB_DATABASE" \
  --eval "db.getName()"
```

**Environment variables required**:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT` (default: 27017)
- `DB_DATABASE`

---

## Periodic Backup Strategy

### Backup Frequency Recommendations

| Environment | Frequency | Retention | Method |
|-------------|-----------|-----------|---------|
| Development | Every 6 hours | Last 10 backups | Cron + auto-cleanup |
| Testing | Before each test run | Last 5 backups | Pre-test hook |
| Staging | Every 2 hours | Last 24 backups | Cron + monitoring |
| Production | Every 15 minutes + daily full | 30 days | Automated + offsite |

### Development/Testing Cron Setup

**Default schedule (every 6 hours)**:
```bash
0 */6 * * * cd /path/to/project && ./scripts/backup-database.sh >> backups/backup.log 2>&1
```

**Hourly backups**:
```bash
0 * * * * cd /path/to/project && ./scripts/backup-database.sh >> backups/backup.log 2>&1
```

**Daily backups (2 AM)**:
```bash
0 2 * * * cd /path/to/project && ./scripts/backup-database.sh >> backups/backup.log 2>&1
```

### Setup Instructions

```bash
# Run the setup script
./scripts/setup-periodic-backups.sh

# Or manually configure
crontab -e
# Add one of the cron entries above

# Verify cron job
crontab -l | grep backup

# Check backup logs
tail -f backups/backup.log
```

### Backup Rotation

**Automatic cleanup** (keeps last N backups):
```bash
# In backup-database.sh
ls -t backups/ | tail -n +11 | xargs -I {} rm -rf backups/{}
```

**Manual cleanup** (keep backups older than 7 days):
```bash
find backups/ -type f -mtime +7 -delete
```

---

## Testing Strategy

### Test Database Configuration

**Recommended approach**: Separate test database

**Example .env.testing**:
```env
APP_ENV=testing
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp_test
DB_USERNAME=test_user
DB_PASSWORD=test_password
```

### Test Execution Workflow

**1. NEVER run tests directly**:
```bash
# ❌ WRONG - NEVER DO THIS:
npm test
pytest
phpunit
go test
```

**2. ALWAYS use safe-test wrapper**:
```bash
# ✅ CORRECT:
./scripts/safe-test.sh npm test
./scripts/safe-test.sh pytest
./scripts/safe-test.sh phpunit
./scripts/safe-test.sh go test ./...
```

### Test Suite Organization

**Unit tests**: Don't touch database (no backup needed)
**Integration tests**: Touch database (backup required)
**E2E tests**: Touch database (backup required)
**Feature tests**: Touch database (backup required)

**Separate test commands**:
```bash
# Unit tests (no database)
npm run test:unit          # No backup needed

# Integration tests (database)
./scripts/safe-test.sh npm run test:integration

# E2E tests (database)
./scripts/safe-test.sh npm run test:e2e

# All tests
./scripts/safe-test.sh npm test
```

### Test Database Reset Strategy

**Option 1: Restore from backup (RECOMMENDED)**:
```bash
# Before test suite
./scripts/backup-database.sh

# Run tests
npm test

# After tests (restore clean state)
./scripts/restore-database.sh backups/[latest].sql
```

**Option 2: Database transactions (if supported)**:
```python
# Example: Django/pytest with database transactions
# pytest.ini or conftest.py
@pytest.fixture(scope="function", autouse=True)
def db_transaction(db):
    # Tests run in transaction, auto-rollback after each test
    pass
```

**Option 3: Recreate from migrations**:
```bash
# Drop and recreate
./scripts/safe-test.sh npm run db:reset
```

---

## Disaster Recovery Procedures

### Scenario 1: Tests Corrupted Database

**Symptoms**: Database in inconsistent state, foreign key errors, missing data

**Recovery**:
```bash
# 1. List available backups
ls -lth backups/ | head -10

# 2. Identify backup created before tests
# Format: mydb_20251030_143022.sql

# 3. Restore
./scripts/restore-database.sh backups/mydb_20251030_143022.sql

# 4. Verify restoration
[run database verification query]

# 5. Re-run tests with safe wrapper
./scripts/safe-test.sh npm test
```

---

### Scenario 2: Migration Failed Midway

**Symptoms**: Migration partially applied, schema inconsistent

**Recovery**:
```bash
# 1. DO NOT run migration down (may make it worse)

# 2. Restore pre-migration backup
./scripts/restore-database.sh backups/[backup-before-migration].sql

# 3. Fix migration code

# 4. Test migration on fresh backup
./scripts/backup-database.sh
[run migration]

# 5. If successful, apply to main database
```

---

### Scenario 3: Ran Command Against Production (OH NO!)

**Immediate actions**:
```bash
# 1. STOP ALL OPERATIONS IMMEDIATELY

# 2. Check if production backup exists
ls -lth /production/backups/ | head -5

# 3. If backup exists less than 1 hour old:
#    Contact team lead
#    Assess damage
#    Prepare rollback plan

# 4. If no recent backup:
#    IMMEDIATELY create backup of current state
#    Document what happened
#    Escalate to senior team

# 5. Follow incident response protocol
#    [Link to your company's incident response]
```

**Prevention (should never happen)**:
- All scripts check for production environment
- Separate credentials for dev/prod
- Network isolation
- VPN/bastion requirements for prod access
- 2FA for production database access

---

### Scenario 4: All Backups Corrupted/Missing

**Prevention (before it happens)**:
```bash
# Setup offsite backup (daily)
# Example: rsync to remote server
0 3 * * * rsync -az /path/to/backups/ user@backup-server:/backups/project-name/

# Or cloud backup (AWS S3, Google Cloud Storage)
0 3 * * * aws s3 sync /path/to/backups/ s3://my-backups/project-name/

# Or GitLab/GitHub artifacts (for small databases)
# In .gitlab-ci.yml or .github/workflows/backup.yml
```

**Recovery**:
1. Check offsite backups
2. Check CI/CD backup artifacts
3. Restore from development databases (if applicable)
4. Rebuild from production backups (if dev lost prod data)
5. Last resort: Rebuild schema and reseed

---

## CI/CD Integration

### GitHub Actions Example

**.github/workflows/test.yml**:
```yaml
name: Tests with Database Backup

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: test_database
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup environment
        run: |
          cp .env.testing .env
          mkdir -p backups

      - name: Install dependencies
        run: npm install

      - name: Setup database
        run: npm run db:migrate

      - name: Create pre-test backup
        run: ./scripts/backup-database.sh

      - name: Run tests with safe wrapper
        run: ./scripts/safe-test.sh npm test

      - name: Upload backup artifact (on failure)
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: database-backup-${{ github.sha }}
          path: backups/
          retention-days: 7
```

---

### GitLab CI Example

**.gitlab-ci.yml**:
```yaml
stages:
  - test
  - backup

test:
  stage: test
  image: node:18
  services:
    - postgres:15
  variables:
    POSTGRES_DB: test_database
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_password
    DB_HOST: postgres
  before_script:
    - cp .env.testing .env
    - mkdir -p backups
    - npm install
    - npm run db:migrate
  script:
    - ./scripts/backup-database.sh
    - ./scripts/safe-test.sh npm test
  artifacts:
    when: on_failure
    paths:
      - backups/
    expire_in: 1 week

backup:production:
  stage: backup
  only:
    - schedules
  script:
    - ./scripts/backup-database.sh
    - aws s3 cp backups/ s3://my-backups/production/ --recursive
```

---

## Monitoring & Alerts

### Backup Health Checks

**Check backup recency**:
```bash
#!/bin/bash
# scripts/check-backup-health.sh

LATEST_BACKUP=$(ls -t backups/ | head -1)
BACKUP_AGE=$(( ($(date +%s) - $(stat -f%m "backups/$LATEST_BACKUP" 2>/dev/null || stat -c%Y "backups/$LATEST_BACKUP")) / 3600 ))

if [ $BACKUP_AGE -gt 12 ]; then
    echo "⚠️  WARNING: Latest backup is $BACKUP_AGE hours old"
    exit 1
else
    echo "✅ Latest backup is $BACKUP_AGE hours old"
fi
```

**Check backup size**:
```bash
#!/bin/bash
# Backup should be at least 1KB (not empty)

LATEST_BACKUP=$(ls -t backups/ | head -1)
BACKUP_SIZE=$(stat -f%z "backups/$LATEST_BACKUP" 2>/dev/null || stat -c%s "backups/$LATEST_BACKUP")

if [ $BACKUP_SIZE -lt 1024 ]; then
    echo "⚠️  WARNING: Backup file is suspiciously small ($BACKUP_SIZE bytes)"
    exit 1
else
    echo "✅ Backup size is healthy ($(($BACKUP_SIZE / 1024))KB)"
fi
```

### Monitoring Integration

**Cron job monitoring** (with healthchecks.io):
```bash
# In crontab
0 */6 * * * cd /path/to/project && ./scripts/backup-database.sh && curl -fsS -m 10 --retry 5 https://hc-ping.com/your-uuid
```

**Slack notifications on backup failure**:
```bash
# Add to backup-database.sh
if [ $? -ne 0 ]; then
    curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
      -H 'Content-Type: application/json' \
      -d '{"text":"🚨 Database backup FAILED in [project-name]"}'
fi
```

---

## Best Practices

### Development Environment

1. **Use separate test database**: `myapp_test` not `myapp_dev`
2. **Never use production database**: Not even read-only
3. **Backup before every session**: Start of day backup habit
4. **Use docker-compose for databases**: Consistent environments
5. **Seed realistic test data**: But not production data

### Example docker-compose.yml:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: dev_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups

volumes:
  pgdata:
```

---

### Team Practices

1. **Code review backup scripts**: Treat as critical infrastructure
2. **Document database schema changes**: In migration files
3. **Test migrations on backup copy**: Before applying to dev
4. **Share backup restore procedures**: Team knowledge base
5. **Practice disaster recovery**: Quarterly drill

---

### AI Agent Behavior

When AI agents work on projects:

1. **First action**: Check environment and create backup
2. **Before tests**: Always use `safe-test.sh` wrapper
3. **Before migrations**: Explicit backup + confirmation
4. **No assumptions**: Always verify environment variables
5. **Documentation**: Log all database-touching operations

---

## Compliance & Audit

### Backup Audit Log

**Track all backup operations**:
```bash
# Add to backup-database.sh
echo "$(date): Backup created by $USER - $BACKUP_FILE" >> backups/audit.log
```

**Review audit log**:
```bash
tail -50 backups/audit.log
```

### Regulatory Requirements

If handling sensitive data (HIPAA, GDPR, PCI-DSS):

1. **Encrypt backups at rest**: Use `gpg` or database encryption
2. **Secure backup storage**: Restricted access, separate server
3. **Backup retention policy**: Document and enforce
4. **Access logging**: Who accessed backups and when
5. **Offsite backups**: Geographic redundancy

**Example encrypted backup**:
```bash
# Backup and encrypt
pg_dump -U $DB_USERNAME $DB_DATABASE | gzip | gpg --encrypt --recipient backup@company.com > backups/encrypted_backup.sql.gz.gpg

# Decrypt and restore
gpg --decrypt backups/encrypted_backup.sql.gz.gpg | gunzip | psql -U $DB_USERNAME $DB_DATABASE
```

---

## Quick Reference

### Daily Checklist

- [ ] Check environment: `echo $APP_ENV $DB_DATABASE`
- [ ] Verify not production: `[[ "$DB_HOST" == "localhost" ]]`
- [ ] Create backup: `./scripts/backup-database.sh`
- [ ] Verify backup: `ls -lh backups/ | head -5`
- [ ] Run operation with safe wrapper
- [ ] Verify success

### Emergency Commands

```bash
# Quick backup
./scripts/backup-database.sh

# List backups
ls -lth backups/ | head -10

# Restore latest
./scripts/restore-database.sh backups/$(ls -t backups/ | head -1)

# Check backup health
./scripts/check-backup-health.sh

# View audit log
tail -20 backups/audit.log
```

---

## Support & Escalation

### When to Escalate

- Production database affected
- All backups corrupted
- Data loss exceeds backup retention
- Security incident (unauthorized access)
- Regulatory compliance breach

### Incident Response

1. **Stop operations**: Prevent further damage
2. **Assess scope**: What data affected, how much time lost
3. **Document**: Screenshots, logs, timeline
4. **Notify**: Team lead, stakeholders, compliance (if required)
5. **Recover**: Follow procedures in this document
6. **Post-mortem**: What happened, how to prevent

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-30 | Initial comprehensive guide | AI Agent Setup |

---

## Related Documentation

- [AI Agent Project Initialization Prompt](./ai-agent-project-initialization-prompt.md)
- [Development Tooling Guide](./development-tooling-guide.md)
- [Git Branching Strategy](./git-branching-strategy-guide.md)
- [CI/CD Runners Setup](../gitlab/GITLAB_RUNNERS_SETUP_V2.md)

---

**Remember**: Backups are insurance. You hope you never need them, but when you do, you'll be grateful they exist.

**NO EXCEPTIONS. NO SHORTCUTS. BACKUP BEFORE EVERY DATABASE OPERATION.**
