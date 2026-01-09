# Review

Skeptical code review with evidence-based validation. Default stance: **NEEDS WORK** until proven otherwise.

## Scope
$ARGUMENTS

## Review Philosophy

### Be Fantasy-Immune
- Don't trust claims without evidence
- Don't assume features work - verify them
- Don't accept "it should work" - prove it works
- First implementations typically need 2-3 revision cycles
- A C+/B- rating is a realistic starting point, not a failure

### Critical Triggers (Auto-Fail)
- Perfect previous scores without supporting evidence
- Unresolved issues visible in actual behavior
- Broken user journeys
- Security vulnerabilities present
- Tests failing or missing

## Execute

### Step 1: Gather Evidence

```bash
# What files changed
git diff --name-only HEAD~1
git status --short

# Show the diff
git diff

# Check for uncommitted changes too
git diff --cached
```

### Step 2: Verify Implementation Exists

For each claimed feature/fix:
1. **Find the code**: Actually locate where it's implemented
2. **Read the implementation**: Full file, not just diff
3. **Trace the logic**: Follow the code path
4. **Check edge cases**: What happens with bad input?

### Step 3: Run Actual Tests

```bash
# Detect and run tests
npm test 2>/dev/null || vendor/bin/pest 2>/dev/null || vendor/bin/phpunit 2>/dev/null || pytest 2>/dev/null || echo "No test framework detected"
```

**If tests fail, stop here. Nothing else matters until tests pass.**

### Step 4: Cross-Validate Claims

For each claim made about the changes:
| Claim | Evidence | Verified? |
|-------|----------|-----------|
| [what was claimed] | [where's the proof] | YES/NO |

### Step 5: Security Scan

```bash
# Debug statements (should be removed)
grep -rn "console\.log\|dd(\|dump(\|print_r\|var_dump\|debugger" --include="*.php" --include="*.js" --include="*.ts" --include="*.vue" . 2>/dev/null | head -10

# Hardcoded secrets
grep -rn "password.*=.*['\"].*[a-zA-Z0-9]" --include="*.php" --include="*.js" --include="*.env" . 2>/dev/null | head -5

# SQL injection risks (raw queries)
grep -rn "DB::raw\|->whereRaw\|->selectRaw" --include="*.php" . 2>/dev/null | head -5

# Unescaped output
grep -rn "{!!\|v-html\|dangerouslySetInnerHTML" --include="*.php" --include="*.vue" --include="*.jsx" --include="*.tsx" . 2>/dev/null | head -5
```

### Step 6: Realistic Assessment

Rate honestly using this scale:
| Grade | Meaning | Action |
|-------|---------|--------|
| A | Production-ready, well-tested | Approve |
| B | Works, minor improvements possible | Approve with notes |
| C | Functional but needs work | Request changes |
| D | Significant issues | Block until fixed |
| F | Broken or dangerous | Reject |

**Most first reviews should be C or B.** An A rating requires exceptional evidence.

## Checklists

### Security (Must Pass)
- [ ] No SQL injection (parameterized queries used)
- [ ] No XSS (output properly escaped)
- [ ] Input validation present at boundaries
- [ ] No hardcoded secrets or credentials
- [ ] Auth/authz checks in place where needed

### Code Quality
- [ ] No debug code left in
- [ ] Clear, intention-revealing naming
- [ ] Error handling present and sensible
- [ ] No obvious code duplication
- [ ] Changes match stated intent

### Tests
- [ ] Tests exist for the changes
- [ ] Tests actually pass (verified, not claimed)
- [ ] Tests cover the happy path
- [ ] Tests cover at least one edge case

### Evidence
- [ ] Implementation actually exists (not just planned)
- [ ] Behavior verified (not just assumed)
- [ ] Claims match reality

## Output Format (MANDATORY)

```
## Code Review: [scope]

### Stance: SKEPTICAL
Starting assumption: NEEDS WORK

### Evidence Gathered

**Files Changed:**
[list from git diff --name-only]

**Tests Run:**
- Command: [what was run]
- Result: [PASS/FAIL with count]

**Security Scan:**
- Debug code: [found/clean]
- Secrets: [found/clean]
- Injection risks: [found/clean]

### Claim Verification

| Claim | Evidence Found | Status |
|-------|---------------|--------|
| [claimed feature] | [file:line or "not found"] | VERIFIED/UNVERIFIED |

### Issues Found

**Critical (Blocks Approval):**
- [issue] at [file:line]
  - Impact: [what could go wrong]
  - Fix: [how to resolve]

**Major (Should Fix):**
- [issue] at [file:line]

**Minor (Nice to Have):**
- [issue] at [file:line]

### Assessment

| Category | Grade | Notes |
|----------|-------|-------|
| Security | [A-F] | [brief] |
| Quality | [A-F] | [brief] |
| Tests | [A-F] | [brief] |
| Overall | [A-F] | [brief] |

### Verdict

**[APPROVED / APPROVED WITH NOTES / NEEDS CHANGES / REJECTED]**

Confidence: [High/Medium/Low]
Reasoning: [1-2 sentences on why]

### Required Actions
[numbered list of what must be done, or "None - approved"]

### Recommendations
[optional improvements, not blocking]
```

Begin the skeptical review now.
