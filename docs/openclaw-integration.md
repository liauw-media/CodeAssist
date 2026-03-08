# OpenClaw + CodeAssist Integration

Integrate OpenClaw's ClawHub skill ecosystem with CodeAssist, and let OpenClaw agents leverage CodeAssist features.

## Why Integrate

- **ClawHub has 3,200+ skills** — reusable modules for APIs, databases, workflows, and more
- **Same SKILL.md format** — both OpenClaw and Claude Code use the AgentSkills spec
- **Bidirectional** — Claude Code can use OpenClaw skills, OpenClaw can use CodeAssist skills
- **MCP bridge** — delegate tasks between Claude and OpenClaw agents

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your Development Machine                     │
│                                                                  │
│  ┌──────────────┐              ┌──────────────────────────────┐  │
│  │  Claude Code │◀────────────▶│         OpenClaw             │  │
│  │              │   MCP Bridge │                              │  │
│  │  CodeAssist  │              │  ClawHub Skills              │  │
│  │  Skills      │              │  Custom Skills               │  │
│  └──────┬───────┘              └──────────┬───────────────────┘  │
│         │                                 │                      │
│         ▼                                 ▼                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Shared Skills Directory                      │    │
│  │  ~/.claude/skills/   ←→   ~/.openclaw/skills/            │    │
│  │                                                          │    │
│  │  Both use SKILL.md (AgentSkills spec)                    │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                   ClawHub Registry                        │    │
│  │  3,200+ skills · Vector search · Versioned bundles       │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## Integration Path 1: Use ClawHub Skills in Claude Code

ClawHub skills use the same SKILL.md format as Claude Code. You can install them directly.

### Install ClawHub CLI

```bash
npm install -g clawhub
```

### Search and Install Skills

```bash
# Search by keyword or natural language
clawhub search "database migration"
clawhub search "API testing"
clawhub search "docker deployment"

# Install a skill
clawhub install <skill-slug>
```

### Point Claude Code at ClawHub Skills

By default, `clawhub install` puts skills in `./skills/`. To make them available to Claude Code:

**Option A: Symlink (recommended)**

```bash
# Link ClawHub skills into Claude Code's skill directory
ln -s ~/.openclaw/skills ~/.claude/skills/openclaw

# Or for project-level
ln -s ./skills .claude/skills/openclaw
```

**Option B: Configure extra directories**

In your project's `CLAUDE.md` or settings, reference the OpenClaw skills directory:

```markdown
Skills are also loaded from `./skills/` (ClawHub) in addition to `.claude/skills/`.
```

**Option C: Copy on install**

```bash
# Install script that copies to both locations
clawhub install <skill-slug>
cp -r ./skills/<skill-slug> .claude/skills/<skill-slug>
```

### Recommended ClawHub Skills for Development

```bash
# Search for highly-rated development skills
clawhub search "code review"
clawhub search "git workflow"
clawhub search "security audit"
clawhub search "API design"
clawhub search "database optimization"
```

> **Security warning:** ~20% of ClawHub skills have been flagged as malicious. Always check the VirusTotal report on a skill's ClawHub page before installing. Prefer skills with high download counts and no security flags.

## Integration Path 2: Publish CodeAssist Skills to ClawHub

Share CodeAssist's battle-tested skills with the OpenClaw community.

### Authenticate

```bash
clawhub login
```

### Publish Individual Skills

```bash
# Publish a CodeAssist skill to ClawHub
clawhub publish ./skills/core/code-review \
  --slug codeassist-code-review \
  --name "CodeAssist Code Review" \
  --version 1.0.0 \
  --tags code-review,quality,claude-code

clawhub publish ./skills/safety/database-backup \
  --slug codeassist-database-backup \
  --name "CodeAssist Database Backup" \
  --version 1.0.0 \
  --tags database,backup,safety
```

### Batch Publish All Skills

```bash
# From CodeAssist root
clawhub sync --all --bump patch
```

### CodeAssist Skills Worth Publishing

| Skill | ClawHub Slug | Value |
|-------|-------------|-------|
| `code-review` | `codeassist-code-review` | Skeptical review with evidence |
| `database-backup` | `codeassist-db-backup` | Auto-backup before operations |
| `test-driven-development` | `codeassist-tdd` | Red-Green-Refactor cycle |
| `system-architect` | `codeassist-architect` | Security hardening patterns |
| `branch-discipline` | `codeassist-branch` | Git workflow discipline |
| `defense-in-depth` | `codeassist-defense` | Security layers |

## Integration Path 3: MCP Bridge (Claude ↔ OpenClaw)

Let Claude Code delegate tasks to OpenClaw agents, and vice versa.

### Setup OpenClaw MCP Bridge

**Docker (recommended):**

```yaml
# Add to your docker-compose.yml or create standalone
services:
  openclaw-mcp:
    image: ghcr.io/freema/openclaw-mcp:latest
    container_name: openclaw-mcp
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      - OPENCLAW_URL=http://host.docker.internal:18789
      - OPENCLAW_GATEWAY_TOKEN=${OPENCLAW_GATEWAY_TOKEN}
      - AUTH_ENABLED=false  # true for production/remote
      - CORS_ORIGINS=https://claude.ai
    extra_hosts:
      - "host.docker.internal:host-gateway"
    read_only: true
    security_opt:
      - no-new-privileges
```

