# Review

Review code changes for quality, security, and correctness.

## Scope
$ARGUMENTS

## Execute

### Step 1: Get changes

```bash
# What files changed
git diff --name-only HEAD~1
git status --short

# Show the diff
git diff
```

### Step 2: Review each changed file

For each modified file:
1. Read the full file (not just diff)
2. Check the checklist below
3. Note any issues

### Step 3: Run tests

```bash
# Detect and run tests
npm test 2>/dev/null || vendor/bin/pest 2>/dev/null || vendor/bin/phpunit 2>/dev/null || pytest 2>/dev/null || echo "No test framework detected"
```

### Step 4: Check for common issues

Scan for:
```bash
# Debug statements
grep -rn "console\.log\|dd(\|dump(\|print_r\|var_dump" --include="*.php" --include="*.js" --include="*.ts" .

# Hardcoded secrets (basic check)
grep -rn "password.*=.*['\"]" --include="*.php" --include="*.js" --include="*.env" . 2>/dev/null | head -5
```

## Checklist

### Security
- [ ] No SQL injection (parameterized queries used)
- [ ] No XSS (output escaped)
- [ ] Input validation present
- [ ] No hardcoded secrets

### Code Quality
- [ ] No debug code left
- [ ] Clear naming
- [ ] Error handling present
- [ ] No obvious duplication

### Tests
- [ ] Tests exist for changes
- [ ] Tests pass

## Output Format

```
## Code Review

### Files Changed
[list from git diff --name-only]

### Review Results

| File | Status | Issues |
|------|--------|--------|
| path/file.ext | OK / Issues | count |

### Issues Found

**Critical:**
- [issue] at [file:line] - [how to fix]

**Minor:**
- [issue] at [file:line]

### Tests
**Result:** [Pass / Fail / Not Run]
[summary if relevant]

### Debug Code Check
[any console.log/dd() found]

### Verdict
**[APPROVED / NEEDS CHANGES]**

### Next Steps
[what to do next]
```

Run the review now.
