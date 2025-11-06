# Command: /verify-complete

## Description

Thin wrapper command that activates the `verification-before-completion` skill for final checks before declaring work done.

## Usage

```
/verify-complete
```

Or with specific feature context:

```
/verify-complete [feature-name]
```

## What This Command Does

1. Loads the `verification-before-completion` skill
2. Runs comprehensive final verification
3. Checks: Requirements, Tests, Integration, Documentation, Code Quality, Git, Deployment
4. Provides final ready/not-ready decision

## When to Use

- After `/code-review` and fixing any issues
- User asks "is it done?"
- Before final commit
- Before creating PR/MR
- Before deploying to production

## Example

**User**: `/verify-complete`

**Response**:
```
I'm using the verification-before-completion skill for final checks.

Original Request:
"Add authentication with email/password and social OAuth"

Requirements Checklist:
✅ Email/password registration
✅ Login with token generation
✅ Social OAuth (Google, GitHub)
✅ Protected routes
✅ Logout functionality

End-to-End Testing:
✅ Registration flow works
✅ Login returns token
✅ Protected routes require auth
✅ Social OAuth redirects work
✅ Error cases handled

Test Verification:
Before running tests:
✅ Using database-backup skill
✅ Backup created

Running complete test suite:
✅ 127 tests, all passed
✅ Coverage: 87%

Integration Verification:
✅ No existing functionality broken
✅ API contracts maintained
✅ Migrations reversible
✅ No conflicts

Documentation Verification:
✅ Code comments complete
✅ API docs generated
✅ README updated
✅ CHANGELOG updated
✅ .env.example updated

Code Quality Verification:
✅ Security checked (OWASP Top 10)
✅ Performance optimized
✅ No duplication
✅ Error handling comprehensive

Git Verification:
✅ All changes committed
✅ Good commit messages
✅ Branch up to date
✅ No merge conflicts

Deployment Verification:
✅ Environment variables documented
✅ Migrations reversible
✅ Rollback plan exists

---

Verification Complete ✅

✅ All requirements met
✅ All tests pass (127 tests)
✅ No regressions
✅ Documentation complete
✅ Security verified
✅ Deployment ready

The authentication feature is complete and ready for deployment/merge.
```

## Example - Issues Found

**Response**:
```
Verification Found Issues ⚠️

Issues preventing completion:
1. Tests fail without database backup
   - 3 tests fail when run directly
   - Fix: Ensure .env.testing is configured

2. Missing rollback instructions
   - No documented rollback plan
   - Fix: Add to CHANGELOG

I need to address these before declaring complete.
```

## Command Implementation

```bash
#!/bin/bash
# Final verification before completion

# Load verification-before-completion skill
cat skills/core/verification-before-completion/SKILL.md

echo "I'm using the verification-before-completion skill for final checks."
```

## Integration with Workflow

**Complete Typical Flow:**
1. `/brainstorm` - Discuss approach
2. `/write-plan` - Create implementation plan
3. `/execute-plan` - Implement systematically
4. `/code-review` - Review implementation
5. `/verify-complete` - Final verification ✅
6. Commit, PR/MR, Deploy

## Related Commands

- `/code-review` - Precedes final verification
- `/brainstorm` - Start of workflow
- `/execute-plan` - Implementation phase

## Related Skills

- `verification-before-completion` - Core verification skill
- `code-review` - Precedes verification
- `database-backup` - Used for testing

## Success Criteria

Command succeeds when:
- [ ] All requirements met
- [ ] All tests pass
- [ ] No regressions
- [ ] Documentation complete
- [ ] Ready to deploy/merge
