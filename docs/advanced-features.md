# Advanced Features Guide

Complete guide to CodeAssist's advanced capabilities: Autonomous Mode, MCP Servers, Plugins, and Subagents.

## Table of Contents

1. [Autonomous Mode](#autonomous-mode)
2. [MCP Servers](#mcp-servers)
3. [Plugins](#plugins)
4. [Subagents](#subagents)
5. [Hooks](#hooks)
6. [Integration Examples](#integration-examples)

---

## Autonomous Mode

Autonomous mode enables hands-off development with quality gates, issue tracking, and automatic PR creation.

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│  /plan "feature" --issues                                   │
│  Creates Epic + Child Issues in GitHub/GitLab               │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  /autonomous --epic 123 --target 95                         │
│                                                             │
│  For each issue:                                            │
│  1. Create branch                                           │
│  2. Implement feature                                       │
│  3. Run quality gates (/test, /security, /review, etc.)     │
│  4. Auto-fix issues where possible                          │
│  5. Create sub-issues for unfixable items                   │
│  6. Score >= 95 → Create PR                                 │
│  7. Wait for human approval                                 │
│  8. Merge → Next issue                                      │
└─────────────────────────────────────────────────────────────┘
```

### Quick Start

```bash
# 1. Configure (one-time)
cp templates/autonomous.yml .claude/autonomous.yml

# 2. Create issues from a feature request
/plan "Add user authentication with OAuth" --issues

# 3. Run autonomous development
/autonomous --epic 100 --target 95
```

### Quality Gates

| Gate | Weight | Required | Description |
|------|--------|----------|-------------|
| `/test` | 25 | Yes | Tests pass, 80%+ coverage |
| `/security` | 25 | Yes | No critical/high vulnerabilities |
| `/build-fix` | 15 | Yes | Project builds successfully |
| `/review` | 20 | No | Code quality, no smells |
| `/mentor` | 10 | No | Architecture review |
| `/ux` | 5 | No | Frontend accessibility |

**Target Score:** 95/100 (configurable)

### Configuration

Edit `.claude/autonomous.yml`:

```yaml
target_score: 95
max_iterations: 15

gates:
  test:
    weight: 25
    required: true
    thresholds:
      min_coverage: 80
      max_failures: 0

  security:
    weight: 25
    required: true
    thresholds:
      critical_vulns: 0
      high_vulns: 0

# See templates/autonomous.yml for full options
```

### Presets

| Preset | Target | Use Case |
|--------|--------|----------|
| `default` | 95 | Standard development |
| `prototype` | 80 | Quick MVPs |
| `production` | 98 | Production-critical code |
| `frontend` | 95 | UI components (UX required) |

```bash
/autonomous --epic 100 --preset production
```

### Human Intervention

Control the loop via issue comments:

| Command | Action |
|---------|--------|
| `@claude [instruction]` | Execute custom instruction |
| `@pause` | Pause the loop |
| `@resume` | Resume paused loop |
| `@skip-gate [gate] [reason]` | Skip a gate with justification |
| `@target [score]` | Change target score |

### Git Workflow

Autonomous mode enforces strict git workflow:

```
feature/123-task  ──PR──►  staging  ──PR──►  main
```

**Enforced rules:**
- Never push directly to main/staging
- Never include Claude co-author attribution
- Always require PR review
- Never auto-merge

---

## MCP Servers

Model Context Protocol (MCP) gives Claude direct access to external tools.

### What is MCP?

MCP servers are plugins that extend Claude's capabilities with real tool access:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Claude    │────▶│  MCP Server │────▶│  External   │
│   Code      │◀────│  (Bridge)   │◀────│  Service    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Available MCPs

| MCP | Use Case | Install |
|-----|----------|---------|
| **GitHub** | Issues, PRs, workflows | `npx @anthropic/mcp-github` |
| **GitLab** | Issues, MRs, pipelines | `npx @anthropic/mcp-gitlab` |
| **Playwright** | Browser automation, E2E | `npx @anthropic/mcp-playwright` |
| **PostgreSQL** | Natural language SQL | `npx @anthropic/mcp-postgres` |
| **SQLite** | Local database queries | `npx @anthropic/mcp-sqlite` |
| **Lighthouse** | Performance audits | `npx @anthropic/mcp-lighthouse` |
| **Sentry** | Error tracking | `npx @anthropic/mcp-sentry` |
| **Slack** | Team communication | `npx @anthropic/mcp-slack` |

### Configuration

Create `.mcp.json` in your project:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-playwright"]
    }
  }
}
```

### Quick Setup

```bash
# Interactive setup
/mcp-setup

# Or copy a preset
cp templates/mcp-fullstack.json .mcp.json
```

### Presets

| Preset | MCPs Included |
|--------|---------------|
| `mcp-minimal.json` | GitHub only |
| `mcp-web.json` | GitHub, Playwright, Lighthouse |
| `mcp-backend.json` | GitHub, PostgreSQL, Sentry |
| `mcp-fullstack.json` | All common MCPs |

### Context Window Warning

```
⚠️ CRITICAL: Each MCP consumes context window!

- 200k context can shrink to ~70k with many MCPs
- Enable only 2-5 MCPs per project
- Use disabledMcpServers for unused ones
```

Disable unused MCPs:

```json
{
  "mcpServers": { ... },
  "disabledMcpServers": ["playwright", "sentry"]
}
```

### MCP Best Practices

| Do | Don't |
|----|-------|
| Enable MCPs relevant to current task | Enable all MCPs at once |
| Use presets for common stacks | Manually configure everything |
| Disable unused MCPs | Leave all MCPs active |
| Store tokens in env vars | Hardcode tokens in config |

---

## Plugins

Plugins extend Claude Code with additional capabilities.

### Recommended Plugins

| Plugin | Purpose | Install |
|--------|---------|---------|
| **code-simplifier** | Clean up code after sessions | `claude plugin install code-simplifier` |
| **typescript-lsp** | Real-time TypeScript checking | `claude plugin install typescript-lsp@claude-code-lsps` |
| **python-lsp** | Python language server | `claude plugin install python-lsp@claude-code-lsps` |
| **security-guidance** | Security warnings | `claude plugin install security-guidance` |

### Installation

```bash
# Interactive setup
/plugin-setup

# Manual install
claude plugin install code-simplifier

# From marketplace
claude plugin marketplace add thedotmack/claude-mem
claude plugin install claude-mem
```

### Plugin: code-simplifier

Automatically cleans up code after Claude Code sessions:

```bash
# Install
claude plugin install code-simplifier

# Run after session
/cleanup
```

**What it does:**
- Removes unused imports
- Fixes formatting issues
- Removes debug statements
- Simplifies complex expressions

### Plugin: claude-mem

Persistent memory across sessions:

```bash
# Install
/mem-setup

# Or manually
claude plugin marketplace add thedotmack/claude-mem
claude plugin install claude-mem
```

**Features:**
- Auto-captures session context
- SQLite + vector storage
- Web UI at localhost:37777
- Semantic search across sessions

### Plugin Development

Create custom plugins in `~/.claude/plugins/`:

```
~/.claude/plugins/
└── my-plugin/
    ├── manifest.json
    └── index.js
```

---

## Subagents

Subagents are specialized Claude instances for specific tasks.

### Built-in Subagents

| Subagent | Trigger | Purpose |
|----------|---------|---------|
| `Explore` | Task tool | Codebase exploration |
| `Plan` | Task tool | Implementation planning |
| `Bash` | Task tool | Command execution |

### CodeAssist Agents

| Agent | Command | Purpose |
|-------|---------|---------|
| `security-auditor` | `/security` | OWASP vulnerability scanning |
| `code-reviewer` | `/review` | Skeptical code review |
| `refactoring-agent` | `/refactor` | Code improvement |
| `e2e-runner` | `/e2e` | End-to-end testing |
| `build-error-resolver` | `/build-fix` | Fix compilation errors |
| `autonomous-loop-runner` | `/autonomous` | Quality-gated development |

### When to Use Subagents

| Scenario | Use |
|----------|-----|
| Exploring unfamiliar codebase | `Task` with `Explore` subagent |
| Security audit | `/security` (security-auditor) |
| Code review | `/review` (code-reviewer) |
| Complex multi-step task | `/orchestrate` |
| Autonomous development | `/autonomous` |

### Orchestration

Coordinate multiple agents for complex tasks:

```bash
/orchestrate "Build complete auth system with tests"
```

The orchestrator:
1. Breaks task into subtasks
2. Assigns appropriate agents
3. Manages dependencies
4. Aggregates results

### Custom Agents

Create custom agents in `agents/`:

```markdown
# My Custom Agent

## Role
[What this agent does]

## Capabilities
- [Capability 1]
- [Capability 2]

## Protocol
[Step-by-step instructions]
```

---

## Hooks

Event-driven automations that run on tool operations.

### Hook Types

| Type | When | Can Block |
|------|------|-----------|
| `PreToolUse` | Before tool executes | Yes |
| `PostToolUse` | After tool completes | No |
| `Notification` | On message patterns | No |

### Configuration

Copy template to settings:

```bash
/hooks-setup

# Or manually
cp templates/hooks.json ~/.claude/settings.json
```

### Example Hooks

**Block dangerous operations:**

```json
{
  "matcher": "tool == 'Bash' && command matches 'git push.*main'",
  "hooks": [{
    "type": "block",
    "message": "[BLOCKED] Direct push to main forbidden"
  }]
}
```

**Warn on sensitive files:**

```json
{
  "matcher": "tool == 'Edit' && file_path matches '\\.env'",
  "hooks": [{
    "type": "command",
    "command": "echo '[WARNING] Editing sensitive file'"
  }]
}
```

### Built-in Hooks (templates/hooks.json)

| Hook | Trigger | Action |
|------|---------|--------|
| Block push to main | `git push.*main` | Block |
| Block force push | `git push --force` | Block |
| Block Claude attribution | `Co-Authored-By.*Claude` | Block |
| Warn on rm -rf | `rm -rf` | Warning |
| Warn on destructive SQL | `DROP TABLE` | Warning |
| Post-commit check | `git commit` | Check for Claude attribution |

---

## Integration Examples

### Example 1: Full Autonomous Workflow

```bash
# 1. Setup
/mcp-setup          # Configure GitHub MCP
/hooks-setup        # Install safety hooks

# 2. Plan feature
/plan "User authentication with OAuth" --issues
# Creates: Epic #100, Issues #101-104

# 3. Run autonomous
/autonomous --epic 100 --target 95

# 4. Monitor via GitHub issues
# - Progress posted as comments
# - Quality gate results visible
# - PRs created automatically

# 5. Review and merge PRs
# Human approval required for each PR
```

### Example 2: Manual with MCP Enhancement

```bash
# Work on issue with GitHub context
/branch 123 "add-oauth-login"

# Claude has direct access to:
# - Issue details via GitHub MCP
# - Can post comments
# - Can check CI status

# Run quality gates
/test --post-to-issue 123
/security --post-to-issue 123
/review --post-to-issue 123

# Create PR
/branch-done
```

### Example 3: Multi-Agent Orchestration

```bash
# Complex task requiring multiple specialists
/orchestrate "Migrate database from MySQL to PostgreSQL"

# Orchestrator coordinates:
# 1. database-specialist - schema analysis
# 2. security-auditor - data sensitivity check
# 3. testing-agent - migration tests
# 4. documentation-agent - update docs
```

---

## Quick Reference

### Commands

| Command | Purpose |
|---------|---------|
| `/autonomous` | Run autonomous development loop |
| `/mcp-setup` | Configure MCP servers |
| `/hooks-setup` | Install safety hooks |
| `/plugin-setup` | Install recommended plugins |
| `/orchestrate` | Multi-agent coordination |

### Files

| File | Purpose |
|------|---------|
| `.mcp.json` | MCP server configuration |
| `.claude/autonomous.yml` | Autonomous mode settings |
| `.claude/settings.json` | Hooks configuration |
| `templates/*.json` | Configuration templates |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub MCP authentication |
| `GITLAB_TOKEN` | GitLab MCP authentication |
| `OPENAI_API_KEY` | For AI-powered plugins |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MCP not loading | Restart Claude Code after config change |
| Context too small | Disable unused MCPs |
| Hook not firing | Check matcher syntax |
| Autonomous stuck | Check issue comments for blockers |
| Plugin not working | Verify installation with `claude plugin list` |

---

## Further Reading

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude Code Plugins](https://github.com/anthropics/claude-plugins-official)
- [Autonomous Skill](skills/workflow/autonomous-development/SKILL.md)
- [Hooks Template](templates/hooks.json)
