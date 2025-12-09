# CodeAssist

An assistant library for Claude Code - skills, commands, and prompts that help Claude work more effectively.

## Getting Started

### 1. Install Prerequisites

**Windows** (PowerShell as Administrator):
```powershell
irm https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-windows.ps1 | iex
```

**macOS**:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-macos.sh | bash
```

**Linux**:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-linux.sh | bash
```

This installs Git, GitHub CLI, and other tools needed for CodeAssist.

### 2. Install CodeAssist

In your project directory (use Git Bash on Windows):

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

### 3. Add to .gitignore

```bash
echo ".claude/" >> .gitignore
```

CodeAssist is a local development tool - don't commit it to your repo.

### 4. Try It

```
/status          # See git status
/review          # Review your code
/mentor my code  # Get critical feedback
```

That's it. You're ready to go.

---

## What is This?

CodeAssist provides:
- **Skills** - Documented protocols for common tasks (code review, testing, database safety)
- **Commands** - Slash commands that do real work (`/status`, `/review`, `/backup`)
- **Prompt Templates** - Specialized context for different frameworks

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

---

## Commands

### Action Commands

Commands that do real work:

| Command | What it Does |
|---------|--------------|
| `/status` | Shows git status, branch, recent commits |
| `/review` | Runs code review with tests and checks |
| `/test` | Creates backup, runs test suite |
| `/backup` | Creates database backup |
| `/commit` | Pre-commit checklist, then commits |

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

---

## Skills

Skills are documented best practices Claude follows when relevant.

| Skill | When |
|-------|------|
| `database-backup` | Before tests, migrations |
| `code-review` | Before completing work |
| `test-driven-development` | When writing tests |

See [skills/README.md](skills/README.md) for all skills.

---

## Version & Updates

Check version:
```bash
cat .claude/VERSION
```

Update:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

Report issues:
```
/feedback [your message]
```

---

## Structure

```
.claude/           # Add to .gitignore
  commands/        # Slash commands
  skills/          # Skill protocols
  VERSION          # Installed version
  CLAUDE.md        # Project config
```

---

## Attribution

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.

## Version

1.0.0
