# Testing Framework & Backup Strategy

*Protecting your data while enabling safe testing*

---

## 🚨 The Problem

**Common Disaster Scenario**:
```bash
# Developer runs tests
pytest

# Tests use WRONG database
# All production/development data DELETED
# No backup available
# 😱 Project destroyed
```

**Why This Happens**:
- Test framework misconfigured
- Environment variables not isolated
- No database separation
- No automatic backups
- Tests run against live DB

---

## ✅ The Solution

### 1. Separate Test Database (Always)
### 2. Explicit Test Environment Configuration
### 3. Pre-test Safety Checks
### 4. Automatic Backup Before Tests
### 5. Database Reset Scripts

---

## Phase 1: Test Database Isolation

### Principle: **Never Test on Real Data**

```
Production DB  → prod_database       [NEVER TOUCH]
Development DB → dev_database        [NEVER TEST HERE]
Test DB        → test_database       [SAFE TO DESTROY]
```

### Configuration by Tech Stack

#### Python/Django

**settings/test.py**:
```python
"""
Test settings - ISOLATED test database
"""
from .base import *

# CRITICAL: Use separate test database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'test_project_db',  # DIFFERENT from dev/prod
        'USER': 'test_user',
        'PASSWORD': 'test_password',
        'HOST': 'localhost',
        'PORT': '5432',
        'TEST': {
            'NAME': 'test_project_db_pytest',  # Even more isolated
        }
    }
}

# Use in-memory SQLite for faster tests (if no DB-specific features needed)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': ':memory:',
#     }
# }

# Disable migrations for faster tests (use --reuse-db for even faster)
class DisableMigrations:
    def __contains__(self, item):
        return True
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Disable caching
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Fast password hashing for tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable debug toolbar in tests
DEBUG = False
INSTALLED_APPS = [app for app in INSTALLED_APPS if 'debug_toolbar' not in app]
```

**pytest.ini**:
```ini
[pytest]
DJANGO_SETTINGS_MODULE = trading_platform.settings.test
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
addopts =
    --reuse-db
    --nomigrations
    --tb=short
    --strict-markers
    -v
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
testpaths = tests
```

**conftest.py** (Root):
```python
import pytest
import os
from django.conf import settings

# SAFETY CHECK: Ensure we're using test database
@pytest.fixture(scope='session', autouse=True)
def verify_test_database():
    """Verify we're not testing against production/development database"""
    db_name = settings.DATABASES['default']['NAME']

    # CRITICAL: Fail if not using test database
    forbidden_names = ['prod', 'production', 'dev', 'development', 'main']
    if any(name in db_name.lower() for name in forbidden_names):
        raise Exception(
            f"🚨 DANGER: Testing against non-test database: {db_name}\n"
            f"This would DELETE real data!\n"
            f"Expected database name containing 'test'\n"
            f"Check DJANGO_SETTINGS_MODULE environment variable."
        )

    print(f"✅ Safe: Testing against database: {db_name}")
    yield

@pytest.fixture(scope='function', autouse=True)
def enable_db_access_for_all_tests(db):
    """Enable database access for all tests"""
    pass
```

#### JavaScript/TypeScript (Node.js)

**jest.config.js**:
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

**tests/setup.js**:
```javascript
const dotenv = require('dotenv');

// Force test environment
process.env.NODE_ENV = 'test';

// Load test-specific .env file
dotenv.config({ path: '.env.test' });

// SAFETY CHECK: Verify test database
const dbUrl = process.env.DATABASE_URL || '';
const forbiddenNames = ['prod', 'production', 'dev', 'development'];

if (forbiddenNames.some(name => dbUrl.toLowerCase().includes(name))) {
  throw new Error(
    `🚨 DANGER: Testing against non-test database: ${dbUrl}\n` +
    `This would DELETE real data!\n` +
    `Check .env.test file and DATABASE_URL.`
  );
}

// Only proceed if database name contains 'test'
if (!dbUrl.toLowerCase().includes('test')) {
  throw new Error(
    `🚨 DANGER: Database URL must contain 'test': ${dbUrl}\n` +
    `Example: postgresql://localhost/test_myapp_db`
  );
}

console.log('✅ Safe: Testing against database:', dbUrl);

// Mock external services
jest.mock('stripe', () => ({
  // Mock Stripe API
}));
```

**.env.test**:
```env
# Test environment configuration
NODE_ENV=test
DATABASE_URL=postgresql://localhost/test_myapp_db
REDIS_URL=redis://localhost:6379/15  # Different Redis DB number

