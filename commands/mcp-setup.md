# MCP Setup

Configure Model Context Protocol (MCP) servers to extend Claude Code capabilities.

## Task
$ARGUMENTS

## MCP Setup Protocol

**MCPs give Claude direct access to external tools, databases, and APIs.**

### What are MCPs?

MCP (Model Context Protocol) is an open standard for AI-tool integrations. Instead of asking you to copy-paste data, Claude can directly:
- Query your database
- Search Slack messages
- Create GitHub PRs
- Run browser tests
- Check error logs in Sentry

### Step 1: Check Current MCPs

```bash
# List configured MCP servers
cat .mcp.json 2>/dev/null || echo "No .mcp.json found"
```

### Step 2: Choose a Preset

Ask the user which preset matches their workflow:

| Preset | Best For | MCPs Included |
|--------|----------|---------------|
| **web** | Frontend, React, Next.js | Playwright, Lighthouse, Chrome DevTools, GitHub, Context7 |
| **backend** | APIs, databases, services | PostgreSQL, Docker, GitHub, Sentry, Sequential Thinking |
| **fullstack** | Full applications | All web + backend MCPs |
| **minimal** | Quick start | GitHub, Sequential Thinking |
| **custom** | Pick your own | Interactive selection |

### Step 3: Copy Preset Template

Based on user choice, copy the appropriate template:

```bash
# Web preset
cp ~/.claude/templates/mcp-web.json .mcp.json

# Backend preset
cp ~/.claude/templates/mcp-backend.json .mcp.json

# Full template (all MCPs, comment out unused)
cp ~/.claude/templates/mcp.json .mcp.json
```

Or if CodeAssist is installed in .claude/:
```bash
cp .claude/templates/mcp-web.json .mcp.json
```

### Step 4: Configure Environment Variables

Most MCPs need credentials. Help the user set these up:

**GitHub (recommended for all projects):**
```bash
# Create token at: https://github.com/settings/tokens
export GITHUB_TOKEN="ghp_xxxx"
```

**Database:**
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

**Slack:**
```bash
# Create app at: https://api.slack.com/apps
export SLACK_BOT_TOKEN="xoxb-xxxx"
```

**Sentry:**
```bash
# Via OAuth (recommended):
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

### Step 5: Enable in Settings

Add to `.claude/settings.local.json`:
```json
{
  "enableAllProjectMcpServers": true
}
```

### Step 6: Verify Installation

```bash
# Restart Claude Code to load MCPs
# Then test with:
claude --version
```

After restart, MCPs should be available. Test by asking Claude to use one.

### Recommended MCPs by Use Case

| If you do... | Install these MCPs |
|--------------|-------------------|
| **Code review** | GitHub, Sequential Thinking |
| **E2E testing** | Playwright, Chrome DevTools |
| **Performance** | Lighthouse |
| **Database work** | PostgreSQL/SQLite, Supabase |
| **API development** | Context7, Sentry |
| **DevOps** | Docker, Kubernetes, AWS |
| **Team collaboration** | Slack, Linear |

### Boris Cherny's Setup (Claude Code Creator)

From his workflow:
- **Slack MCP** - Search and post to team channels
- **BigQuery** - Analytics queries via bq CLI
- **Sentry** - Error log investigation
- Shared `.mcp.json` checked into git for team

### Troubleshooting

| Issue | Solution |
|-------|----------|
| MCP not loading | Restart Claude Code after adding to .mcp.json |
| Auth errors | Check environment variables are set |
| Slow startup | Reduce number of MCPs (2-3 recommended) |
| Command not found | Ensure npx/node is installed |

### Output Format

```
## MCP Setup Complete

**Preset:** [web/backend/fullstack/custom]

**Configured MCPs:**
- [x] MCP Name - Description

**Environment Variables Needed:**
- [ ] GITHUB_TOKEN - https://github.com/settings/tokens
- [ ] DATABASE_URL - Your database connection string

**Next Steps:**
1. Set environment variables
2. Restart Claude Code
3. Test by asking Claude to use an MCP

**Quick Test:**
"Search my GitHub repo for recent PRs"
"Run Lighthouse on localhost:3000"
```

### Resources

- [MCP Documentation](https://code.claude.com/docs/en/mcp)
- [awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers)
- [MCP Server List](https://mcpservers.org/)

**Execute the setup interactively. Ask the user which preset they want, then configure accordingly.**
