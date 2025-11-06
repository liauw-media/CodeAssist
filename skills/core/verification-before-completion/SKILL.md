---
name: verification-before-completion
description: "Use when finishing any task. Final checklist before marking complete. Ensures nothing forgotten, all tests pass, documentation updated."
---

# Verification Before Completion

## Core Principle

Before declaring ANY work "complete" or "done", verify EVERYTHING works. This is the final gate before handoff.

## When to Use This Skill

- After completing `code-review` skill
- User asks "is it done?"
- Before committing final changes
- Before creating pull request
- Before closing an issue
- Before marking a feature as complete

## The Iron Law

**NEVER declare work complete without full verification.**

Reasons:
- Ensures nothing was forgotten
- Confirms everything actually works
- Validates against original requirements
- Prevents "one more thing" scenarios
- Professional quality gate

## Verification Protocol

### Step 1: Announce Verification

**Template:**
```
I'm using the verification-before-completion skill to perform final checks before declaring this complete.
```

### Step 2: Requirements Verification

**Check against original user request:**

```
Original Request:
"[User's original request verbatim]"

Requirements Checklist:
✅ [Requirement 1] - Implemented and verified
✅ [Requirement 2] - Implemented and verified
✅ [Requirement 3] - Implemented and verified
```

**Questions to ask:**
- Did I do EVERYTHING the user asked for?
- Are there any "and also" or "oh and" requests I missed?
- Did the requirements change during discussion?
- Are there implied requirements I should have addressed?

### Step 3: Functionality Verification

**Test the complete feature end-to-end:**

```
End-to-End Testing:

Scenario 1: [Happy path]
Steps:
1. [Action 1] → ✅ Works
2. [Action 2] → ✅ Works
3. [Action 3] → ✅ Works
Result: ✅ Complete flow works

Scenario 2: [Alternative path]
Steps:
1. [Action 1] → ✅ Works
2. [Action 2] → ✅ Works
Result: ✅ Alternative flow works

Scenario 3: [Error path]
Steps:
1. [Action 1] → ✅ Appropriate error
Result: ✅ Error handling works
```

### Step 4: Test Verification

**Verify ALL tests pass:**

```
Test Verification:

Before running tests:
✅ Using database-backup skill (MANDATORY)
✅ Backup created: [filename]

Running complete test suite:
Command: ./scripts/safe-test.sh vendor/bin/paratest
Results:
- Total: [X] tests
- Passed: [X] tests
- Failed: 0 tests
- Duration: [time]
- Coverage: [X]%

✅ All tests pass

Running specific feature tests:
Command: ./scripts/safe-test.sh vendor/bin/paratest --filter=[Feature]
Results:
- Total: [Y] tests
- Passed: [Y] tests
- Failed: 0 tests

✅ Feature tests pass
```

**If ANY tests fail:**
```
❌ Tests failed - NOT ready for completion

Failed tests:
1. [Test name] - [Failure reason]
2. [Test name] - [Failure reason]

I need to fix these before declaring complete.
```

### Step 5: Integration Verification

**Verify integration with existing system:**

```
Integration Verification:

✅ No existing functionality broken
✅ API contracts maintained (backwards compatible)
✅ Database migrations applied successfully
✅ Database migrations can be rolled back
✅ No conflicts with other features
✅ Environment variables documented
✅ Dependencies up to date
```

**Run regression tests:**
```
Running full test suite to ensure nothing broke:
Command: ./scripts/safe-test.sh vendor/bin/paratest
Results: ✅ [X] tests, all passed
```

### Step 6: Documentation Verification

**Verify all documentation is complete:**

```
Documentation Checklist:

Code Documentation:
✅ PHPDoc/JSDoc comments on all public methods
✅ Complex logic has explanatory comments
✅ Type hints on all function parameters

API Documentation:
✅ OpenAPI/Swagger documentation generated
✅ All endpoints documented
✅ Request/response examples provided
✅ Authentication requirements noted
✅ Error responses documented

Project Documentation:
✅ README.md updated (if new feature/setup)
✅ CHANGELOG.md updated with changes
✅ .env.example includes new variables
✅ Migration instructions provided (if needed)
✅ Deployment notes added (if needed)

User-Facing Documentation:
✅ Usage examples provided
✅ Common use cases documented
✅ Troubleshooting section added
```

### Step 7: Code Quality Verification

**Final quality checks:**