# Use fake API keys for external services
STRIPE_API_KEY=test_fake_stripe_key
SENDGRID_API_KEY=test_fake_sendgrid_key
AWS_ACCESS_KEY_ID=test_fake_aws_key
```

#### PHP/Laravel

**phpunit.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         bootstrap="vendor/autoload.php">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <php>
        <!-- Force test environment -->
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>

        <!-- Or use separate test database -->
        <!-- <env name="DB_DATABASE" value="test_myapp_db"/> -->

        <!-- Disable external services -->
        <env name="MAIL_MAILER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="CACHE_DRIVER" value="array"/>
    </php>
</phpunit>
```

**tests/TestCase.php**:
```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\DB;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        // SAFETY CHECK: Ensure we're using test database
        $this->verifyTestDatabase();
    }

    private function verifyTestDatabase(): void
    {
        $dbName = DB::connection()->getDatabaseName();
        $forbiddenNames = ['prod', 'production', 'dev', 'development', 'main'];

        foreach ($forbiddenNames as $name) {
            if (stripos($dbName, $name) !== false) {
                throw new \Exception(
                    "🚨 DANGER: Testing against non-test database: {$dbName}\n" .
                    "This would DELETE real data!\n" .
                    "Expected database name containing 'test' or ':memory:'\n" .
                    "Check APP_ENV and phpunit.xml configuration."
                );
            }
        }

        // Only allow :memory: or databases with 'test' in name
        if ($dbName !== ':memory:' && stripos($dbName, 'test') === false) {
            throw new \Exception(
                "🚨 DANGER: Database name must contain 'test' or be ':memory:': {$dbName}"
            );
        }

        echo "✅ Safe: Testing against database: {$dbName}\n";
    }
}
```

---

## Phase 2: Pre-commit Hook Safety Check

**Prevent accidental test misconfiguration**

**.git/hooks/pre-commit**:
```bash
#!/bin/bash
# Pre-commit hook to verify test configuration

echo "🔍 Verifying test configuration..."

# Check if test files exist
if [ -f "pytest.ini" ] || [ -f "jest.config.js" ] || [ -f "phpunit.xml" ]; then

    # Python/Django: Check for test database isolation
    if [ -f "pytest.ini" ]; then
        if grep -q "DJANGO_SETTINGS_MODULE.*test" pytest.ini; then
            echo "✅ Django test settings configured"
        else
            echo "⚠️  Warning: pytest.ini missing test settings"
        fi
    fi

    # JavaScript: Check for .env.test
    if [ -f "jest.config.js" ]; then
        if [ -f ".env.test" ]; then
            if grep -q "DATABASE_URL.*test" .env.test; then
                echo "✅ Test database URL configured"
            else
                echo "❌ ERROR: .env.test missing test database configuration"
                exit 1
            fi
        else
            echo "⚠️  Warning: .env.test file not found"
        fi
    fi

    # PHP/Laravel: Check phpunit.xml
    if [ -f "phpunit.xml" ]; then
        if grep -q "APP_ENV.*testing" phpunit.xml; then
            echo "✅ Laravel test environment configured"
        else
            echo "❌ ERROR: phpunit.xml missing APP_ENV=testing"
            exit 1
        fi
    fi
fi

exit 0
```

---

## Phase 3: Automatic Backup Strategy

### Backup Before Tests (Script)

