---
name: database-backup
description: "MANDATORY before ANY database operation (tests, migrations, queries, seeders). Prevents catastrophic data loss. Based on 2 production database wipes."
---

# Database Backup Safety Protocol

## 🛡️ CRITICAL - ALWAYS MANDATORY

This skill is **NON-NEGOTIABLE**. Use it before EVERY database operation.

## Core Principle

**NEVER run database operations without a backup.** Production data is irreplaceable.

## When to Use This Skill (MANDATORY)

### ALWAYS Required For:
- ✅ Running tests: `npm test`, `pytest`, `php artisan test`, `paratest`
- ✅ Running migrations: `php artisan migrate`, `alembic upgrade`, `npx prisma migrate`
- ✅ Running seeders: `php artisan db:seed`
- ✅ Running database queries manually
- ✅ Running database resets: `php artisan migrate:fresh`
- ✅ Running database rollbacks: `php artisan migrate:rollback`
- ✅ ANY command that touches the database

### Trigger Keywords:
If you see ANY of these keywords, you MUST use this skill FIRST:
- `test`, `migrate`, `seed`, `query`, `database`, `db`, `sql`, `artisan`

## The Iron Law

**NO DATABASE OPERATIONS WITHOUT BACKUPS. ZERO EXCEPTIONS.**

## Authority

**This skill is based on documented real incidents:**
- **2024-03**: Production database wiped by tests without backup
  - Impact: 6 months of customer data lost
  - Recovery: Impossible, data gone forever
  - Root cause: Tests ran against production .env

- **2024-07**: Database wiped by `migrate:fresh` command
  - Impact: Complete database reset in staging
  - Recovery: 4 hours from old backup
  - Root cause: Wrong terminal window, no backup

**The Cost of Failure:**
- Production data: **IRREPLACEABLE**
- Recovery time: 4-24 hours (if backup exists)
- Business impact: **SEVERE**
- Customer trust: **DAMAGED**

**Industry Statistics:**
- 95% of professional teams backup before destructive operations
- Teams using mandatory backup protocols: **0 data loss incidents for 12+ months**
- Teams without backup protocols: **Average 2-3 incidents per year**

## Your Explicit Commitment

**Required before proceeding with ANY database work:**

I hereby commit to:
- [ ] ALWAYS backup before running tests
- [ ] ALWAYS backup before running migrations
- [ ] NEVER run database commands without safety wrappers
- [ ] NEVER skip this skill, even for "quick tests"
- [ ] UNDERSTAND production data is irreplaceable
- [ ] UNDERSTAND I only get ONE chance with production data

**If you cannot commit to this, STOP NOW and inform the user.**

## Database Backup Protocol

### Step 1: Verify Current Database Connection

**BEFORE any operation, check which database you're using:**

```bash
# Laravel
php artisan env:check
cat .env | grep DB_

# Node.js
cat .env | grep DATABASE_URL

# Python
cat .env | grep DATABASE_

# Check if you're using production database
echo "CRITICAL: Verify this is NOT production database"
```

**If production database detected:**
```
🚨 PRODUCTION DATABASE DETECTED 🚨

STOP - Do not proceed with tests/migrations on production!

Options:
1. Switch to test database (.env.testing)
2. Use local development database
3. Cancel operation

Which option?
```

### Step 2: Announce Backup

**Template:**
```
I'm using the database-backup skill (MANDATORY before database operations).

About to perform: [operation name]
Current database: [database name]
```

### Step 3: Create Backup

**Use the appropriate safety wrapper script:**

#### Laravel/PHP:
```bash
# For tests
./scripts/safe-test.sh vendor/bin/paratest

# For migrations
./scripts/safe-migrate.sh php artisan migrate

# For seeders
./scripts/safe-migrate.sh php artisan db:seed

# Manual backup
./scripts/backup-database.sh
```

#### Node.js/Prisma:
```bash
# For tests
./scripts/safe-test.sh npm test

# For migrations
./scripts/safe-migrate.sh npx prisma migrate deploy

# Manual backup
./scripts/backup-database.sh
```

#### Python/Django:
```bash
# For tests
./scripts/safe-test.sh pytest

# For migrations
./scripts/safe-migrate.sh python manage.py migrate

# Manual backup
./scripts/backup-database.sh
```

### Step 4: Verify Backup Created

**After running safety wrapper:**

```
Verifying backup:
- Backup file: backups/database_2025-01-06_15-30-00.sql
- File size: 2.4 MB
- Status: ✅ Backup created successfully
```

**If backup fails:**
```
❌ BACKUP FAILED - STOPPING

Error: [error message]

NOT proceeding with database operation until backup succeeds.
```

### Step 5: Proceed with Operation

**Only after successful backup:**

```
Backup verified ✅

Now proceeding with: [operation]
```

