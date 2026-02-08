# Issue-First Development Rules

**These rules are ALWAYS enforced. No exceptions.**

## Core Principle

All code changes MUST start with a GitHub or GitLab issue. No issue = no code.

## Critical Rules

```
╔═══════════════════════════════════════════════════════════════╗
║  1. NEVER start coding without a linked issue                 ║
║  2. NEVER create a branch without an issue number             ║
║  3. ALWAYS reference the issue in branch name and commits     ║
║  4. ALWAYS close issues via PR, not manually                  ║
╚═══════════════════════════════════════════════════════════════╝
```

## Required Workflow

```
1. Create issue    → Describe what and why
2. Create branch   → feature/123-description (issue number required)
3. Implement       → Reference issue in commits
4. Create PR       → Links to issue, closes on merge
```

## Before Writing Any Code

```
✓ Issue exists in GitHub/GitLab
✓ Issue has clear description and acceptance criteria
✓ Issue is assigned to you
✓ Branch name includes issue number
```

## Branch Naming (Issue Required)

```
feature/123-add-user-auth     # ✅ Issue #123
fix/456-login-timeout         # ✅ Issue #456
refactor/789-extract-service  # ✅ Issue #789

feature/add-user-auth         # ❌ No issue number
fix-login-timeout             # ❌ No issue number
my-changes                    # ❌ No issue number
```

## Commit Messages (Issue Required)

```
feat: add user authentication (#123)    # ✅ References issue
fix: resolve login timeout (#456)       # ✅ References issue

feat: add user authentication           # ❌ No issue reference
fix: resolve login timeout              # ❌ No issue reference
```

## Pull Requests (Issue Required)

- **ALWAYS** include `Closes #123` or `Fixes #123` in PR description
- **ALWAYS** link the PR to the issue
- **NEVER** create a PR without a linked issue

```markdown
## Summary
Adds user authentication with JWT tokens.

Closes #123
```

## When Asked to Code Without an Issue

1. **STOP** - Do not start coding
2. **ASK** - "Which issue should I work on?" or "Should I create an issue first?"
3. **CREATE** - Help create the issue with proper description
4. **THEN** - Start the branch and implementation

## Issue Quality Standards

Every issue MUST have:
- **Clear title** describing the change
- **Description** explaining what and why
- **Acceptance criteria** defining done
- **Labels** for categorization (bug, feature, refactor, etc.)

## NEVER Do

```
❌ Start coding without an issue
❌ Create a branch without an issue number
❌ Submit a PR without linking an issue
❌ Close issues manually instead of via PR merge
❌ Create vague issues ("fix stuff", "updates")
```

## ALWAYS Do

```
✅ Create an issue before any code change
✅ Include issue number in branch name
✅ Reference issue in commit messages
✅ Link PR to issue with "Closes #NNN"
✅ Write clear issue descriptions with acceptance criteria
```