**scripts/backup-before-tests.sh**:
```bash
#!/bin/bash
# Automatic backup before running tests (paranoia mode)

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Database type detection
if [ -f ".env" ]; then
    DB_TYPE=$(grep "DB_CONNECTION" .env | cut -d'=' -f2)
fi

echo "📦 Creating backup: backup_${TIMESTAMP}"

# PostgreSQL backup
if command -v pg_dump &> /dev/null && [ "$DB_TYPE" = "pgsql" ]; then
    DB_NAME=$(grep "DB_DATABASE" .env | cut -d'=' -f2)
    DB_USER=$(grep "DB_USERNAME" .env | cut -d'=' -f2)

    # Only backup if NOT already test database
    if [[ ! "$DB_NAME" =~ "test" ]]; then
        pg_dump -U "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/backup_${TIMESTAMP}.sql"
        echo "✅ PostgreSQL backup created: $BACKUP_DIR/backup_${TIMESTAMP}.sql"
    else
        echo "⚠️  Skipping backup (already test database)"
    fi
fi

# MySQL backup
if command -v mysqldump &> /dev/null && [ "$DB_TYPE" = "mysql" ]; then
    DB_NAME=$(grep "DB_DATABASE" .env | cut -d'=' -f2)
    DB_USER=$(grep "DB_USERNAME" .env | cut -d'=' -f2)
    DB_PASS=$(grep "DB_PASSWORD" .env | cut -d'=' -f2)

    if [[ ! "$DB_NAME" =~ "test" ]]; then
        mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/backup_${TIMESTAMP}.sql"
        echo "✅ MySQL backup created: $BACKUP_DIR/backup_${TIMESTAMP}.sql"
    fi
fi

# SQLite backup (just copy file)
if [ -f "db.sqlite3" ]; then
    cp db.sqlite3 "$BACKUP_DIR/db_backup_${TIMESTAMP}.sqlite3"
    echo "✅ SQLite backup created: $BACKUP_DIR/db_backup_${TIMESTAMP}.sqlite3"
fi

# Keep only last 10 backups
ls -t "$BACKUP_DIR"/backup_* | tail -n +11 | xargs -r rm
echo "🧹 Cleaned old backups (keeping last 10)"

echo "✅ Backup complete!"
```

**Make executable**:
```bash
chmod +x scripts/backup-before-tests.sh
```

### Automated Daily Backups

**scripts/daily-backup.sh**:
```bash
#!/bin/bash
# Daily automatic backup with rotation

BACKUP_DIR="./backups/daily"
TIMESTAMP=$(date +%Y%m%d)
KEEP_DAYS=30

mkdir -p "$BACKUP_DIR"

# PostgreSQL
if command -v pg_dump &> /dev/null; then
    pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/daily_backup_${TIMESTAMP}.sql.gz"
fi

# MySQL
if command -v mysqldump &> /dev/null; then
    mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > "$BACKUP_DIR/daily_backup_${TIMESTAMP}.sql.gz"
fi

# Delete backups older than KEEP_DAYS
find "$BACKUP_DIR" -name "daily_backup_*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "✅ Daily backup complete: $BACKUP_DIR/daily_backup_${TIMESTAMP}.sql.gz"
```

**Add to crontab**:
```bash
# Daily backup at 3 AM
0 3 * * * cd /path/to/project && ./scripts/daily-backup.sh
```

---

## Phase 4: Safe Test Runner Scripts

### Wrapper Script with Safety Checks

**scripts/run-tests.sh**:
```bash
#!/bin/bash
# Safe test runner with environment verification

set -e

echo "🧪 Safe Test Runner"
echo "=================="

# 1. Verify we're not in production
if [ "$NODE_ENV" = "production" ] || [ "$APP_ENV" = "production" ]; then
    echo "❌ ERROR: Cannot run tests in production environment!"
    exit 1
fi

# 2. Check for test environment configuration
if [ -f ".env.test" ]; then
    echo "✅ Loading .env.test"
    export $(cat .env.test | xargs)
fi

# 3. Verify test database
DB_NAME=${DATABASE_URL:-${DB_DATABASE:-""}}
if [[ ! "$DB_NAME" =~ "test" ]] && [[ ! "$DB_NAME" =~ ":memory:" ]]; then
    echo "❌ ERROR: Database name must contain 'test' or be ':memory:'"
    echo "Current: $DB_NAME"
    echo ""
    echo "Fix by setting DATABASE_URL or DB_DATABASE in .env.test"
    exit 1
fi

echo "✅ Test database verified: $DB_NAME"

# 4. Create backup (paranoia mode)
if [ "$1" = "--with-backup" ]; then
    echo "📦 Creating backup before tests..."
    ./scripts/backup-before-tests.sh
fi

# 5. Run tests based on detected framework
echo "🚀 Running tests..."

if [ -f "pytest.ini" ]; then
    # Python/Django
    export DJANGO_SETTINGS_MODULE="trading_platform.settings.test"
    pytest "$@"
elif [ -f "jest.config.js" ]; then
    # JavaScript/TypeScript
    npm test -- "$@"
elif [ -f "phpunit.xml" ]; then
    # PHP/Laravel
    vendor/bin/phpunit "$@"
else
    echo "❌ ERROR: No test framework configuration found"
    exit 1
fi

echo "✅ Tests complete!"
```

