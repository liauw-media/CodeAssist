# OpenClaw Integration

Integrate OpenClaw's ClawHub skills with CodeAssist and set up the MCP bridge.

## Task
$ARGUMENTS

## Decision Tree

```
No arguments or "setup"     → Run SETUP flow (install CLI, link skills)
"search [query]"            → Search ClawHub for skills
"install [skill]"           → Install a ClawHub skill + link to Claude Code
"publish [skill]"           → Publish a CodeAssist skill to ClawHub
"publish-all"               → Batch publish all CodeAssist skills
"mcp"                       → Set up OpenClaw MCP bridge
"sync"                      → Sync skills between Claude Code and OpenClaw
"project [idea]"            → Delegate full project to OpenClaw (ACP + Lobster pipeline)
"list"                      → List installed ClawHub skills
"help"                      → Show all commands
```

---

## SETUP Flow

### Step 1: Check Prerequisites

```bash
node --version
clawhub --version 2>/dev/null || echo "CLAWHUB_NOT_FOUND"
```

### Step 2: Install ClawHub CLI

```bash
npm install -g clawhub
```

### Step 3: Authenticate (Optional — needed for publishing)

```bash
clawhub login
clawhub whoami
```

### Step 4: Create Skill Link

Link ClawHub skills directory so Claude Code can see them:

```bash
# Create the link
mkdir -p .claude/skills
ln -sfn "$(pwd)/skills" .claude/skills/openclaw 2>/dev/null || mklink /D .claude\skills\openclaw skills 2>nul
```

### Step 5: Install Recommended Skills

Ask the user what they work on, then suggest relevant ClawHub skills:

```bash
# Search based on their needs
clawhub search "code review"
clawhub search "git workflow"
clawhub search "API testing"
```

Install selected skills:

```bash
clawhub install <skill-slug>
```

### Step 6: Security Check

**IMPORTANT:** Before using any ClawHub skill, verify it:

```
⚠️  ~20% of ClawHub skills have been flagged as malicious.

For each installed skill:
1. Check VirusTotal report on the skill's ClawHub page
2. Read the SKILL.md content before using
3. Look for suspicious shell commands or network calls
4. Prefer skills with high download counts and no flags
```

### Output

```
## OpenClaw Integration Complete

**ClawHub CLI:** Installed
**Skills linked:** .claude/skills/openclaw → ./skills/
**Installed skills:** [N]

**Commands:**
| Action | Command |
|--------|---------|
| Search skills | `/openclaw search [query]` |
| Install skill | `/openclaw install [slug]` |
| Publish skill | `/openclaw publish [path]` |
| Set up MCP | `/openclaw mcp` |
| Sync skills | `/openclaw sync` |

**Security:** Always check VirusTotal before using ClawHub skills.
```

---

## SEARCH Flow

```bash
clawhub search "$QUERY"
```

Present results with download counts and tags. Highlight any security flags.

If the user wants to install a result:
```bash
clawhub install <slug>
```

---

## INSTALL Flow

```bash
# Install the skill
clawhub install $SKILL_SLUG

# Verify it was installed
clawhub list | grep $SKILL_SLUG

# Check the SKILL.md for safety
cat skills/$SKILL_SLUG/SKILL.md
```

Warn user about any suspicious content in the SKILL.md (shell commands, network calls, API key requirements).

---

## PUBLISH Flow

Publish a CodeAssist skill to ClawHub:

```bash
# Authenticate first
clawhub whoami || clawhub login

# Publish
clawhub publish $SKILL_PATH \
  --slug "codeassist-$(basename $SKILL_PATH)" \
  --name "CodeAssist $(basename $SKILL_PATH)" \
  --version 1.0.0 \
  --tags codeassist,claude-code
```

---

## PUBLISH-ALL Flow

Batch publish all CodeAssist skills:

```bash
clawhub whoami || clawhub login

# Publish each skill that has a SKILL.md
for skill_dir in skills/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        name=$(basename "$skill_dir")
        echo "Publishing: $name"
        clawhub publish "$skill_dir" \
          --slug "codeassist-$name" \
          --name "CodeAssist $name" \
          --tags codeassist,claude-code
    fi
done

# Also publish nested skills
for skill_dir in skills/*/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
        category=$(basename "$(dirname "$skill_dir")")
        name=$(basename "$skill_dir")
        echo "Publishing: $category/$name"
        clawhub publish "$skill_dir" \
          --slug "codeassist-$category-$name" \
          --name "CodeAssist $category/$name" \
          --tags codeassist,claude-code,$category
    fi
done
```

---

## MCP Flow

Set up the OpenClaw MCP bridge so Claude Code can delegate tasks to OpenClaw agents.

### Step 1: Check OpenClaw is running

```bash
curl -s http://127.0.0.1:18789/health 2>/dev/null || echo "OPENCLAW_NOT_RUNNING"
```

If not running, inform the user they need OpenClaw running locally first.

### Step 2: Add MCP Config

