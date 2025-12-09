# CodeAssist

An assistant library for Claude Code - skills, commands, and prompts that help Claude work more effectively.

## What is This?

CodeAssist provides:
- **Skills** - Documented protocols for common tasks (code review, testing, database safety)
- **Commands** - Slash commands that do real work (`/status`, `/review`, `/backup`)
- **Prompt Templates** - Specialized context for different frameworks

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

**Important:** Add `.claude/` to your `.gitignore`:

```bash
echo ".claude/" >> .gitignore
```

CodeAssist is a development tool - it shouldn't be committed to your repository.

### Windows

Use Git Bash or WSL:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

## Commands

### Action Commands

Commands that do real work:

| Command | What it Does |
|---------|--------------|
| `/status` | Shows git status, branch, recent commits, uncommitted changes |
| `/review` | Runs code review: checks diff, runs tests, reports issues |
| `/test` | Creates backup, runs test suite, shows results |
| `/backup` | Creates timestamped database backup |
| `/commit` | Pre-commit checklist, then commits with proper message |

### Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/db [task]` | Database operations |

### Utility Commands

| Command | Purpose |
|---------|---------|
| `/mentor [topic]` | Critical analysis - no sugarcoating |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback or report issues |

## Skills

Skills are documented best practices Claude follows when relevant.

**Core Skills:**
| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |

See [skills/README.md](skills/README.md) for all skills.

## Version & Updates

Check installed version:
```bash
cat .claude/VERSION
```

Update to latest:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

Submit feedback:
```
/feedback [your message]
```

## Structure

```
.claude/           # Add to .gitignore
  commands/        # Slash commands
  skills/          # Skill protocols
  VERSION          # Installed version
  CLAUDE.md        # Project config
```

## Requirements

- Claude Code CLI
- Bash (Git Bash on Windows)

## Attribution

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

## Version

1.0.0
