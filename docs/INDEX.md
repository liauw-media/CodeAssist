# CodeAssist Documentation Index

Everything in one place. Use this to find what you need.

## Quick Start

| Need | Go To |
|------|-------|
| What is CodeAssist? | [README.md](../README.md) |
| Install it | [README.md#getting-started](../README.md#getting-started) |
| List of commands | [commands/README.md](../commands/README.md) |
| List of skills | [skills/README.md](../skills/README.md) |
| **Advanced Features** | [advanced-features.md](advanced-features.md) |

## Advanced Features

| Feature | Description | Guide |
|---------|-------------|-------|
| **Autonomous Mode** | Hands-off development with quality gates | [advanced-features.md#autonomous-mode](advanced-features.md#autonomous-mode) |
| **MCP Servers** | Direct tool access (GitHub, Playwright, etc.) | [advanced-features.md#mcp-servers](advanced-features.md#mcp-servers) |
| **Plugins** | Extend Claude Code capabilities | [advanced-features.md#plugins](advanced-features.md#plugins) |
| **Subagents** | Specialized agents for specific tasks | [advanced-features.md#subagents](advanced-features.md#subagents) |
| **Hooks** | Event-driven automations | [advanced-features.md#hooks](advanced-features.md#hooks) |
| **Rules** | Always-enforced guidelines | [../rules/README.md](../rules/README.md) |

## Commands

Slash commands that do real work. Source: `commands/`

| Category | Commands |
|----------|----------|
| **Action** | `/status`, `/review`, `/test`, `/backup`, `/commit`, `/ca-update` |
| **Workflow** | `/brainstorm`, `/plan`, `/verify` |
| **Framework** | `/laravel`, `/php`, `/react`, `/python`, `/db` |
| **Quality** | `/security`, `/architect`, `/refactor`, `/docs` |
| **Research** | `/explore`, `/research` |
| **Utility** | `/mentor`, `/guide`, `/feedback`, `/agent-select`, `/orchestrate` |

Full reference: [commands/README.md](../commands/README.md)

## Skills

Best practices Claude follows. Source: `skills/`

| Category | Purpose |
|----------|---------|
| **Safety** | Database backup, security, resource limits |
| **Core** | Planning, reviewing, brainstorming |
| **Testing** | TDD, Playwright, anti-patterns |
| **Workflow** | Git, CI/CD, debugging |
| **Design** | Brand, frontend, performance |

Full reference: [skills/README.md](../skills/README.md)

## Reference Documentation

Detailed guides and templates. Source: `docs/`

### CI/CD Templates

Ready-to-use pipeline configurations:

| Stack | GitLab | GitHub |
|-------|--------|--------|
| Laravel | [gitlab/laravel.yml](ci-templates/gitlab/laravel.yml) | [github/laravel.yml](ci-templates/github/laravel.yml) |
| Django | [gitlab/django.yml](ci-templates/gitlab/django.yml) | [github/django.yml](ci-templates/github/django.yml) |
| React | [gitlab/react.yml](ci-templates/gitlab/react.yml) | [github/react.yml](ci-templates/github/react.yml) |
| Full-Stack | [gitlab/fullstack.yml](ci-templates/gitlab/fullstack.yml) | [github/fullstack.yml](ci-templates/github/fullstack.yml) |

Guide: [ci-templates/README.md](ci-templates/README.md)

### Security Audit

Platform-specific audit commands:

| Platform | Reference |
|----------|-----------|
| Linux/macOS | [security-audit/linux.md](security-audit/linux.md) |
| Windows | [security-audit/windows.md](security-audit/windows.md) |
| Docker | [security-audit/docker.md](security-audit/docker.md) |

Guide: [security-audit/README.md](security-audit/README.md)

### Configuration

| Topic | Document |
|-------|----------|
| Getting started | [getting-started.md](getting-started.md) |
| Custom container registry | [registry-config.md](registry-config.md) |

### Team Resources

| Topic | Document |
|-------|----------|
| Solo vs team differences | [team-usage.md](team-usage.md) |
| Step-by-step team adoption | [team-adoption.md](team-adoption.md) |

## Agents

Specialized prompt templates for framework commands. Source: `agents/`

| Agent | Used By |
|-------|---------|
| `laravel-developer` | `/laravel` |
| `react-developer` | `/react` |
| `python-developer` | `/python` |
| `security-auditor` | `/security` |

Full reference: [agents/README.md](../agents/README.md)

## Scripts

Executable tools. Source: `scripts/`

| Script | Purpose |
|--------|---------|
| `safe-test.sh` | Run tests with resource limits |
| `backup-database.sh` | Database backup |
| `install-codeassist.sh` | Install CodeAssist |

## Workflows

Common task sequences:

### Manual Development
```
/brainstorm → /plan → implement → /test → /review → /commit
```

### Autonomous Development (Recommended)
```
/plan "feature" --issues → /autonomous --epic 123 --target 95
                                    ↓
                    [Loop: implement → gates → PR]
                                    ↓
                         Human reviews PRs → Merge
```

### Security Audit
```
/architect → fix issues → /security → /test → /review
```

### CI/CD Setup
```
Copy template from docs/ci-templates/ → customize → commit
```

### Code Review
```
/review → address feedback → /verify → /commit
```

### Multi-Agent Task
```
/orchestrate "complex task" → agents coordinate → results aggregated
```

## Solo vs Team Usage

See [team-usage.md](team-usage.md) for team-specific considerations.

## Need Help?

| Question | Answer |
|----------|--------|
| What should I do next? | `/guide` |
| How do I use X? | `/mentor X` |
| Something's broken | `/feedback [issue]` |
| Which agent for this task? | `/agent-select [task]` |