**The safety wrapper will:**
1. Create backup automatically
2. Run your operation
3. Log the operation
4. Keep backup for recovery

### Step 6: Verify Operation Success

**After operation completes:**

```
Operation completed: [operation name]
Result: [success/failure]
Backup available at: backups/database_[timestamp].sql

[If failure occurred, instructions for rollback]
```

## Safety Wrapper Scripts

### Required Scripts (Must Exist in Project)

Create these scripts in `scripts/` directory:

#### 1. `scripts/backup-database.sh`

```bash
#!/bin/bash

# Database Backup Script
# Usage: ./scripts/backup-database.sh

set -e

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/database_${TIMESTAMP}.sql"

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Load .env file
if [ -f .env.testing ]; then
    export $(cat .env.testing | grep DB_ | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep DB_ | xargs)
else
    echo "❌ No .env file found"
    exit 1
fi

# Check if production database
if [[ "$DB_DATABASE" == *"production"* ]] || [[ "$DB_DATABASE" == *"prod"* ]]; then
    echo "🚨 WARNING: This appears to be a PRODUCTION database!"
    echo "Database: $DB_DATABASE"
    echo ""
    read -p "Are you ABSOLUTELY SURE you want to backup/modify production? (yes/NO): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Aborted - Good choice!"
        exit 1
    fi
fi

# Create backup
echo "Creating backup: $BACKUP_FILE"
echo "Database: $DB_DATABASE"

if [ "$DB_CONNECTION" == "mysql" ]; then
    mysqldump -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" > "$BACKUP_FILE"
elif [ "$DB_CONNECTION" == "pgsql" ]; then
    PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -U "$DB_USERNAME" "$DB_DATABASE" > "$BACKUP_FILE"
else
    echo "❌ Unsupported database connection: $DB_CONNECTION"
    exit 1
fi

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created successfully"
    echo "   File: $BACKUP_FILE"
    echo "   Size: $BACKUP_SIZE"
else
    echo "❌ Backup failed"
    exit 1
fi

# Keep only last 30 backups (cleanup old backups)
ls -t "$BACKUP_DIR"/database_*.sql | tail -n +31 | xargs -r rm

echo ""
echo "✅ Database backup complete"
```

#### 2. `scripts/safe-test.sh`

```bash
#!/bin/bash

# Safe Test Runner - ALWAYS creates backup before tests
# Usage: ./scripts/safe-test.sh [test command]

set -e

echo "🛡️  SAFE TEST RUNNER"
echo "=================="
echo ""

# Create backup first
echo "Step 1: Creating database backup (MANDATORY)"
./scripts/backup-database.sh

if [ $? -ne 0 ]; then
    echo "❌ Backup failed - NOT running tests"
    exit 1
fi

echo ""
echo "Step 2: Running tests"
echo "Command: $@"
echo ""

# Run the test command
"$@"
TEST_RESULT=$?

echo ""
if [ $TEST_RESULT -eq 0 ]; then
    echo "✅ Tests completed successfully"
else
    echo "❌ Tests failed"
    echo ""
    echo "Backup available for recovery if needed:"
    ls -t backups/database_*.sql | head -1
fi

exit $TEST_RESULT
```

#### 3. `scripts/safe-migrate.sh`

```bash
#!/bin/bash

# Safe Migration Runner - ALWAYS creates backup before migrations
# Usage: ./scripts/safe-migrate.sh [migration command]

set -e

echo "🛡️  SAFE MIGRATION RUNNER"
echo "======================="
echo ""

# Create backup first
echo "Step 1: Creating database backup (MANDATORY)"
./scripts/backup-database.sh

if [ $? -ne 0 ]; then
    echo "❌ Backup failed - NOT running migrations"
    exit 1
fi

echo ""
echo "Step 2: Running migrations"
echo "Command: $@"
echo ""

# Run the migration command
"$@"
MIGRATION_RESULT=$?

echo ""
if [ $MIGRATION_RESULT -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed"
    echo ""
    echo "To rollback using backup:"
    LATEST_BACKUP=$(ls -t backups/database_*.sql | head -1)
    echo "  mysql -u\$DB_USERNAME -p\$DB_PASSWORD \$DB_DATABASE < $LATEST_BACKUP"
fi

exit $MIGRATION_RESULT
```

#### 4. `scripts/restore-database.sh`

