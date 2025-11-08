---
description: MANDATORY checklist before EVERY git commit - NO EXCEPTIONS
---

# Commit Checklist

**⚠️ THIS CHECKLIST IS MANDATORY BEFORE EVERY COMMIT ⚠️**

If you are about to run `git commit`, **STOP** and complete this checklist first.

## The Iron Law

**NO COMMITS WITHOUT COMPLETING THIS CHECKLIST.**

This is not a suggestion. This is not optional. This is MANDATORY.

## Pre-Commit Checklist

### 1. Verification Skill Completed

- [ ] Used `verification-before-completion` skill
- [ ] Read `.claude/skills/core/verification-before-completion/SKILL.md`
- [ ] Completed ALL verification steps
- [ ] All tests passed

**If NO:** Go run verification skill NOW. Do not pass Go, do not commit.

### 2. Tests Status

**Backend changes:**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] API tests pass (if API changed)

**Frontend changes:**
- [ ] Component tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass

**Full stack changes (backend + frontend):**
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] E2E tests pass
- [ ] Complete test suite pass

**Database changes:**
- [ ] `database-backup` skill used BEFORE tests
- [ ] Backup created and verified
- [ ] Tests passed with backup protection

**Test command used:**
```bash
# For projects with database:
./scripts/safe-test.sh [test-command]

# Verify all passed:
echo $?  # Should be 0
```

### 3. Code Quality Checks

- [ ] Pre-commit hooks installed and active
- [ ] Hooks passed successfully
- [ ] Code formatted (Prettier, Black, PHP CS Fixer)
- [ ] Linting passed (ESLint, Ruff, PHPStan)
- [ ] Type checking passed (TypeScript, mypy, Psalm)
- [ ] No console.log/var_dump/dd statements left

**Verify hooks ran:**
```bash
# Try to commit with intentional error
# Hooks should block it

# If hooks didn't run:
npm run prepare  # or: pre-commit install
```

### 4. Commit Size and Scope

**One logical change per commit:**

- [ ] This commit changes ONE thing
- [ ] Changes are related to each other
- [ ] No unrelated changes bundled together

**Good commits (choose ONE):**
- [ ] New feature added
- [ ] Bug fixed
- [ ] Refactoring done
- [ ] Tests added
- [ ] Documentation updated

**Bad commits (STOP if true):**
- [ ] Multiple features in one commit
- [ ] Bug fix + new feature together
- [ ] Formatting changes + logic changes
- [ ] "WIP" or "misc changes" or "fix stuff"

**If commit is too large:** Split it into multiple smaller commits.

### 5. Commit Message Quality

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Check:**
- [ ] Type is valid (feat, fix, docs, style, refactor, perf, test, build, ci, chore)
- [ ] Scope is present and specific
- [ ] Subject is concise (<50 chars)
- [ ] Body explains WHY (not what)
- [ ] NO AI co-author attribution

**Examples:**

✅ **Good:**
```
feat(auth): add email validation to login form

Prevents users from submitting invalid emails, reducing errors
and improving UX. Uses HTML5 pattern attribute with regex
fallback for older browsers.
```

✅ **Good:**
```
fix(api): handle null values in user profile endpoint

API was throwing 500 error when profile had null bio field.
Now returns empty string for nulls, consistent with other
text fields.
```

❌ **Bad:**
```
fix stuff

Co-Authored-By: Claude <noreply@anthropic.com>
```

❌ **Bad:**
```
add feature, fix bugs, update tests, refactor code
```

### 6. Self-Review Completed

- [ ] Used `code-review` skill before verification
- [ ] Reviewed every changed line
- [ ] No debug code left in
- [ ] No commented-out code
- [ ] No TODOs without issues filed
- [ ] Proper error handling in place

### 7. Documentation Updated

- [ ] README updated (if public API changed)
- [ ] API docs updated (if endpoints changed)
- [ ] Comments added for complex logic
- [ ] CHANGELOG updated (if user-facing change)
- [ ] Migration guide written (if breaking change)

### 8. Breaking Changes

**If this commit contains breaking changes:**

- [ ] Version bump planned (semver)
- [ ] Migration guide written
- [ ] Team notified
- [ ] Deprecation warnings added first (if possible)
- [ ] BREAKING CHANGE in commit footer

**Commit footer example:**
```
BREAKING CHANGE: authentication endpoint now requires email instead of username

Migration:
- Change login requests from { username } to { email }
- Update client apps by 2025-02-01
- Old endpoint deprecated, will be removed in v3.0
```

### 9. Security Checks

- [ ] No secrets/credentials in code
- [ ] No API keys hardcoded
- [ ] No passwords in config
- [ ] Sensitive data properly encrypted
- [ ] Input validation present
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed

**If secrets detected:**
```bash
# Remove from code
# Add to .env file
# Add .env to .gitignore
# Rotate the exposed secret immediately
```

### 10. Final Verification

**Before running git commit:**

```bash
# 1. Check staged files
git diff --cached

# Review EVERY line - is this what you want to commit?

# 2. Verify tests passed
./scripts/safe-test.sh [test-command]

# 3. Verify pre-commit hooks active
ls .git/hooks/pre-commit

# 4. Double-check commit message ready
cat commit-message.txt

# 5. All checklist items above: ✅

# ONLY THEN:
git commit -m "$(cat commit-message.txt)"
```

## Commit Execution

**After checklist complete:**

```bash
# Stage your changes
git add <files>

# Verify what's staged
git diff --cached

# Commit (pre-commit hooks will run)
git commit

# If hooks fail:
# - Fix the issues
# - Re-run this checklist
# - Try again

# After commit succeeds:
# - Verify commit created: git log -1
# - Push when ready: git push
```

## Emergency Bypass (RARE)

**Only bypass this checklist if:**

1. Production is down and every second counts
2. Security vulnerability needs immediate patch
3. Team lead explicitly authorized bypass

**NEVER bypass for:**
- "I'm in a hurry"
- "It's just a small change"
- "I'll fix it later"
- "Tests are flaky anyway"

**If you bypass:**

1. Add commit footer: `EMERGENCY: [reason]`
2. Create follow-up issue immediately
3. Notify team in Slack/chat
4. Fix properly within 24 hours

## Common Failures

### "Tests are failing but I need to commit"

**WRONG.** Fix the tests or revert your changes.

### "Pre-commit hooks are blocking me"

**GOOD.** They're doing their job. Fix the issues they found.

### "I forgot to add something"

**Fix it properly:**
```bash
# Option 1: Amend (if not pushed)
git add <forgotten-file>
git commit --amend --no-edit

# Option 2: New commit (if already pushed)
# Make change
# Run this checklist again
# Commit separately
```

### "Commit is too large to review"

**Split it:**
```bash
# Unstage everything
git reset

# Stage and commit piece by piece
git add <file1>
# Run checklist
git commit -m "feat(x): add feature part 1"

git add <file2>
# Run checklist
git commit -m "feat(x): add feature part 2"
```

## Accountability

**Before committing, acknowledge:**

- [ ] I completed EVERY item on this checklist
- [ ] I did NOT skip any steps
- [ ] All tests passed
- [ ] Pre-commit hooks passed
- [ ] This commit represents quality work
- [ ] I am proud to have my name on this commit

**If you cannot honestly check all boxes above, DO NOT COMMIT.**

---

**The Iron Law (Repeated)**: This checklist is MANDATORY for EVERY commit. No exceptions. This is how professional software development works.

**Enforcement**: This checklist is part of the skills framework. Skipping it violates the `verification-before-completion` skill and the `git-workflow` skill.

**Remember**: Commits are permanent. They represent your work. Make them count.
