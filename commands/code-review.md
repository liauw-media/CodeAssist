# Command: /code-review

## Description

Thin wrapper command that activates the `code-review` skill or deploys the `code-reviewer` agent.

## Usage

```
/code-review
```

Or with agent:

```
/code-review --agent
```

## What This Command Does

### Simple Mode (Default)
1. Loads the `code-review` skill
2. Performs comprehensive self-review
3. Checks requirements, security, performance, testing
4. Reports findings

### Agent Mode (--agent flag)
1. Deploys the `code-reviewer` agent
2. Agent performs independent review
3. Provides detailed report with recommendations

## When to Use

- After feature implementation complete
- Before committing code
- Before creating pull/merge request
- When user asks "is it done?"

## Example - Simple Mode

**User**: `/code-review`

**Response**:
```
I'm using the code-review skill to review the authentication implementation.

Requirements Review:
✅ Email/password registration
✅ Token-based login
✅ Social OAuth
✅ Protected routes
✅ Logout functionality

Code Quality Review:

Security:
✅ Passwords hashed with bcrypt
✅ Input validation comprehensive
✅ Rate limiting on login (5/min)
✅ No secrets in code

Performance:
✅ No N+1 queries
✅ Index on users.email
✅ Token queries optimized

Testing:
Running tests with backup...
✅ All 15 tests pass

Documentation:
✅ API docs generated
✅ PHPDoc comments complete
✅ README updated

Code Review Complete ✅

The implementation is ready.
```

## Example - Agent Mode

**User**: `/code-review --agent`

**Response**:
```
Deploying code-reviewer agent for independent review.

[Agent performs thorough review]

Code Review Report from Agent:

Executive Summary: NOT READY - 2 Critical Issues

Critical Issues (MUST fix):
1. Missing rate limiting on registration endpoint
   - Impact: Vulnerable to spam registrations
   - Fix: Add throttle:5,1 middleware

2. User agent not captured in activity logs
   - Impact: Missing required tracking data
   - Fix: Update ActivityLogger->log()

Minor Issues:
1. AuthController methods could use more comments

Recommendation: Fix critical issues before merge.

[I'll fix these issues now...]
```

## Command Implementation

```bash
#!/bin/bash
# Code review with or without agent

if [ "$1" == "--agent" ]; then
    echo "Deploying code-reviewer agent..."
    # Launch agent with context
else
    # Load code-review skill
    cat skills/core/code-review/SKILL.md
    echo "I'm using the code-review skill for self-review."
fi
```

## Integration with Workflow

**Typical Flow:**
1. `/execute-plan` - Implementation
2. `/code-review` - Review work
3. Fix any issues found
4. `/verify-complete` - Final checks
5. Commit and deploy

## Related Commands

- `/execute-plan` - Precedes review
- `/verify-complete` - Follows review
- `/brainstorm` - If major issues require redesign

## Related Skills

- `code-review` - Core review skill
- `database-backup` - Used for running tests
- `verification-before-completion` - Next step

## Related Agents

- `code-reviewer` - Independent review agent