Check for existing `.mcp.json`:

```bash
cat .mcp.json 2>/dev/null || echo "{}"
```

Add the OpenClaw MCP server. Ask the user for their gateway token, or help them find it.

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "openclaw": {
      "command": "npx",
      "args": ["openclaw-mcp"],
      "env": {
        "OPENCLAW_URL": "http://127.0.0.1:18789",
        "OPENCLAW_GATEWAY_TOKEN": "GATEWAY_TOKEN_HERE",
        "OPENCLAW_TIMEOUT_MS": "300000"
      }
    }
  }
}
```

### Step 3: Verify

After Claude Code restart, the following MCP tools should be available:
- `openclaw_chat` — Send tasks to OpenClaw
- `openclaw_chat_async` — Queue long-running tasks
- `openclaw_task_status` — Check task progress
- `openclaw_status` — Health check

---

## SYNC Flow

Synchronize skills between Claude Code and OpenClaw:

```bash
CLAUDE_SKILLS=".claude/skills"
OPENCLAW_SKILLS="$HOME/.openclaw/skills"

echo "=== Claude Code skills ==="
find "$CLAUDE_SKILLS" -name "SKILL.md" -maxdepth 3 | wc -l

echo "=== OpenClaw skills ==="
find "$OPENCLAW_SKILLS" -name "SKILL.md" -maxdepth 3 2>/dev/null | wc -l

echo "=== Syncing ==="

# Link OpenClaw skills into Claude Code
ln -sfn "$OPENCLAW_SKILLS" "$CLAUDE_SKILLS/openclaw-managed" 2>/dev/null

# Link CodeAssist skills into OpenClaw
ln -sfn "$(pwd)/$CLAUDE_SKILLS" "$OPENCLAW_SKILLS/codeassist" 2>/dev/null

echo "=== Done ==="
```

---

## LIST Flow

```bash
clawhub list
```

Show installed skills with their versions and descriptions.

---

## Security Notes

Present these to the user during any install operation:

```
╔═══════════════════════════════════════════════════════════════════╗
║  ClawHub Security: ~20% of skills flagged as malicious           ║
║                                                                   ║
║  ALWAYS:                                                          ║
║  • Check VirusTotal report before installing                      ║
║  • Read SKILL.md content for suspicious commands                  ║
║  • Prefer high-download-count skills                              ║
║  • Keep ClawHub skills in separate directory from trusted skills  ║
║                                                                   ║
║  NEVER:                                                           ║
║  • Install skills that request unnecessary API keys               ║
║  • Run skills that execute unknown shell commands                  ║
║  • Trust skills with 0 downloads or brand-new accounts            ║
╚═══════════════════════════════════════════════════════════════════╝
```

## PROJECT Flow

Delegate a full project idea to OpenClaw for autonomous development.

### Prerequisites Check

```bash
# Check OpenClaw is running
curl -s http://127.0.0.1:18789/health 2>/dev/null || echo "OPENCLAW_NOT_RUNNING"

# Check ACP is configured
cat ~/.openclaw/openclaw.json 2>/dev/null | grep -q "acp" || echo "ACP_NOT_CONFIGURED"

# Check Claude Code is available
claude --version 2>/dev/null || echo "CLAUDE_CODE_NOT_FOUND"
```

If any prerequisite fails, guide the user through setup. See [docs/openclaw-project-orchestration.md](docs/openclaw-project-orchestration.md).

### If All Prerequisites Met

Ask the user for their project idea if not provided. Then:

1. Check if agent configs exist, create them if not:
   - `~/.openclaw/agents/project-orchestrator/AGENT.md`
   - `~/.openclaw/agents/programmer/AGENT.md`
   - `~/.openclaw/agents/reviewer/AGENT.md`
   - `~/.openclaw/agents/tester/AGENT.md`

2. Check if Lobster workflows exist, create them if not:
   - `~/.openclaw/workflows/project-pipeline.lobster`
   - `~/.openclaw/workflows/review-cycle.lobster`

3. Create project working directory

4. Trigger the pipeline:
```bash
lobster run project-pipeline \
  --arg idea="$USER_IDEA" \
  --arg workdir="$PROJECT_DIR"
```

Or via the OpenClaw API:
```bash
curl -X POST http://localhost:18789/api/v1/chat \
  -H "Authorization: Bearer $GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"$USER_IDEA\", \"agent\": \"project-orchestrator\"}"
```

5. Report that the project has been delegated and how to monitor progress.

For full details on the pipeline, agent configs, approval gates, and cost optimization, see [docs/openclaw-project-orchestration.md](docs/openclaw-project-orchestration.md).

---

## Full Guide

For detailed architecture, bidirectional sync, and publishing strategy, see:
- [docs/openclaw-integration.md](docs/openclaw-integration.md)
- [docs/openclaw-project-orchestration.md](docs/openclaw-project-orchestration.md)

**Execute the appropriate flow based on user arguments. If no arguments, run SETUP interactively.**
