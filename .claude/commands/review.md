# Code Review Agent

Deploy the code-reviewer agent for comprehensive review.

## Review Scope
$ARGUMENTS

## Agent Protocol

You are now operating as the **code-reviewer** agent with MANDATORY enforcement.

### Pre-Flight Checks (BLOCKING)

1. **Read the agent definition**: Read `agents/code-reviewer.md` or fetch from https://raw.githubusercontent.com/liauw-media/CodeAssist/main/agents/code-reviewer.md
2. **Read the code-review skill**: `skills/core/code-review/SKILL.md`
3. **Read verification skill**: `skills/core/verification-before-completion/SKILL.md`

### Review Protocol

1. **Identify Changes**
   ```bash
   git diff --name-only HEAD~1  # Recent changes
   git status                    # Uncommitted changes
   ```

2. **Review Each File**
   - Read the ENTIRE file (not just diff)
   - Check against requirements
   - Security review (OWASP)
   - Performance review
   - Test coverage

3. **Run Verification**
   ```bash
   # MANDATORY - with database backup
   ./scripts/safe-test.sh [test command]
   ```

### Review Checklist (ALL REQUIRED)

#### Requirements
- [ ] All requirements implemented
- [ ] Edge cases handled
- [ ] No missing functionality

#### Security (OWASP Top 10)
- [ ] No SQL injection vectors
- [ ] No XSS vulnerabilities
- [ ] Input validation present
- [ ] Authorization checks in place
- [ ] Sensitive data protected

#### Code Quality
- [ ] DRY - no unnecessary duplication
- [ ] SOLID principles followed
- [ ] Clear naming conventions
- [ ] Appropriate error handling
- [ ] No dead code

#### Testing
- [ ] Tests exist for new code
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases tested
- [ ] All tests passing

#### Documentation
- [ ] Code is self-documenting OR has comments
- [ ] Public APIs documented
- [ ] README updated (if needed)

### Output Format (MANDATORY)

```
## Code Review: [Scope]

### Summary
**Verdict**: [APPROVED | NEEDS CHANGES | REJECTED]

### Files Reviewed
| File | Status | Issues |
|------|--------|--------|
| [file] | [OK/Issues] | [count] |

### Critical Issues (MUST FIX)
1. **[Issue]** - [file:line]
   - Problem: [description]
   - Fix: [solution]

### Major Issues (SHOULD FIX)
1. **[Issue]** - [file:line]
   - Problem: [description]
   - Fix: [solution]

### Minor Issues (NICE TO FIX)
1. [Issue] - [file:line]

### Security Review
- [x] SQL Injection: Clear
- [x] XSS: Clear
- [x] Auth: Verified
- [ ] [Any issues]

### Test Results
- Tests run: [count]
- Passing: [count]
- Coverage: [%]

### Recommendation
[Specific next steps]
```

### Enforcement

**DO NOT approve if:**
- Any critical issues exist
- Tests are failing
- Security vulnerabilities found
- Database operations ran without backup

Execute the review now.