```
Code Quality Checklist:

Security:
✅ No SQL injection vulnerabilities
✅ No XSS vulnerabilities
✅ No hardcoded secrets
✅ Authentication/authorization correct
✅ Input validation comprehensive
✅ OWASP Top 10 checked

Performance:
✅ No N+1 query problems
✅ Appropriate database indexes
✅ Efficient algorithms used
✅ Caching implemented where needed
✅ No performance regressions

Best Practices:
✅ DRY principle followed (no duplication)
✅ SOLID principles applied
✅ Consistent naming conventions
✅ Proper error handling
✅ Logging appropriate
✅ No commented-out code
✅ No debugging statements (console.log, dd(), etc.)
```

### Step 8: Git Verification

**Verify version control state:**

```
Git Status Check:

✅ All changes are committed
✅ Commit messages follow conventions
✅ Branch is up to date with base branch
✅ No merge conflicts
✅ .gitignore properly configured
✅ No sensitive files committed

Git log (last commits):
[Show last 3-5 commits with messages]
```

### Step 9: Deployment Verification

**Verify deployment readiness:**

```
Deployment Checklist:

✅ Environment variables documented
✅ Database migrations are reversible
✅ No breaking changes (or documented)
✅ Rollback plan exists
✅ Health check endpoints work
✅ CI/CD pipeline passes (if configured)

Migration Commands (if needed):
1. [Command 1]
2. [Command 2]

Rollback Commands (if needed):
1. [Command 1]
2. [Command 2]
```

### Step 10: Final Approval

**Present complete verification report:**

```
Verification Complete ✅

✅ All requirements met
✅ All tests pass ([X] tests)
✅ No regressions detected
✅ Documentation complete
✅ Code quality verified
✅ Security checked
✅ Performance validated
✅ Git state clean
✅ Deployment ready

The [feature name] is complete and ready for [deployment/merge/review].
```

**If issues found:**
```
Verification Found Issues ⚠️

Issues preventing completion:
1. [Critical issue 1]
2. [Critical issue 2]

I need to address these before declaring complete.
```

## Complete Verification Checklist

Use this comprehensive checklist:

### Requirements
- [ ] All original requirements met
- [ ] All "and also" requests addressed
- [ ] Implied requirements handled
- [ ] User expectations met

### Functionality
- [ ] Happy path works end-to-end
- [ ] Alternative paths work
- [ ] Error cases handled appropriately
- [ ] Edge cases handled
- [ ] No obvious bugs

### Testing
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Integration tests pass
- [ ] No skipped tests
- [ ] Test coverage adequate (>80%)

### Integration
- [ ] No existing functionality broken
- [ ] API contracts maintained
- [ ] Database migrations work
- [ ] Migrations reversible
- [ ] No conflicts with other features

### Documentation
- [ ] Code comments complete
- [ ] API documentation generated
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] .env.example updated
- [ ] Usage examples provided

### Code Quality
- [ ] Security vulnerabilities checked
- [ ] Performance optimized
- [ ] No duplication
- [ ] Consistent naming
- [ ] Proper error handling
- [ ] No debugging statements

### Version Control
- [ ] All changes committed
- [ ] Good commit messages
- [ ] Branch up to date
- [ ] No merge conflicts
- [ ] No sensitive files

### Deployment
- [ ] Environment variables documented
- [ ] Migrations reversible
- [ ] Rollback plan exists
- [ ] CI/CD passes

## Red Flags (Incomplete Work)

- ❌ "Just need to test one more thing" → Test it NOW
- ❌ "I'll document it later" → Document NOW
- ❌ Skipped tests → Fix them NOW
- ❌ "It works on my machine" → Verify in clean environment
- ❌ Uncommitted changes → Commit NOW
- ❌ "I'll fix that typo later" → Fix NOW

## Common Rationalizations to Reject

- ❌ "It's good enough" → Verify it's complete
- ❌ "The user just wants it working" → Professional quality still matters
- ❌ "I'm out of time" → Better to deliver late and complete than early and broken
- ❌ "I'll fix issues if they come up" → Fix known issues NOW
- ❌ "Documentation can wait" → Document before you forget

## Example Verifications

### Example 1: Complete Feature

