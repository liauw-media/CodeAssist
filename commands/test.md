# Test

Run tests safely with database backup and resource protection.

## Context
$ARGUMENTS

## MCP Integration

If available, leverage these MCPs for enhanced testing:
- **Playwright MCP**: Run E2E browser tests with visual verification
- **Lighthouse MCP**: Performance testing and Core Web Vitals
- **PostgreSQL/SQLite MCP**: Direct database state verification

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

### Standard Output

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

### JSON Output (for /autonomous integration)

When called with `--json` flag, output machine-readable format:

```json
{
  "gate": "test",
  "score": 25,
  "max_score": 25,
  "passed": true,
  "details": {
    "framework": "pest",
    "total_tests": 47,
    "passed": 47,
    "failed": 0,
    "skipped": 0,
    "coverage": 92.5,
    "duration_seconds": 12.4
  },
  "thresholds": {
    "min_coverage": 80,
    "max_failures": 0
  },
  "threshold_results": {
    "coverage_met": true,
    "no_failures": true
  },
  "issues": [],
  "auto_fixable": [],
  "recommendations": []
}
```

**Failure example:**

```json
{
  "gate": "test",
  "score": 0,
  "max_score": 25,
  "passed": false,
  "details": {
    "framework": "jest",
    "total_tests": 50,
    "passed": 48,
    "failed": 2,
    "coverage": 75.0
  },
  "issues": [
    {
      "type": "test_failure",
      "test": "UserService.createUser should hash password",
      "file": "tests/UserService.test.ts",
      "line": 45,
      "error": "Expected bcrypt hash, got plaintext",
      "auto_fixable": true
    },
    {
      "type": "coverage_gap",
      "file": "src/services/AuthService.ts",
      "coverage": 65,
      "uncovered_lines": [23, 45, 67],
      "auto_fixable": false
    }
  ]
}
```

### Issue Comment Format (for --post-to-issue)

```markdown
## Test Results

| Metric | Value | Status |
|--------|-------|--------|
| Tests | 47 passed, 0 failed | ✅ |
| Coverage | 92.5% | ✅ (>80%) |
| Duration | 12.4s | |
| **Score** | **25/25** | ✅ |

### Details
- Framework: Pest
- Environment: Local
- Backup: Created

---
*Run by /autonomous | Iteration 3*
```
