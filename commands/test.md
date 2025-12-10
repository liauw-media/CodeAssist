# Test

Run tests safely with database backup and resource protection.

## Context
$ARGUMENTS

## Execute

### Use the safe-test script

**Always use `./scripts/safe-test.sh` instead of running tests directly:**

```bash
# Auto-detect framework and run with protection
./scripts/safe-test.sh

# Or specify a command
./scripts/safe-test.sh vendor/bin/pest
./scripts/safe-test.sh npm test
./scripts/safe-test.sh pytest
```

The script automatically:
1. **Detects shared server** (checks for nginx/apache/php-fpm)
2. **Creates database backup** (if backup script exists)
3. **Applies resource limits** on shared servers:
   - `nice -n 19` (lowest CPU priority)
   - `ionice -c 3` (lowest I/O priority)
   - `cpulimit -l 50` (50% CPU cap, if installed)
   - `--processes=1` (single process for pest/phpunit)

### Override options

**Disable resource limits** (for local development):
```bash
./scripts/safe-test.sh --no-limit
# or
CODEASSIST_NO_LIMIT=1 ./scripts/safe-test.sh
```

**Change CPU limit** (default 50%):
```bash
CODEASSIST_CPU_LIMIT=25 ./scripts/safe-test.sh
```

### If safe-test.sh doesn't exist

Install it:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/safe-test.sh -o scripts/safe-test.sh
chmod +x scripts/safe-test.sh
```

Or run tests manually with limits:
```bash
nice -n 19 ionice -c 3 vendor/bin/pest --processes=1
```

## Output Format

```
## Test Results

**Framework:** [detected]
**Environment:** [Shared server / Local]
**Resource Limits:** [applied / disabled]
**Backup:** [created / skipped]

### Results
[test output summary]

**Total:** X tests | **Passed:** X | **Failed:** X | **Duration:** Xs

### Next Steps
[if failures: "Fix failing tests before committing"]
[if pass: "All tests pass - ready for /review"]
```