**Usage**:
```bash
# Normal test run
./scripts/run-tests.sh

# With automatic backup
./scripts/run-tests.sh --with-backup

# Specific test file
./scripts/run-tests.sh tests/test_auth.py

# With coverage
./scripts/run-tests.sh --cov
```

---

## Phase 5: Database Reset Scripts

**scripts/reset-test-db.sh**:
```bash
#!/bin/bash
# Reset test database to clean state

set -e

DB_NAME="test_myapp_db"

echo "🔄 Resetting test database: $DB_NAME"

# Verify it's a test database
if [[ ! "$DB_NAME" =~ "test" ]]; then
    echo "❌ ERROR: Can only reset databases with 'test' in name"
    exit 1
fi

# PostgreSQL
if command -v psql &> /dev/null; then
    psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    psql -U postgres -c "CREATE DATABASE $DB_NAME;"
    echo "✅ PostgreSQL test database reset"
fi

# MySQL
if command -v mysql &> /dev/null; then
    mysql -u root -e "DROP DATABASE IF EXISTS $DB_NAME;"
    mysql -u root -e "CREATE DATABASE $DB_NAME;"
    echo "✅ MySQL test database reset"
fi

# Run migrations
if [ -f "manage.py" ]; then
    python manage.py migrate --settings=trading_platform.settings.test
elif [ -f "artisan" ]; then
    php artisan migrate --env=testing
elif [ -f "package.json" ]; then
    npm run migrate:test
fi

echo "✅ Test database ready!"
```

---

## Phase 6: CI/CD Integration

### GitHub Actions with Safe Testing

**.github/workflows/test.yml**:
```yaml
name: Tests

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
          POSTGRES_DB: test_myapp_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Verify test environment
        run: |
          # CRITICAL: Verify we're using test database
          if [[ ! "$DATABASE_URL" =~ "test" ]]; then
            echo "ERROR: Not using test database"
            exit 1
          fi
        env:
          DATABASE_URL: postgresql://test_user:test_password@localhost/test_myapp_db

      - name: Run tests
        run: |
          pytest --cov --cov-report=xml
        env:
          DJANGO_SETTINGS_MODULE: trading_platform.settings.test
          DATABASE_URL: postgresql://test_user:test_password@localhost/test_myapp_db

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

### GitLab CI/CD with Safe Testing

**.gitlab-ci.yml**:
```yaml
image: python:3.11

stages:
  - test
  - build
  - deploy

variables:
  POSTGRES_DB: test_myapp_db
  POSTGRES_USER: test_user
  POSTGRES_PASSWORD: test_password
  DATABASE_URL: "postgresql://test_user:test_password@postgres:5432/test_myapp_db"
  DJANGO_SETTINGS_MODULE: "trading_platform.settings.test"

services:
  - postgres:15

before_script:
  - pip install -r requirements.txt

# Unit Tests
test:unit:
  stage: test
  script:
    # CRITICAL: Verify we're using test database
    - |
      if [[ ! "$DATABASE_URL" =~ "test" ]]; then
        echo "ERROR: Not using test database"
        exit 1
      fi
    - echo "✅ Using test database: $DATABASE_URL"
    - pytest tests/unit --cov --cov-report=term --cov-report=html
  coverage: '/(?i)total.*? (100(?:\.0+)?\%|[1-9]?\d(?:\.\d+)?\%)$/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    paths:
      - htmlcov/
    expire_in: 1 week
  only:
    - merge_requests
    - main
    - develop

# Integration Tests
test:integration:
  stage: test
  script:
    - pytest tests/integration --cov --cov-report=term
  only:
    - merge_requests
    - main
    - develop

# Code Quality
code_quality:
  stage: test
  script:
    - pip install flake8 black mypy
    - flake8 src tests
    - black --check src tests
    - mypy src
  allow_failure: true
  only:
    - merge_requests
    - main
    - develop

# Build Stage
build:
  stage: build
  script:
    - echo "Building application..."
    - python setup.py build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop

# Deploy to Staging
deploy:staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    # Add deployment commands here
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - staging
  when: manual

# Deploy to Production
deploy:production:
  stage: deploy
  script:
    - echo "Deploying to production..."
    # Add deployment commands here
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

