# n8n + Claude Code Setup Guide

Connect your self-hosted n8n instance to Claude Code. Build, manage, and trigger workflows from your terminal.

## Prerequisites

- A running n8n instance (self-hosted or cloud)
- n8n API key (Settings > API > Add API Key)
- Node.js 18+ (for MCP servers)

## Quick Start

### Step 1: Generate an n8n API Key

1. Open your n8n instance (e.g., `https://n8n.your-domain.com`)
2. Go to **Settings > API**
3. Click **Add API Key**
4. Copy the key — you'll need it next

### Step 2: Add n8n MCP to Your Project

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "mcp-n8n-builder"],
      "env": {
        "N8N_BASE_URL": "https://n8n.your-domain.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Or add globally (`~/.claude/.mcp.json`) to use across all projects.

### Step 3: Restart Claude Code

```bash
# Exit and relaunch Claude Code
# The n8n MCP will be available in all sessions
```

### Step 4: Test It

Ask Claude:
- "List my n8n workflows"
- "Create a workflow that sends a Slack message when a GitHub issue is created"
- "Show me the execution history of workflow X"

---

## MCP Server Options

Choose the MCP server that fits your needs:

### Option A: mcp-n8n-builder (Recommended)

Full workflow lifecycle management — create, read, update, delete, execute.

```json
{
  "n8n": {
    "command": "npx",
    "args": ["-y", "mcp-n8n-builder"],
    "env": {
      "N8N_BASE_URL": "https://n8n.your-domain.com",
      "N8N_API_KEY": "your-api-key"
    }
  }
}
```

**Capabilities:** CRUD workflows, trigger executions, manage credentials, Zod schema validation, node type validation with smart suggestions.

**Source:** [spences10/mcp-n8n-builder](https://github.com/spences10/mcp-n8n-builder)

### Option B: n8n-mcp (Node Documentation Expert)

Turns Claude into an n8n workflow architect with knowledge of all 1,236+ nodes.

```json
{
  "n8n-docs": {
    "command": "npx",
    "args": ["-y", "n8n-mcp"],
    "env": {
      "N8N_MCP_API_KEY": "your-api-key"
    }
  }
}
```

**Capabilities:** `get_node()` returns precisely needed properties, `search_nodes` for full-text search, configuration validation. Knows every node's operations, properties, and options.

**Source:** [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) (~13k stars)

**Best setup:** Use both — `n8n-mcp` for building workflows with deep node knowledge, `mcp-n8n-builder` for deploying and managing them.

### Option C: mcp-n8n-server (Lightweight)

Minimal MCP for listing workflows and triggering webhooks.

```json
{
  "n8n": {
    "command": "npx",
    "args": ["-y", "@ahmad.soliman/mcp-n8n-server"],
    "env": {
      "N8N_BASE_URL": "https://n8n.your-domain.com",
      "N8N_API_KEY": "your-api-key"
    }
  }
}
```

**Source:** [ahmadsoliman/mcp-n8n-server](https://github.com/ahmadsoliman/mcp-n8n-server)

### Option D: n8n Built-in MCP Server

Use n8n itself as the MCP server — no external packages needed.

1. In n8n: **Settings > Instance-level MCP > Enable MCP access**
2. Generate a **Personal MCP Access Token**
3. Mark workflows as **"Available in MCP"**
4. Add to your MCP config:

```json
{
  "n8n": {
    "type": "sse",
    "url": "https://n8n.your-domain.com/mcp/sse",
    "headers": {
      "Authorization": "Bearer your-mcp-access-token"
    }
  }
}
```

**Docs:** [n8n MCP Server Documentation](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/)

---

## Install n8n Skills (Optional)

For deeper workflow building expertise, install the companion skills:

```bash
git clone https://github.com/czlonkowski/n8n-skills ~/.claude/skills/n8n
```

This adds 7 SKILL.md files that teach Claude production-ready n8n patterns.

**Source:** [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills)

---

## Reverse Direction: n8n → Claude Code

You can also have n8n trigger Claude Code for automated dev tasks.

### n8n-nodes-claudecode

Custom n8n node that runs Claude Code SDK inside n8n workflows.

```bash
# In your n8n instance
cd ~/.n8n
npm install @johnlindquist/n8n-nodes-claudecode
# Restart n8n
```

**Use cases:**
- Auto-review PRs when GitHub webhook fires
- Diagnose errors from Sentry alerts
- Write database migrations from schema change events
- Generate documentation after code merges

**Source:** [johnlindquist/n8n-nodes-claudecode](https://github.com/johnlindquist/n8n-nodes-claudecode)

### Anthropic Chat Model (Built-in)

Use Claude as the LLM inside n8n's AI Agent workflows — no custom nodes needed.

1. In n8n, add **Anthropic Chat Model** node
2. Enter your Anthropic API key
3. Select model (claude-sonnet-4-20250514 recommended for workflows)
4. Connect to an AI Agent node

---

## Simple Webhook Integration (No MCP)

For simple automation, skip MCP entirely and use n8n webhooks:

### In n8n

1. Create a workflow with a **Webhook** trigger node
2. Set the HTTP method (POST recommended)
3. Activate the workflow to get the production webhook URL

### From Claude Code / Scripts

```bash
# Trigger a deployment workflow
curl -X POST -H "Content-Type: application/json" \
  -d '{"event":"deploy","branch":"main","commit":"abc123"}' \
  https://n8n.your-domain.com/webhook/your-webhook-id

# Trigger from a git hook
# .git/hooks/post-commit
curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"event\":\"commit\",\"branch\":\"$(git branch --show-current)\"}" \
  https://n8n.your-domain.com/webhook/your-webhook-id
```

### From CodeAssist Hooks

Add to your `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$TOOL_INPUT\" | grep -q 'git push'; then curl -s -X POST -H 'Content-Type: application/json' -d '{\"event\":\"push\"}' https://n8n.your-domain.com/webhook/your-id > /dev/null; fi"
          }
        ]
      }
    ]
  }
}
```

---

## Workflow Ideas for Developers

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **Deploy notification** | Git push webhook | Slack/Discord message + log to sheet |
| **PR review reminder** | GitHub webhook (PR opened) | Wait 24h → Slack ping reviewer |
| **Error alert** | Sentry webhook | Create GitHub issue + Slack alert |
| **Invoice on milestone** | GitHub issue closed with label | Create Odoo invoice draft |
| **Daily standup prep** | Cron (8am) | Aggregate yesterday's commits → Slack summary |
| **Dependency update** | Weekly cron | Check npm outdated → Create GitHub issue |
| **Backup verification** | Post-backup webhook | Verify backup file → Slack confirmation |
| **Client report** | Monthly cron | Aggregate issues/PRs → Generate PDF → Email |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP not connecting | Check `N8N_BASE_URL` includes `https://`, no trailing slash |
| Auth errors | Regenerate API key in n8n Settings > API |
| Webhook not firing | Ensure workflow is **activated** (not just saved) |
| Context window shrink | Disable n8n MCP when not needed via `disabledMcpServers` |
| npx timeout | Run `npm install -g mcp-n8n-builder` for faster starts |

---

## Security Notes

- **API keys** grant full access to your n8n instance — treat them like passwords
- Store keys in environment variables, never in committed files
- Use n8n's role-based access if multiple users share the instance
- Consider IP allowlisting on your n8n instance for MCP connections
- The webhook URLs are effectively public endpoints — add authentication headers

---

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n REST API Reference](https://docs.n8n.io/api/api-reference/)
- [n8n MCP Server Docs](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/)
- [n8n Community Forum](https://community.n8n.io/)
- [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) — Node documentation MCP
- [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills) — Claude Code skills
- [spences10/mcp-n8n-builder](https://github.com/spences10/mcp-n8n-builder) — Workflow builder MCP