```
I'm using the verification-before-completion skill for the user authentication feature.

Original Request:
"Add authentication to the API with email/password login, social OAuth, and protected routes"

Requirements Checklist:
✅ Email/password registration - Implemented
✅ Email/password login - Implemented
✅ Token-based authentication - Implemented (Sanctum)
✅ Social OAuth (Google, GitHub) - Implemented (Clerk)
✅ Protected routes - Implemented (auth:sanctum middleware)
✅ Logout functionality - Implemented

End-to-End Testing:

Scenario 1: Registration and Login
1. POST /register with email/password → ✅ Returns 201, user created
2. POST /login with credentials → ✅ Returns token
3. GET /user (protected) with token → ✅ Returns user data

Scenario 2: Social OAuth
1. GET /auth/redirect/google → ✅ Redirects to Google
2. Callback returns with user → ✅ User created/logged in
3. Token issued → ✅ Works

Scenario 3: Protected Routes
1. GET /user without token → ✅ Returns 401
2. GET /user with invalid token → ✅ Returns 401
3. GET /user with valid token → ✅ Returns 200

Scenario 4: Error Handling
1. Register with invalid email → ✅ Returns 422 with validation errors
2. Login with wrong password → ✅ Returns 401 with clear message
3. Login with non-existent email → ✅ Returns 401 with clear message

Test Verification:

Before running tests:
✅ Using database-backup skill
✅ Backup created: backups/database_2025-01-06_15-30-00.sql

Running complete test suite:
Command: ./scripts/safe-test.sh vendor/bin/paratest
Results:
- Total: 127 tests
- Passed: 127 tests
- Failed: 0 tests
- Duration: 8.2s
- Coverage: 87%

✅ All tests pass

Running authentication tests specifically:
Command: ./scripts/safe-test.sh vendor/bin/paratest --filter=Authentication
Results:
- Total: 15 tests
- Passed: 15 tests
- Failed: 0 tests

✅ Feature tests pass

Integration Verification:

✅ No existing functionality broken (regression tests passed)
✅ API contracts maintained (backwards compatible)
✅ Database migrations applied: users table, personal_access_tokens table
✅ Migrations can be rolled back: php artisan migrate:rollback
✅ No conflicts with other features
✅ Environment variables: CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY added to .env.example
✅ Dependencies: laravel/sanctum, clerk/clerk-sdk-php added

Documentation Verification:

Code Documentation:
✅ AuthController methods have comprehensive PHPDoc
✅ Complex OAuth logic has explanatory comments
✅ Type hints on all function parameters

API Documentation:
✅ OpenAPI documentation generated: /docs/api
✅ All endpoints documented:
   - POST /register
   - POST /login
   - POST /logout
   - GET /auth/redirect/{provider}
   - GET /auth/callback/{provider}
✅ Request/response examples provided for each
✅ Authentication requirements: "Bearer token required for protected routes"
✅ Error responses documented (401, 422, 500)

Project Documentation:
✅ README.md updated with authentication setup section
✅ CHANGELOG.md updated:
   - Added: Token-based authentication with Sanctum
   - Added: Social OAuth with Clerk (Google, GitHub)
   - Added: Protected route middleware
✅ .env.example includes CLERK_* variables
✅ Migration instructions in README: php artisan migrate
✅ Deployment notes: Clerk keys must be set in production

User-Facing Documentation:
✅ Usage examples in README:
   - How to register a user
   - How to login
   - How to use tokens
   - How to add social OAuth
✅ Common use cases documented
✅ Troubleshooting section added:
   - Token not working → Check Sanctum middleware
   - OAuth callback fails → Verify Clerk configuration

Code Quality Verification:

Security:
✅ Passwords hashed with bcrypt (Laravel default)
✅ SQL injection: Using Eloquent ORM (parameterized)
✅ XSS: No raw output, API returns JSON
✅ No hardcoded secrets (all in .env)
✅ Authentication: Sanctum properly configured
✅ Authorization: Middleware on protected routes
✅ Input validation: FormRequest classes with rules
✅ Rate limiting: 5 login attempts per minute per IP

Performance:
✅ No N+1 queries (eager loading used)
✅ Database indexes: index on users.email
✅ Token lookup optimized
✅ Caching: Not needed for auth (stateless tokens)
✅ No performance regressions

Best Practices:
✅ DRY: AuthController methods reuse validation logic
✅ SOLID: Single responsibility per method
✅ Naming: Clear, consistent (login, register, logout)
✅ Error handling: Try-catch for OAuth, clear error messages
✅ Logging: Failed login attempts logged
✅ No commented-out code
✅ No debugging statements (removed all dd(), var_dump())

Git Verification:

✅ All changes committed (3 commits)
✅ Commit messages:
   - "Add Laravel Sanctum token authentication"
   - "Add Clerk social OAuth integration"
   - "Add authentication tests and documentation"
✅ Branch 'feature/authentication' up to date with main
✅ No merge conflicts
✅ .gitignore includes .env (secrets not committed)
✅ No sensitive files in history

Deployment Verification:

✅ Environment variables documented in .env.example
✅ Database migrations reversible:
   - Rollback: php artisan migrate:rollback
   - Steps: 2 migrations to rollback
✅ No breaking changes (new feature, existing routes unchanged)
✅ Rollback plan:
   1. php artisan migrate:rollback --step=2
   2. composer remove laravel/sanctum clerk/clerk-sdk-php
   3. Remove routes from api.php
   4. Remove AuthController

Migration Commands:
1. php artisan migrate

Rollback Commands:
1. php artisan migrate:rollback --step=2

---

Verification Complete ✅

✅ All requirements met (email/password + social OAuth)
✅ All tests pass (127 tests, 15 auth tests)
✅ No regressions detected
✅ Documentation complete (code, API, project, user)
✅ Code quality verified (security, performance, best practices)
✅ Security checked (OWASP Top 10)
✅ Performance validated (no N+1, proper indexes)
✅ Git state clean (3 commits, good messages)
✅ Deployment ready (migrations, rollback plan)

The user authentication feature is complete and ready for deployment/merge.
```