**For Node.js/JavaScript** (`.gitlab-ci.yml`):
```yaml
image: node:18

stages:
  - test
  - build
  - deploy

variables:
  DATABASE_URL: "postgresql://test_user:test_password@postgres:5432/test_myapp_db"
  NODE_ENV: "test"

services:
  - postgres:15

cache:
  paths:
    - node_modules/

before_script:
  - npm ci

test:
  stage: test
  script:
    # Verify test database
    - |
      if [[ ! "$DATABASE_URL" =~ "test" ]]; then
        echo "ERROR: Not using test database"
        exit 1
      fi
    - npm test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
    expire_in: 1 week

lint:
  stage: test
  script:
    - npm run lint

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - main
    - develop
```

**For PHP/Laravel** (`.gitlab-ci.yml`):
```yaml
image: php:8.2

stages:
  - test
  - build
  - deploy

variables:
  DB_CONNECTION: mysql
  DB_HOST: mysql
  DB_PORT: 3306
  DB_DATABASE: test_myapp_db
  DB_USERNAME: test_user
  DB_PASSWORD: test_password

services:
  - mysql:8.0

before_script:
  - apt-get update -qq && apt-get install -y -qq git zip unzip
  - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  - composer install --prefer-dist --no-ansi --no-interaction --no-progress --no-scripts

test:
  stage: test
  script:
    - cp .env.testing .env
    # Verify test database
    - |
      if [[ ! "$DB_DATABASE" =~ "test" ]]; then
        echo "ERROR: Not using test database"
        exit 1
      fi
    - php artisan key:generate
    - php artisan migrate --env=testing
    - vendor/bin/phpunit --coverage-text --colors=never

phpstan:
  stage: test
  script:
    - vendor/bin/phpstan analyse src tests --level=8

php-cs-fixer:
  stage: test
  script:
    - vendor/bin/php-cs-fixer fix --dry-run --diff
```

---

## Phase 7: Documentation in README

**Add to README.md**:

```markdown
## Testing

### Running Tests Safely

**IMPORTANT**: Tests use a separate test database and will NEVER touch development or production data.

\`\`\`bash
# Run all tests (safe)
./scripts/run-tests.sh

# Run with automatic backup (paranoia mode)
./scripts/run-tests.sh --with-backup

# Run specific test
./scripts/run-tests.sh tests/test_auth.py

# Run with coverage
./scripts/run-tests.sh --cov
\`\`\`

### Test Database Configuration

Tests automatically use:
- **PostgreSQL**: `test_myapp_db`
- **MySQL**: `test_myapp_db`
- **SQLite**: `:memory:` (in-memory database)

**Safety Checks**:
- ✅ Pre-test database name verification
- ✅ Automatic prevention of production/dev database usage
- ✅ Environment isolation (`.env.test`)
- ✅ Pre-commit hooks verify configuration

### Database Backups

\`\`\`bash
# Manual backup
./scripts/backup-before-tests.sh

# Reset test database to clean state
./scripts/reset-test-db.sh
\`\`\`

**Automatic Backups**:
- Daily backups at 3 AM (cron job)
- Pre-test backups (optional with `--with-backup`)
- Rolling retention (last 30 days)
```

---

## Summary: Multi-Layer Protection

### Layer 1: Configuration Isolation
- Separate test database
- Test-specific environment files
- Framework configuration enforces test mode

### Layer 2: Runtime Verification
- Database name checks in test setup
- Fail-fast if non-test database detected
- Environment variable validation

### Layer 3: Pre-commit Hooks
- Verify test configuration before commits
- Prevent misconfigured tests from entering codebase

### Layer 4: Safe Test Runners
- Wrapper scripts with safety checks
- Environment verification before test execution
- Optional automatic backups

### Layer 5: Backup Strategy
- Automatic daily backups
- Pre-test backups (optional)
- Rolling retention policy
- Easy restore scripts

### Layer 6: CI/CD Safety
- Isolated test databases in CI
- Environment verification in pipelines
- Coverage reporting

---

## Recovery from Test Disaster

**If tests accidentally run against real database**:

```bash
# 1. STOP ALL PROCESSES IMMEDIATELY
killall python  # or relevant process

# 2. Restore from latest backup
./scripts/restore-backup.sh backups/backup_YYYYMMDD_HHMMSS.sql

# 3. Verify data integrity
# Check critical tables/data

# 4. Fix test configuration
# Update .env.test, pytest.ini, etc.

# 5. Add prevention measures
# Implement all safety layers above
```

---

*Never lose data to misconfigured tests again!*
