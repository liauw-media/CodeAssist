# Test

Run tests with database backup.

## Context
$ARGUMENTS

## Execute

### Step 1: Detect test framework

Check which test framework is available:

```bash
# Check for common test frameworks
ls package.json 2>/dev/null && grep -q '"test"' package.json && echo "npm"
ls composer.json 2>/dev/null && (ls vendor/bin/pest 2>/dev/null && echo "pest" || ls vendor/bin/phpunit 2>/dev/null && echo "phpunit")
ls pytest.ini pyproject.toml 2>/dev/null && echo "pytest"
```

### Step 2: Create backup (if database involved)

```bash
./scripts/backup-database.sh
```

If backup script doesn't exist, warn but continue.

### Step 3: Run tests

Based on detected framework:

```bash
# npm
npm test

# pest
vendor/bin/pest

# phpunit
vendor/bin/phpunit

# pytest
pytest

# Or if argument provided, run that
$ARGUMENTS
```

### Step 4: Report results

## Output Format

```
## Test Results

**Framework:** [detected framework]
**Backup:** [created / skipped / failed]

### Results
[test output summary]

**Total:** X tests
**Passed:** X
**Failed:** X
**Duration:** Xs

### Failed Tests
[list any failures with file:line]

### Next Steps
[if failures: "Fix failing tests before committing"]
[if pass: "All tests pass - ready for review"]
```

Run the tests now.
