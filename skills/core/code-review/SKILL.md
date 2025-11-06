---
name: code-review
description: "Use when completing any feature or fix. Self-review before declaring done. Catches bugs, improves quality, ensures completeness."
---

# Code Review

## Core Principle

Before declaring ANY work "done", perform a thorough self-review. You are your own first code reviewer.

## When to Use This Skill

- After completing a feature implementation
- After fixing a bug
- Before committing code
- Before creating a pull request
- When user says "is it done?"
- After executing a plan

## The Iron Law

**NEVER declare work "done" without self-review.**

Reasons:
- Catches obvious bugs before user sees them
- Ensures requirements are fully met
- Improves code quality
- Identifies missing tests or documentation
- Prevents "I forgot to..." mistakes

## Self-Review Protocol

### Step 1: Announce Review

**Template:**
```
I'm using the code-review skill to review the implementation before declaring it complete.
```

### Step 2: Requirements Review

**Check against original requirements:**

```
Requirements Review:
✅ Requirement 1: [Description] - Met
✅ Requirement 2: [Description] - Met
❌ Requirement 3: [Description] - NOT met (explain why)
```

**Questions to ask:**
- Does this do what the user asked for?
- Are there edge cases I haven't handled?
- Did I implement ALL parts of the feature?
- Is anything missing from the original request?

### Step 3: Code Quality Review

**Check for common issues:**

#### Security
- [ ] No SQL injection vulnerabilities (use parameterized queries)
- [ ] No XSS vulnerabilities (escape output)
- [ ] No command injection (validate inputs)
- [ ] Authentication/authorization properly implemented
- [ ] Sensitive data not logged or exposed
- [ ] Secrets not hardcoded
- [ ] CSRF protection enabled
- [ ] Rate limiting for API endpoints

#### Performance
- [ ] No N+1 query problems (use eager loading)
- [ ] Appropriate database indexes
- [ ] No unnecessary loops or iterations
- [ ] Efficient algorithms (not O(n²) where O(n) possible)
- [ ] Caching used where appropriate
- [ ] Large datasets paginated

#### Error Handling
- [ ] All error cases handled
- [ ] Appropriate error messages
- [ ] Graceful degradation
- [ ] No uncaught exceptions
- [ ] Proper logging of errors
- [ ] User-friendly error responses

#### Code Structure
- [ ] Functions/methods are single-purpose
- [ ] No code duplication (DRY principle)
- [ ] Proper separation of concerns
- [ ] Consistent naming conventions
- [ ] Appropriate use of types/interfaces
- [ ] No magic numbers (use constants)
- [ ] Comments for complex logic only

#### Testing
- [ ] Tests exist for new functionality
- [ ] Tests cover happy path
- [ ] Tests cover error cases
- [ ] Tests cover edge cases
- [ ] All tests pass
- [ ] Test coverage is adequate (>80%)
- [ ] No skipped or pending tests

#### Documentation
- [ ] API endpoints documented (OpenAPI/Swagger)
- [ ] PHPDoc/JSDoc comments for public methods
- [ ] README updated if needed
- [ ] CHANGELOG updated
- [ ] Complex logic has explanatory comments
- [ ] Environment variables documented

### Step 4: File-by-File Review

Review each file you modified:

**Template:**
```
File: path/to/file.php
Purpose: [What this file does]
Changes:
- Added [X]
- Modified [Y]
- Removed [Z]
Issues found:
- [Issue 1]: [How to fix]
- [Issue 2]: [How to fix]
```

**For each file, ask:**
- Is this file necessary?
- Are these changes the minimum required?
- Is the code readable?
- Would another developer understand this?
- Are variable names clear?
- Is the structure logical?

### Step 5: Integration Review

**Check how changes integrate:**

```
Integration Review:
- Does this break existing functionality? [Yes/No]
- Are API contracts maintained? [Yes/No]
- Are database migrations reversible? [Yes/No]
- Does this affect other features? [Yes/No - explain]
- Are dependencies up to date? [Yes/No]
```

### Step 6: Test Review

**Actually run the tests:**

```
I'm running all tests to verify nothing broke:

Before running tests:
✅ Using database-backup skill (MANDATORY)
✅ Backup created

Running: ./scripts/safe-test.sh vendor/bin/paratest

Results:
- Total tests: [X]
- Passed: [Y]
- Failed: [Z]
- Duration: [time]

[If failures, explain and fix]
```

### Step 7: Manual Testing

**Test the feature manually:**

