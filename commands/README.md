# CodeAssist Commands

Slash commands that do real work. These are installed to `.claude/commands/` in your project.

## Action Commands

| Command | File | What it Does |
|---------|------|--------------|
| `/status` | [status.md](status.md) | Shows git status, branch, recent commits |
| `/review` | [review.md](review.md) | Runs code review with tests and checks |
| `/test` | [test.md](test.md) | Creates backup, runs test suite |
| `/backup` | [backup.md](backup.md) | Creates database backup |
| `/commit` | [commit.md](commit.md) | Pre-commit checklist, then commits |
| `/ca-update` | [ca-update.md](ca-update.md) | Check for CodeAssist updates |

## Workflow Commands

| Command | File | What it Does |
|---------|------|--------------|
| `/brainstorm` | [brainstorm.md](brainstorm.md) | Discuss approach before implementing |
| `/plan` | [plan.md](plan.md) | Break work into actionable tasks |
| `/verify` | [verify.md](verify.md) | Final checks before completing work |

## Git Branch Commands

| Command | File | What it Does |
|---------|------|--------------|
| `/branch` | [branch.md](branch.md) | Create focused branch + checklist (+ worktree) |
| `/branch-status` | [branch-status.md](branch-status.md) | Check progress on current branch |
| `/branch-done` | [branch-done.md](branch-done.md) | Complete branch, verify checklist, create PR |
| `/branch-list` | [branch-list.md](branch-list.md) | List all active branches and worktrees |
| `/gitsetup` | [gitsetup.md](gitsetup.md) | Protect main, strip Claude mentions from commits |

## Framework Commands

| Command | File | For |
|---------|------|-----|
| `/laravel` | [laravel.md](laravel.md) | Laravel, Eloquent, Livewire |
| `/php` | [php.md](php.md) | General PHP, Symfony |
| `/react` | [react.md](react.md) | React, Next.js |
| `/python` | [python.md](python.md) | Django, FastAPI |
| `/db` | [db.md](db.md) | Database operations |

## Quality Commands

| Command | File | What it Does |
|---------|------|--------------|
| `/security` | [security.md](security.md) | Security audit |
| `/refactor` | [refactor.md](refactor.md) | Code refactoring |
| `/docs` | [docs.md](docs.md) | Generate documentation |

## Research Commands

| Command | File | What it Does |
|---------|------|--------------|
| `/explore` | [explore.md](explore.md) | Explore codebase structure |
| `/research` | [research.md](research.md) | Research a topic |

## Session Commands

| Command | File | Purpose |
|---------|------|---------|
| `/save-session` | [save-session.md](save-session.md) | Save current context for later |
| `/resume-session` | [resume-session.md](resume-session.md) | Resume from saved context |

> After `/ca-update`, restart Claude and run `/resume-session` to continue your work.

## Utility Commands

| Command | File | Purpose |
|---------|------|---------|
| `/quickstart` | [quickstart.md](quickstart.md) | Interactive onboarding for new users |
| `/mentor` | [mentor.md](mentor.md) | Critical analysis - no sugarcoating |
| `/guide` | [guide.md](guide.md) | Help with what to do next |
| `/feedback` | [feedback.md](feedback.md) | Submit feedback or report issues |
| `/agent-select` | [agent-select.md](agent-select.md) | Get agent recommendation |
| `/orchestrate` | [orchestrate.md](orchestrate.md) | Coordinate multiple agents |

## How Commands Work

Each `.md` file is a prompt template. When you type `/status`, Claude reads `status.md` and follows its instructions.

Commands can:
- Run bash commands (git, npm, etc.)
- Read/write files
- Coordinate with other commands
- Use skills from `skills/`

## Creating Custom Commands

1. Create a `.md` file in your project's `.claude/commands/`
2. Add instructions for Claude to follow
3. Use `$ARGUMENTS` to capture user input

Example:
```markdown
# My Command

Do something with: $ARGUMENTS

## Steps
1. First do this
2. Then do that
```
