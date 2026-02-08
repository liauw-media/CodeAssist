# Rules

Always-enforced guidelines for Claude Code. Unlike skills (situational best practices), rules are mandatory and automatically applied.

## Installation

Copy to your Claude configuration:

```bash
# User-level (applies to all projects)
cp -r rules/ ~/.claude/rules/

# Project-level (applies to this project only)
cp -r rules/ .claude/rules/
```

## Available Rules

| Rule | Purpose |
|------|---------|
| [security.md](security.md) | No secrets, input validation, secure crypto |
| [testing.md](testing.md) | 80% coverage, TDD methodology |
| [git-workflow.md](git-workflow.md) | Branch naming, commits, PRs |
| [coding-style.md](coding-style.md) | Naming, organization, patterns |
| [agents.md](agents.md) | When to delegate to agents |
| [issue-first.md](issue-first.md) | All code changes must start with a GitHub/GitLab issue |

## How Rules Work

Rules are loaded from:
1. `~/.claude/rules/` (user-level)
2. `.claude/rules/` (project-level)

Claude Code reads these on startup and enforces them throughout the session.

## Creating Custom Rules

1. Create a `.md` file in `rules/`
2. Use clear, imperative language
3. Include "NEVER" and "ALWAYS" for hard requirements
4. Provide code examples of correct/incorrect patterns

Example structure:
```markdown
# Rule Name

**These rules are ALWAYS enforced. No exceptions.**

## Category 1
- **NEVER** do X
- **ALWAYS** do Y

## Code Patterns

```language
// WRONG
bad_pattern()

// CORRECT
good_pattern()
```
```

## Inspired By

[everything-claude-code](https://github.com/affaan-m/everything-claude-code) by @affaanmustafa