```
Manual Testing:
1. [Test case 1]: ✅ Works as expected
2. [Test case 2]: ✅ Works as expected
3. [Edge case 1]: ✅ Handled correctly
4. [Error case 1]: ✅ Error message appropriate
```

**Test scenarios:**
- Happy path (everything works)
- Invalid inputs
- Boundary conditions (0, negative, very large)
- Concurrent operations
- Missing data
- Expired tokens/sessions

### Step 8: Documentation Review

**Verify documentation is complete:**

```
Documentation Review:
✅ API endpoints documented in OpenAPI
✅ Method signatures have PHPDoc comments
✅ Complex logic has explanatory comments
✅ README includes new features
✅ CHANGELOG updated with changes
✅ Environment variables documented in .env.example
```

### Step 9: Report Findings

**Template for clean review:**
```
Code Review Complete ✅

Requirements: All met
Security: No issues found
Performance: No issues found
Error Handling: Comprehensive
Testing: All tests pass (X tests)
Documentation: Complete

The implementation is ready.
```

**Template for issues found:**
```
Code Review Found Issues ⚠️

Critical Issues (MUST fix):
- [Issue 1]: [Description] - [How to fix]
- [Issue 2]: [Description] - [How to fix]

Minor Issues (SHOULD fix):
- [Issue 3]: [Description] - [How to fix]

Optional Improvements:
- [Idea 1]: [Description]

I'll fix the critical issues before marking this complete.
```

### Step 10: Fix Issues

If you found issues:
1. Fix critical issues immediately
2. Discuss minor issues with user
3. Note optional improvements for later

**After fixes:**
```
Fixed issues:
✅ [Issue 1] - Fixed by [solution]
✅ [Issue 2] - Fixed by [solution]

Re-running tests:
✅ All tests still pass

Updated code review:
✅ No remaining critical issues
```

## Code Review Checklist

Use this checklist for every review:

### Functionality
- [ ] Meets all requirements
- [ ] Handles edge cases
- [ ] No obvious bugs
- [ ] Works as user expects

### Security
- [ ] No SQL injection
- [ ] No XSS
- [ ] No command injection
- [ ] Auth/authz correct
- [ ] No secrets exposed

### Performance
- [ ] No N+1 queries
- [ ] Appropriate indexes
- [ ] Efficient algorithms
- [ ] Caching used

### Testing
- [ ] Tests exist
- [ ] Tests pass
- [ ] Good coverage
- [ ] Edge cases tested

### Code Quality
- [ ] Readable
- [ ] No duplication
- [ ] Good naming
- [ ] Proper structure
- [ ] Comments where needed

### Documentation
- [ ] API docs updated
- [ ] Comments added
- [ ] README updated
- [ ] CHANGELOG updated

### Integration
- [ ] Nothing broke
- [ ] Migrations reversible
- [ ] API contracts maintained

## Red Flags (Bad Code Review)

- ❌ "Looks good" without checking → Actually review
- ❌ Not running tests → Always run tests
- ❌ Skipping security check → Security is mandatory
- ❌ "I'll document it later" → Document now
- ❌ Ignoring minor issues → Fix or document

## Common Rationalizations to Reject

- ❌ "I just wrote it, I know it works" → Still review
- ❌ "It's a small change" → Small changes need review too
- ❌ "The tests pass" → Tests aren't everything
- ❌ "I'll fix issues later" → Fix critical issues now
- ❌ "User didn't ask for documentation" → Document anyway

## Example Reviews

### Example 1: Clean Review

```
I'm using the code-review skill to review the authentication implementation.

Requirements Review:
✅ Users can register with email/password
✅ Users can login and receive token
✅ Users can logout and revoke token
✅ Protected routes require authentication
✅ API documentation includes auth endpoints

Code Quality Review:

Security:
✅ Passwords hashed with bcrypt
✅ Tokens generated securely with Sanctum
✅ Input validation on all endpoints
✅ Rate limiting on login endpoint (5 attempts/minute)
✅ No sensitive data in logs

Performance:
✅ No N+1 queries
✅ Index on users.email
✅ Token queries optimized

Error Handling:
✅ Invalid credentials return 401 with clear message
✅ Validation errors return 422 with field-specific errors
✅ Token expiration handled gracefully

Testing:
Running tests with database backup:
✅ Backup created
✅ Running: ./scripts/safe-test.sh vendor/bin/paratest --filter=AuthenticationTest
✅ Results: 15 tests, all passed in 2.3s

Test coverage:
✅ Registration with valid data
✅ Registration with invalid data
✅ Login with correct credentials
✅ Login with wrong password
✅ Login with non-existent email
✅ Logout functionality
✅ Protected route access
✅ Protected route without token

Documentation:
✅ AuthController methods have PHPDoc
✅ API documentation generated and shows auth endpoints
✅ README updated with auth setup instructions
✅ .env.example includes Sanctum variables

Files Modified:
1. app/Http/Controllers/AuthController.php - Auth logic
2. routes/api.php - Auth routes
3. app/Models/User.php - Token abilities
4. tests/Feature/AuthenticationTest.php - Tests

Manual Testing:
✅ Registered new user via Postman
✅ Login returns valid token
✅ Protected route rejects without token
✅ Protected route works with token
✅ Logout revokes token

Code Review Complete ✅

The authentication implementation is complete and ready.
```