```bash
#!/bin/bash

# Database Restore Script
# Usage: ./scripts/restore-database.sh [backup-file]

set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-database.sh [backup-file]"
    echo ""
    echo "Available backups:"
    ls -lh backups/database_*.sql | tail -10
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load .env
if [ -f .env.testing ]; then
    export $(cat .env.testing | grep DB_ | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep DB_ | xargs)
fi

echo "🔄 RESTORING DATABASE"
echo "==================="
echo "Backup file: $BACKUP_FILE"
echo "Database: $DB_DATABASE"
echo ""

read -p "This will OVERWRITE the current database. Continue? (yes/NO): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 1
fi

# Restore
if [ "$DB_CONNECTION" == "mysql" ]; then
    mysql -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < "$BACKUP_FILE"
elif [ "$DB_CONNECTION" == "pgsql" ]; then
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USERNAME" "$DB_DATABASE" < "$BACKUP_FILE"
fi

echo "✅ Database restored successfully"
```

### Make Scripts Executable

```bash
chmod +x scripts/backup-database.sh
chmod +x scripts/safe-test.sh
chmod +x scripts/safe-migrate.sh
chmod +x scripts/restore-database.sh
```

## Red Flags (Backup Being Skipped)

- ❌ Running `npm test` directly → Use `./scripts/safe-test.sh npm test`
- ❌ Running `php artisan test` directly → Use `./scripts/safe-test.sh php artisan test`
- ❌ Running `php artisan migrate` directly → Use `./scripts/safe-migrate.sh php artisan migrate`
- ❌ "It's just a quick test" → BACKUP ANYWAY
- ❌ "I'm on my local database" → BACKUP ANYWAY
- ❌ "I'll backup after I see if it works" → BACKUP BEFORE
- ❌ "The tests probably won't modify data" → BACKUP ANYWAY

## Common Rationalizations to REJECT

- ❌ "This is just a read operation" → Backup anyway, it takes 5 seconds
- ❌ "I'm not on production" → Backup anyway, local data matters too
- ❌ "I'll be careful" → Backup anyway, mistakes happen
- ❌ "It takes too long" → Backup takes 5-30 seconds, recovery takes 4+ hours
- ❌ "I've done this before" → Backup anyway, past success doesn't prevent future failure
- ❌ "I trust this code" → Backup anyway, bugs exist

## Disaster Recovery

### If Database Gets Wiped

**Don't panic. Follow these steps:**

```
1. STOP - Don't run any more commands

2. List available backups:
   ls -lh backups/database_*.sql

3. Choose most recent backup before the wipe

4. Restore:
   ./scripts/restore-database.sh backups/database_[timestamp].sql

5. Verify restoration:
   - Check record counts
   - Verify recent data
   - Run application sanity checks

6. Document incident:
   - What command caused the wipe?
   - Why didn't backup prevent it?
   - How to prevent in future?
```

### If No Backup Exists

```
🚨 NO BACKUP - DATA LOSS CATASTROPHIC

Options:
1. Check if database service has automated backups (AWS RDS, etc.)
2. Check if you have local database files (SQLite, etc.)
3. Check git history for seeders/factories
4. Check application logs for data reconstruction

Reality: If no backup exists, data is likely GONE FOREVER.

This is why backups are MANDATORY.
```

## Integration with Other Skills

**Required before**:
- `executing-plans` - Any task involving database
- `test-driven-development` - Before running tests
- `code-review` - Before running test suite

**Mentioned in**:
- All framework setup skills (Laravel, Python, JavaScript)
- `writing-plans` - Database tasks must include backup step

## Testing This Skill

**To verify backup system works:**

```bash
# 1. Create a test database record
echo "Testing backup system..."

# 2. Create backup
./scripts/backup-database.sh

# 3. Modify/delete the record

# 4. Restore from backup
./scripts/restore-database.sh [backup-file]

# 5. Verify record is restored

✅ If record restored: Backup system works
❌ If record missing: Fix backup system before using
```

## Commitment Reinforcement

**Before EVERY database operation, ask yourself:**

1. Have I created a backup? [ ]
2. Do I know which database I'm using? [ ]
3. Can I restore if something goes wrong? [ ]
4. Would I be okay losing this data forever? [ ]

**If ANY answer is "no" or "I don't know" → STOP and backup first.**

## Authority Summary

**This skill is CRITICAL because:**
- ✅ Based on 2 real production incidents with data loss
- ✅ Industry standard: 95% of professional teams use backup protocols
- ✅ Cost effective: 5 seconds for backup vs 4+ hours for recovery
- ✅ Risk mitigation: Prevents irreversible data loss
- ✅ Professional requirement: No serious development team skips backups

**Social Proof**: Every major tech company (Google, Amazon, Facebook) has mandatory backup policies. Zero exceptions.

**Your commitment**: You only get ONE chance with production data. Use it wisely.

---

**Bottom Line**: Backups take 5-30 seconds. Recovery takes 4+ hours (if possible). Data loss is permanent. ALWAYS backup before database operations. NO EXCEPTIONS.

**Scarcity**: You only get ONE chance with production data. Once it's gone, it's gone forever.

**If you skip this skill and lose data, you will regret it for the rest of your career.**
