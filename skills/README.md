# CodeAssist Skills

Skills are documented best practices that help Claude work more effectively.

## How Skills Work

When Claude encounters a relevant task, it:
1. Reads the skill file
2. Follows the documented protocol
3. Uses the provided checklists

Skills aren't enforced by the system - they're guidance that improves outcomes.

## Core Skills

These are the most commonly used skills:

| Skill | When to Use | File |
|-------|-------------|------|
| `database-backup` | Before tests, migrations | `safety/database-backup/SKILL.md` |
| `code-review` | Before completing work | `core/code-review/SKILL.md` |
| `test-driven-development` | When writing tests | `testing/test-driven-development/SKILL.md` |
| `brainstorming` | Starting new features | `core/brainstorming/SKILL.md` |
| `writing-plans` | Breaking work into tasks | `core/writing-plans/SKILL.md` |

## All Skills by Category

### Safety
| Skill | Purpose |
|-------|---------|
| `database-backup` | Backup before database operations |
| `defense-in-depth` | Multiple security layers |

### Core Workflow
| Skill | Purpose |
|-------|---------|
| `brainstorming` | Design before implementation |
| `writing-plans` | Break work into tasks |
| `executing-plans` | Execute with verification |
| `code-review` | Self-review before completing |
| `verification-before-completion` | Final checks |

### Testing
| Skill | Purpose |
|-------|---------|
| `test-driven-development` | Write tests first |
| `condition-based-waiting` | Avoid flaky tests |
| `testing-anti-patterns` | Common mistakes to avoid |
| `playwright-frontend-testing` | Browser testing |

### Workflow
| Skill | Purpose |
|-------|---------|
| `git-workflow` | Commits, branches, merging |
| `git-worktrees` | Parallel feature development |
| `systematic-debugging` | Methodical bug fixing |
| `root-cause-tracing` | Find actual cause |

### Design
| Skill | Purpose |
|-------|---------|
| `brand-guidelines` | Establish brand identity |
| `frontend-design` | Build distinctive UIs |

### Meta
| Skill | Purpose |
|-------|---------|
| `writing-skills` | Create new skills |
| `using-skills` | How to use skills |

## Quick Reference

**Starting a feature:**
`brainstorming` → `writing-plans` → implement → `test-driven-development` → `code-review`

**Database work:**
`database-backup` → do work → verify

**Finishing work:**
`code-review` → `verification-before-completion` → commit

## Using a Skill

Ask Claude to use a specific skill:
```
Use the code-review skill to review these changes.
```

Or Claude will use relevant skills automatically when it recognizes the task type.

## Creating Skills

See `meta/writing-skills/SKILL.md` for how to create new skills.

## Attribution

Skills framework based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

## Version

1.0.0