### Example 2: Issues Found

```
I'm using the code-review skill to review the activity logging implementation.

Requirements Review:
✅ Logs user registration
✅ Logs user login
✅ Logs user logout
⚠️ Does NOT log IP address (user asked for this)
⚠️ Does NOT log user agent (user asked for this)

Code Quality Review:

Security:
✅ No sensitive data logged

Performance:
❌ CRITICAL: No index on activity_logs.created_at
   - This table will be queried by date frequently
   - Will slow down significantly with growth
❌ CRITICAL: No index on activity_logs.user_id
   - Foreign key needs index for join performance

Error Handling:
⚠️ If logging fails, entire request fails
   - Logging should be non-blocking
   - Should catch exceptions and log them separately

Testing:
❌ Tests don't verify IP address and user agent (because not implemented)

Documentation:
⚠️ ActivityLogger service not documented

Code Review Found Issues ⚠️

Critical Issues (MUST fix before completing):
1. Missing indexes on activity_logs table
   - Add index on user_id
   - Add index on created_at
   - Solution: Create new migration

2. Missing IP address and user agent logging
   - User specifically requested this
   - Solution: Update ActivityLogger to capture from request

3. Logging should be non-blocking
   - Current: If logging fails, request fails
   - Solution: Wrap logging in try-catch

Minor Issues (SHOULD fix):
4. ActivityLogger service needs documentation
   - Add PHPDoc comments
   - Document in README

I'll fix the critical issues now before marking complete.
```

**After fixing:**
```
Fixed Critical Issues:

1. ✅ Added indexes on activity_logs
   - Created migration: add_indexes_to_activity_logs
   - Added index on user_id
   - Added composite index on (user_id, created_at) for user activity queries

2. ✅ Added IP address and user agent logging
   - Updated ActivityLogger->log() to accept Request
   - Captures $request->ip() and $request->userAgent()
   - Updated migration to include ip_address and user_agent columns

3. ✅ Made logging non-blocking
   - Wrapped ActivityLogger calls in try-catch
   - Failures now log to error log but don't break request
   - Added tests for logging failure scenarios

4. ✅ Added documentation
   - PHPDoc comments on ActivityLogger methods
   - README section on activity logging
   - Code examples for usage

Re-running tests:
✅ Using database-backup skill
✅ All tests pass (18 tests, including 3 new tests)

Manual testing:
✅ Verified IP address captured correctly
✅ Verified user agent captured correctly
✅ Verified logging failure doesn't break request

Updated Code Review:
✅ All requirements met
✅ All critical issues fixed
✅ All tests pass
✅ Documentation complete

The activity logging implementation is now complete and ready.
```

## Integration with Other Skills

**Before code-review**: Complete `executing-plans` skill
**After code-review**: Use `verification-before-completion` skill
**If issues found**: May need to revisit implementation

## Authority

**This skill is based on**:
- Software engineering best practice: Peer code review
- Industry standard: All production code is reviewed
- Empirical evidence: Code review catches 60% of bugs before production
- Security requirement: Review prevents vulnerabilities

**Social Proof**: Every major tech company (Google, Microsoft, Facebook) requires code review. No exceptions.

## Your Commitment

Before using this skill, confirm:
- [ ] I will ALWAYS review my code before declaring done
- [ ] I will CHECK security, performance, and testing
- [ ] I will RUN all tests as part of review
- [ ] I will FIX critical issues before completing
- [ ] I will DOCUMENT my findings

---

**Bottom Line**: You are your own first code reviewer. Catch your own bugs before the user does. Professional developers always review their work.
