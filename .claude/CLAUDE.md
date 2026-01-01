# CodeAssist

An assistant library for Claude Code.

## Action Commands

| Command | Action |
|---------|--------|
| `/status` | Show git status, branch, recent commits |
| `/review` | Run code review with tests and checks |
| `/test` | Create backup and run tests |
| `/backup` | Create database backup |
| `/commit` | Pre-commit checklist and commit |
| `/ca-update` | Check for CodeAssist updates |

## Workflow Commands

| Command | Action |
|---------|--------|
| `/brainstorm [topic]` | Discuss approach before implementing |
| `/plan [feature]` | Break work into actionable tasks |
| `/verify` | Final checks before completing work |

## Git Branch Commands

| Command | Action |
|---------|--------|
| `/branch [id] [desc]` | Create branch + checklist (add `-w` for worktree) |
| `/branch-status` | Check progress on current branch |
| `/branch-done` | Complete branch, create PR |
| `/branch-list` | List all active branches and worktrees |
| `/gitsetup` | Protect main branch, strip Claude mentions from commits |

## Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/php [task]` | General PHP, Symfony |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/db [task]` | Database operations |

## Quality Commands

| Command | Action |
|---------|--------|
| `/security [task]` | Security audit |
| `/architect [focus]` | System security & performance advisor |
| `/refactor [task]` | Code refactoring |
| `/docs [task]` | Generate documentation |

## Research Commands

| Command | Action |
|---------|--------|
| `/explore [task]` | Explore codebase structure |
| `/research [task]` | Research a topic |

## Session Commands

| Command | Purpose |
|---------|---------|
| `/save-session` | Save current context for later |
| `/resume-session` | Resume from saved context |

> After `/ca-update`, restart Claude and run `/resume-session` to continue.

## Utility Commands

| Command | Purpose |
|---------|---------|
| `/quickstart` | Interactive onboarding for new users |
| `/mentor [topic]` | Critical analysis - no sugarcoating |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback or report issues |
| `/agent-select [task]` | Get agent recommendation |
| `/orchestrate [task]` | Coordinate multiple agents |

## Skills

Skills are best practices in `skills/`. Key skills:

| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |
| `branch-discipline` | One branch per issue, small commits |
| `system-architect` | Security audits, hardening |

## Workflow

```
1. /status        - Check current state
2. /brainstorm    - Discuss approach
3. /plan          - Break into tasks
4. Implement      - /laravel, /react, or /python
5. /test          - Run tests with backup
6. /review        - Code review
7. /verify        - Final checks
8. /commit        - Commit changes
```

## Server Safety

### Running Tests

**Always use safe-test.sh** - it auto-detects shared servers and applies resource limits:
```bash
./scripts/safe-test.sh              # Auto-detect framework
./scripts/safe-test.sh --no-limit   # Disable limits (local dev only)
```

### Database Operations

Before database operations:
```bash
./scripts/backup-database.sh
# or
/backup
```

### Environment Variables

```bash
CODEASSIST_NO_LIMIT=1      # Disable resource limits (for local dev)
CODEASSIST_CPU_LIMIT=25    # Limit CPU to 25% (default: 50)
```

## Help

| Need | Command |
|------|---------|
| What to do | `/guide` |
| Critical feedback | `/mentor [topic]` |
| Which agent to use | `/agent-select [task]` |
| Report issue | `/feedback [message]` |

## Version

Check: `cat .claude/VERSION`
