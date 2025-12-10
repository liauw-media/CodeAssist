# Test

Run tests with database backup and resource protection.

## Context
$ARGUMENTS

## Execute

### Step 0: Check environment

**CRITICAL for shared servers:** Detect if this is a shared/production environment.

```bash
# Check if other sites are running (common indicators)
pgrep -c nginx 2>/dev/null || pgrep -c apache2 2>/dev/null || pgrep -c httpd 2>/dev/null
```

If web servers are running, ask: **"This appears to be a shared server. Run tests with resource limits? (recommended)"**

### Step 1: Detect test framework

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

### Step 3: Run tests WITH RESOURCE LIMITS

**On shared/production servers, ALWAYS use resource limits:**

#### Option A: Using `nice` + `cpulimit` (recommended)

```bash
# PHP (pest/phpunit) - limit to 50% CPU, low priority
nice -n 19 cpulimit -l 50 -- vendor/bin/pest
nice -n 19 cpulimit -l 50 -- vendor/bin/phpunit

# npm - limit to 50% CPU
nice -n 19 cpulimit -l 50 -- npm test

# pytest - limit to 50% CPU
nice -n 19 cpulimit -l 50 -- pytest
```

#### Option B: Using `nice` only (if cpulimit not available)

```bash
# Run with lowest priority (19 = nicest)
nice -n 19 vendor/bin/pest
nice -n 19 vendor/bin/phpunit
nice -n 19 npm test
nice -n 19 pytest
```

#### Option C: Using `systemd-run` (Linux with systemd)

```bash
# Limit to 50% CPU and 1GB RAM
systemd-run --scope -p CPUQuota=50% -p MemoryMax=1G vendor/bin/pest
systemd-run --scope -p CPUQuota=50% -p MemoryMax=1G npm test
```

#### Option D: Reduce parallel processes

```bash
# PHPUnit/Pest - single process
vendor/bin/pest --processes=1
vendor/bin/phpunit --processes=1

# pytest - single process
pytest -n 1

# npm - depends on test runner config
```

### Resource Limit Quick Reference

| Tool | Install | Purpose |
|------|---------|---------|
| `nice` | Built-in | Lower process priority (won't hog CPU) |
| `cpulimit` | `apt install cpulimit` | Hard CPU percentage limit |
| `ionice` | Built-in | Lower disk I/O priority |

**Recommended command for shared servers:**
```bash
nice -n 19 ionice -c 3 vendor/bin/pest --processes=1
```

This runs tests with:
- Lowest CPU priority (nice -n 19)
- Lowest I/O priority (ionice -c 3 = idle)
- Single process (no parallel stress)

### Step 4: Report results

## Output Format

```
## Test Results

**Framework:** [detected framework]
**Backup:** [created / skipped / failed]
**Resource Limits:** [applied / not applied]

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

## Safety Notes

1. **Shared server?** Always use resource limits
2. **Production data?** Always backup first
3. **Long-running tests?** Use `--processes=1` to avoid parallel stress
4. **Still too heavy?** Run tests locally or in CI/CD instead
