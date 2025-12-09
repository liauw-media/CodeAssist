# CodeAssist

An assistant library for Claude Code.

## Action Commands

Commands that do real work:

| Command | Action |
|---------|--------|
| `/status` | Show git status, branch, recent commits |
| `/review` | Run code review with tests and checks |
| `/test` | Create backup and run tests |
| `/backup` | Create database backup |
| `/commit` | Pre-commit checklist and commit |

## Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/db [task]` | Database operations |

## Utility Commands

| Command | Purpose |
|---------|---------|
| `/mentor [topic]` | Critical analysis |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback |

## Skills

Skills are best practices in `.claude/skills/`. Key skills:

| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |

## Workflow

```
1. /status        - Check current state
2. Implement      - /laravel, /react, or /python
3. /test          - Run tests with backup
4. /review        - Code review
5. /commit        - Commit changes
```

## Database Safety

Before database operations:
```bash
./scripts/backup-database.sh
# or
/backup
```

## Help

| Need | Command |
|------|---------|
| What to do | `/guide` |
| Critical feedback | `/mentor [topic]` |
| Report issue | `/feedback [message]` |

## Version

Check: `cat .claude/VERSION`