### Example 2: Issues Found

```
I'm using the verification-before-completion skill for the activity logging feature.

Original Request:
"Track user activity in a database table including IP address and user agent"

Requirements Checklist:
✅ Activity logging database table
✅ Logs user registration
✅ Logs user login
✅ Logs user logout
✅ Captures IP address
✅ Captures user agent

End-to-End Testing:
✅ User registration creates log entry with IP and user agent
✅ User login creates log entry
✅ User logout creates log entry

Test Verification:

Before running tests:
✅ Using database-backup skill
✅ Backup created

Running tests:
❌ FAILED - 2 test failures

Failed tests:
1. ActivityLogTest::test_logging_includes_user_agent
   - Expected: User agent to be captured
   - Actual: user_agent column is NULL
   - Reason: ActivityLogger not capturing user agent correctly

2. ActivityLogTest::test_user_can_view_own_activity
   - Expected: GET /user/activity returns activity logs
   - Actual: 404 Not Found
   - Reason: Forgot to implement the viewing endpoint

Verification Found Issues ⚠️

Critical Issues (preventing completion):
1. User agent not being captured
   - Tests expect it, code doesn't capture it
   - Fix: Update ActivityLogger to use $request->userAgent()

2. Missing endpoint to view activity logs
   - User probably wants to see their activity
   - This is an implied requirement
   - Fix: Add GET /user/activity endpoint

I need to fix these issues before declaring complete.
```

**After fixing:**
```
Fixed issues:
✅ Updated ActivityLogger to capture user agent correctly
✅ Added GET /user/activity endpoint
✅ Added test for new endpoint
✅ All tests now pass (18 tests)

Re-running verification:
✅ All requirements met (including implied requirement)
✅ All tests pass
✅ End-to-end testing successful
✅ Documentation updated

Verification Complete ✅ - Activity logging is now complete and ready.
```

## Integration with Other Skills

**Before verification-before-completion**: Use `code-review` skill
**After verification-before-completion**: Ready to commit/deploy
**If issues found**: Fix and re-verify

## Authority

**This skill is based on**:
- Software engineering best practice: Quality gates
- Professional standard: Definition of "done"
- Agile methodology: Acceptance criteria
- Empirical evidence: Final verification catches 40% of remaining issues

**Social Proof**: Professional teams have explicit "definition of done" checklists. No code is "complete" without verification.

## Your Commitment

Before using this skill, confirm:
- [ ] I will NEVER declare work complete without verification
- [ ] I will CHECK every item in the verification checklist
- [ ] I will RUN all tests as part of verification
- [ ] I will FIX any issues found
- [ ] I will DOCUMENT verification results

---

**Bottom Line**: "Complete" means fully verified, tested, documented, and ready to deploy. Never declare done without proving it's done.
