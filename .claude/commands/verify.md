# Verify

Final checks before declaring work complete.

## What to Do

Run these checks:

```bash
# 1. Check requirements met
echo "Requirements:"
# List original requirements and status

# 2. Run tests
./scripts/safe-test.sh [test-command]

# 3. Check for debug code
grep -r "console.log\|var_dump\|dd(" src/ --include="*.js" --include="*.php" 2>/dev/null || echo "No debug code found"

# 4. Show what changed
git diff --stat
```

## Checklist

- [ ] All requirements met
- [ ] Tests pass
- [ ] No debug code
- [ ] Documentation updated (if needed)
- [ ] Ready to commit

## When to Use

- Before committing
- User asks "is it done?"
- After code review

$ARGUMENTS