**Local (Claude Code):**

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "openclaw": {
      "command": "npx",
      "args": ["openclaw-mcp"],
      "env": {
        "OPENCLAW_URL": "http://127.0.0.1:18789",
        "OPENCLAW_GATEWAY_TOKEN": "your-gateway-token",
        "OPENCLAW_TIMEOUT_MS": "300000"
      }
    }
  }
}
```

### What the MCP Bridge Enables

| Tool | Purpose |
|------|---------|
| `openclaw_chat` | Send tasks to OpenClaw, get immediate response |
| `openclaw_chat_async` | Queue long-running tasks, get task ID |
| `openclaw_task_status` | Monitor task progress |
| `openclaw_task_list` | View all queued tasks |
| `openclaw_task_cancel` | Cancel running tasks |
| `openclaw_status` | Health check |

### Use Cases

**Claude delegates to OpenClaw:**
```
"Hey OpenClaw, research the latest React 19 patterns and summarize"
"Run the deployment checklist on the staging server"
"Monitor the CI pipeline and report back"
```

**OpenClaw delegates to Claude Code:**
OpenClaw can invoke Claude Code via the `claude` CLI:
```bash
# OpenClaw skill that delegates to Claude Code
claude -p "Review the last commit for security issues"
claude -p "Run /test and report results"
```

## Integration Path 4: Shared Skill Sync

Keep skills synchronized between both agents.

### Bidirectional Sync Script

Create `scripts/sync-skills.sh`:

```bash
#!/bin/bash
# Sync skills between CodeAssist and OpenClaw

CLAUDE_SKILLS=".claude/skills"
OPENCLAW_SKILLS="$HOME/.openclaw/skills"
SHARED_SKILLS="$HOME/.shared-skills"

mkdir -p "$SHARED_SKILLS"

echo "=== Syncing skills ==="

# Copy CodeAssist skills to shared
for skill_dir in "$CLAUDE_SKILLS"/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        skill_name=$(basename "$skill_dir")
        cp -r "$skill_dir" "$SHARED_SKILLS/$skill_name"
        echo "  → $skill_name (CodeAssist → shared)"
    fi
done

# Copy OpenClaw skills to shared
for skill_dir in "$OPENCLAW_SKILLS"/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        skill_name=$(basename "$skill_dir")
        if [ ! -d "$SHARED_SKILLS/$skill_name" ]; then
            cp -r "$skill_dir" "$SHARED_SKILLS/$skill_name"
            echo "  ← $skill_name (OpenClaw → shared)"
        fi
    fi
done

# Symlink shared skills to both agents
ln -sfn "$SHARED_SKILLS" "$CLAUDE_SKILLS/shared" 2>/dev/null
ln -sfn "$SHARED_SKILLS" "$OPENCLAW_SKILLS/shared" 2>/dev/null

echo "=== Sync complete ==="
echo "Shared skills: $(ls -1 "$SHARED_SKILLS" | wc -l)"
```

### Auto-Sync on Skill Changes

Add to your hooks or cron:

```bash
# Watch for skill changes and auto-sync
fswatch -o .claude/skills/ ~/.openclaw/skills/ | xargs -n1 ./scripts/sync-skills.sh
```

## Security Considerations

### ClawHub Skills

```
⚠️  ~20% of ClawHub skills have been flagged as malicious.

Before installing any ClawHub skill:
1. Check the VirusTotal report on the skill's ClawHub page
2. Prefer skills with high download counts
3. Read the SKILL.md before installing
4. Check for suspicious shell commands or network calls
5. Never install skills that request unnecessary permissions
```

### MCP Bridge Security

- Always use `AUTH_ENABLED=true` for remote/production deployments
- Generate strong secrets: `openssl rand -hex 32`
- Restrict CORS origins to known clients
- Use Tailscale or VPN for server-to-server communication
- Run bridge container as read-only with `no-new-privileges`

### Skill Isolation

- ClawHub skills should go in a separate directory (not mixed with trusted CodeAssist skills)
- Review any skill that executes shell commands
- Use the symlink approach so you can quickly unlink untrusted skills

## Quick Start

```bash
# 1. Install ClawHub CLI
npm install -g clawhub

# 2. Install some popular skills
clawhub search "code review"
clawhub install <top-result>

# 3. Link to Claude Code
ln -s ./skills .claude/skills/openclaw

# 4. (Optional) Set up MCP bridge
# Add openclaw MCP to .mcp.json (see above)

# 5. (Optional) Publish CodeAssist skills
clawhub login
clawhub publish ./skills/core/code-review --slug codeassist-code-review

# 6. Test
# In Claude Code: "use the code-review skill from OpenClaw"
```

## References

- [OpenClaw Documentation](https://docs.openclaw.ai/)
- [ClawHub Registry](https://docs.openclaw.ai/tools/clawhub)
- [OpenClaw Skills Spec](https://docs.openclaw.ai/tools/skills)
- [OpenClaw MCP Bridge](https://github.com/freema/openclaw-mcp)
- [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills)
- [AgentSkills Spec](https://github.com/anthropics/skills)
- [ClawHub Security](https://blog.cyberdesserts.com/openclaw-malicious-skills-security/)
