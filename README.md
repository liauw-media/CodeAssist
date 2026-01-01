# CodeAssist

[![Version](https://img.shields.io/badge/version-1.0.10-blue.svg)](https://github.com/liauw-media/CodeAssist/releases/tag/v1.0.10)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

An assistant library for Claude Code - skills, commands, and prompts that help Claude work more effectively.

## What is CodeAssist?

CodeAssist is a collection of **skills**, **slash commands**, and **prompt templates** that enhance Claude Code's capabilities. Instead of starting from scratch every session, CodeAssist gives Claude structured workflows and best practices to follow.

**New here?** See [Getting Started](docs/getting-started.md) | **Looking for something?** See [Documentation Index](docs/INDEX.md)

### The Problem It Solves

When working with Claude Code on complex projects, you often need to:
- Remind Claude about database backups before running tests
- Ensure code reviews happen before commits
- Apply consistent patterns across Laravel, React, or Python projects
- Break down work into manageable tasks

CodeAssist packages these workflows into reusable components that Claude can reference automatically.

### What's Included

| Component | Count | Purpose |
|-----------|-------|---------|
| **Skills** | 31 | Documented best practices (TDD, code review, database safety) |
| **Commands** | 24 | Slash commands that do real work (`/status`, `/review`, `/test`) |
| **Prompt Templates** | 16 | Framework-specific context (Laravel, React, Python) |

### History

CodeAssist started as an experiment in making Claude Code more reliable for professional development. Early versions (v3.x) tried aggressive "enforcement" approaches with git hooks and state tracking. These were over-engineered and didn't work well in practice.

**Version 1.0** is a clean restart with an honest approach:
- Skills are **guidance**, not enforcement
- Commands **do real work**, not just prompt engineering
- Documentation is **practical**, not marketing

The skills framework is based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent, adapted for Claude Code workflows.

---

## Getting Started

### 1. Install Prerequisites

You need Git and GitHub CLI installed. Choose automatic or manual install:

**Automatic Install** (runs setup script):

| Platform | Command |
|----------|---------|
| Windows (PowerShell as Admin) | `irm https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-windows.ps1 \| iex` |
| macOS | `curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-macos.sh \| bash` |
| Linux | `curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-linux.sh \| bash` |

**Manual Install** (if you prefer to review scripts first):

1. Download the script for your platform from [scripts/](https://github.com/liauw-media/CodeAssist/tree/main/scripts)
2. Review the script contents
3. Run it locally

Or install the tools yourself:
- **Git**: https://git-scm.com/downloads
- **GitHub CLI**: https://cli.github.com/

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
/quickstart      # Interactive onboarding (recommended)
/status          # See git status
/guide           # Get suggestions for what to do next
```

That's it. You're ready to go.

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
| `/ca-update` | Check for CodeAssist updates |

### Workflow Commands

| Command | What it Does |
|---------|--------------|
| `/brainstorm [topic]` | Discuss approach before implementing |
| `/plan [feature]` | Break work into actionable tasks |
| `/verify` | Final checks before completing work |

### Framework Commands

| Command | For |
|---------|-----|
| `/laravel [task]` | Laravel, Eloquent, Livewire |
| `/php [task]` | General PHP, Symfony |
| `/react [task]` | React, Next.js |
| `/python [task]` | Django, FastAPI |
| `/db [task]` | Database operations |

### Quality Commands

| Command | What it Does |
|---------|--------------|
| `/security [task]` | Security audit |
| `/refactor [task]` | Code refactoring |
| `/docs [task]` | Generate documentation |

### Research Commands

| Command | What it Does |
|---------|--------------|
| `/explore [task]` | Explore codebase structure |
| `/research [task]` | Research a topic |

### Utility Commands

| Command | Purpose |
|---------|---------|
| `/quickstart` | Interactive onboarding for new users |
| `/mentor [topic]` | Critical analysis - no sugarcoating |
| `/guide` | Help with what to do next |
| `/feedback [message]` | Submit feedback or report issues |
| `/agent-select [task]` | Get agent recommendation for a task |
| `/orchestrate [task]` | Coordinate multiple agents for complex tasks |

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

### Updating (v1.0.9+)

If you're on v1.0.9 or later, just run:
```
/ca-update
```

This saves your session context, updates, and tells you to restart. After restarting Claude, run `/resume-session` to continue where you left off.

### Upgrading from Older Versions (pre-1.0.9)

Older versions don't have session persistence. To preserve your work context:

**Step 1: Save context manually**

Before updating, ask Claude:
```
Save a summary of our current work to .claude/session-context.md with:
- Current task
- Recent progress
- Pending work
- Key decisions made
- Files modified
```

**Step 2: Run the update**
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

**Step 3: Restart and resume**
```bash
# Exit Claude (Ctrl+C or /exit)
claude
# Then run:
/resume-session
```

### Fresh Update (No Context Needed)

If you don't need to preserve context:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

See [CHANGELOG.md](CHANGELOG.md) for what's new.

Report issues:
```
/feedback [your message]
```

---

## Repository Structure

```
CodeAssist/
├── commands/                   # 24 slash commands (source)
│   ├── status.md               #   /status - git status
│   ├── review.md               #   /review - code review
│   ├── mentor.md               #   /mentor - critical feedback
│   └── ...                     #   See commands/README.md
├── skills/                     # 31 skill protocols (source)
│   ├── safety/                 #   database-backup, system-architect
│   ├── core/                   #   brainstorming, code-review
│   ├── workflow/               #   git, ci-templates
│   ├── testing/                #   TDD, playwright
│   └── ...                     #   See skills/README.md
├── agents/                     # Prompt templates for framework commands
├── scripts/                    # Installation and utility scripts
└── docs/                       # Reference documentation
    ├── INDEX.md                #   Everything in one place
    ├── getting-started.md      #   Quick onboarding
    ├── team-usage.md           #   Solo vs team setup
    ├── ci-templates/           #   GitLab + GitHub Actions
    ├── security-audit/         #   Linux, Windows, Docker
    └── registry-config.md      #   Custom container registry
```

## What Gets Installed

When you run the install script, it copies files to `.claude/` in your project:

```
your-project/
├── .claude/                    # Add to .gitignore
│   ├── commands/               # Copied from CodeAssist/commands/
│   ├── skills/                 # Copied from CodeAssist/skills/
│   ├── CLAUDE.md               # Project config
│   └── VERSION                 # e.g., 1.0.3
└── .gitignore
```

**Why `.claude/`?** This is the standard location Claude Code looks for project configuration and custom commands.

---

## Advanced

### Prompt Templates

The `agents/` folder contains specialized prompt templates for different contexts (Laravel, React, Python, etc.). These are loaded automatically when you use framework commands like `/laravel`.

See [agents/README.md](agents/README.md) for details.

### Self-Hosted CI/CD Runners

The `github/` and `gitlab/` folders contain setup scripts for self-hosted runners:
- **GitHub Actions**: See [github/GITHUB_RUNNERS_SETUP.md](github/GITHUB_RUNNERS_SETUP.md)
- **GitLab CI**: See [gitlab/GITLAB_RUNNERS_SETUP.md](gitlab/GITLAB_RUNNERS_SETUP.md)

---

## Quick Start Prompts

Copy-paste these prompts to Claude to quickly set up or update CodeAssist.

### Initialize New Project

```
Initialize this project with CodeAssist. Run this command:

curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

Then read .claude/CLAUDE.md to see available commands and workflows.
```

### Update CodeAssist

```
Update CodeAssist to the latest version. Run this command:

curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash

This will:
- Remove old skills and commands
- Install latest 31 skills and 24 commands
- Update .claude/CLAUDE.md configuration

After running, check .claude/VERSION for the new version number.
```

### Load CodeAssist Context (No Install)

If you just want Claude to know about CodeAssist without installing files:

```
Read the CodeAssist documentation to understand available workflows:
1. Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/README.md
2. Fetch https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md
3. Summarize the available commands and skills
```

---

## Team Usage

CodeAssist is optimized for solo developers. Teams need additional setup:

| Consideration | Solo | Team |
|---------------|------|------|
| `.claude/` location | gitignored | commit to repo |
| Version control | auto-updates | pin version |
| Settings | personal | shared conventions |
| Database | local | isolated per-dev |

**Quick team setup:**
```bash
# Remove from .gitignore and commit
sed -i '/.claude/d' .gitignore
git add .claude/
git commit -m "Add shared CodeAssist configuration"
```

Full guide: [docs/team-usage.md](docs/team-usage.md)

---

## Attribution

Based on [Superpowers](https://github.com/obra/superpowers) by Jesse Vincent.
