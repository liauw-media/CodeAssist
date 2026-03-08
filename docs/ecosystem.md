# CodeAssist Ecosystem

External tools and integrations that work with CodeAssist. Organized by when you need them.

## Decision Tree: What Do I Install?

```
Are you a solo dev starting out?
├── YES → Core Only (GSD + Odoo MCP if you invoice)
│
├── Building client websites?
│   └── Add: /design skills + SEO skill
│
├── Have an Obsidian vault?
│   └── Add: QMD (knowledge base search)
│
├── Feature needs external data?
│   └── Add: Botasaurus (scraping, enrichment)
│
├── Want to automate workflows?
│   └── Add: n8n MCP (connect 1,236+ services)
│
├── Want to automate full projects?
│   └── Add: OpenClaw (orchestration) + Agent Zero (isolated execution)
│
├── Using a visual kanban board?
│   └── Add: Vibe Kanban
│
├── Running 3+ autonomous projects?
│   └── Add: Paperclip (budgets, governance)
│
└── Need more skills?
    └── Browse: ClawHub, aitmpl, SkillsMP
```

## Core (Install First)

### [GSD — Get Shit Done](https://github.com/gsd-build/get-shit-done)

Project workflow engine. Prevents context rot through structured phases.

```bash
npx get-shit-done-cc --claude --local    # Per project
npx get-shit-done-cc --claude --global   # All projects
```

**Phases:** Discuss → Plan → Execute → Verify → Commit
**After install:** `/gsd:help`

GSD manages context files (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md) and runs execution in parallel dependency-based "waves" with fresh 200k-token contexts per subagent.

---

## Automation & Workflows

### [n8n](https://n8n.io/)

Self-hosted workflow automation platform. Connect 1,236+ nodes (services, APIs, databases) with visual workflows. Two integration directions with Claude Code:

**Direction 1: Claude Code → n8n** (build & manage workflows)

| MCP Server | What | Stars |
|------------|------|-------|
| [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp) | Node documentation for all 1,236+ nodes. Claude becomes an n8n architect | ~13k |
| [spences10/mcp-n8n-builder](https://github.com/spences10/mcp-n8n-builder) | Full CRUD, execution management, schema validation | — |
| [n8n built-in MCP](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/) | Expose workflows as MCP tools (Settings > MCP) | Official |

**Add to `.mcp.json`:**
```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-n8n-builder"],
      "env": {
        "N8N_BASE_URL": "https://n8n.your-domain.com",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Direction 2: n8n → Claude Code** (automate dev tasks)

| Node | What |
|------|------|
| [n8n-nodes-claudecode](https://github.com/johnlindquist/n8n-nodes-claudecode) | Run Claude Code SDK inside n8n workflows — auto-review PRs, diagnose errors, write migrations |
| Anthropic Chat Model (built-in) | Use Claude as LLM inside n8n AI Agent workflows |

**Direction 3: Simple webhooks** (no MCP needed)
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"event":"deploy","branch":"main"}' \
  https://n8n.your-domain.com/webhook/your-webhook-id
```

**Skills:** [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills) — 7 SKILL.md files for building production n8n workflows
**Setup:** Generate API key in n8n (Settings > API) → Add MCP config → Restart Claude Code
**Use cases:** Post-deploy notifications, CI/CD triggers, CRM syncing, invoice automation, monitoring alerts, scheduled reports

---

## Business Tools

### [Odoo MCP](https://github.com/ivnvxd/mcp-server-odoo)

Connect your Odoo ERP to Claude Code. Create invoices, manage CRM, search business data — all from natural language.

**Add to `.mcp.json`:**
```json
{
  "mcpServers": {
    "odoo": {
      "command": "uvx",
      "args": ["mcp-server-odoo"],
      "env": {
        "ODOO_URL": "https://your-odoo.com",
        "ODOO_API_KEY": "your-api-key",
        "ODOO_DB": "your-database"
      }
    }
  }
}
```

**Setup:** Install `uv` → Generate API key in Odoo → Add MCP config → Restart Claude Code
**Capabilities:** Search, create, update, delete records. Smart field selection. Works with contacts, invoices, products, projects.
**Guide:** [docs/freelancer-kickstart.md](freelancer-kickstart.md)

---

## Knowledge & Search

### [QMD](https://github.com/tobi/qmd)

On-device search engine for your knowledge base. Index markdown notes, docs, transcripts. Hybrid search (BM25 + vector + LLM reranking).

```bash
npm install -g @tobilu/qmd
```

**MCP:** `{ "mcpServers": { "qmd": { "command": "qmd", "args": ["mcp"] } } }`
**Obsidian:** `qmd collection add "~/Obsidian Vaults/MyVault" --name vault --mask "**/*.md" && qmd embed`
**Command:** `/qmd` (setup, search, query, obsidian, status, stack)
**Full stack guide:** [docs/obsidian-ai-setup.md](obsidian-ai-setup.md)

---

## Data & Enrichment

### [Botasaurus](https://github.com/omkarcloud/botasaurus)

Anti-ban web scraping framework for data collection and enrichment. Build scrapers that feed features — competitor analysis, pricing data, lead enrichment, content aggregation.

```bash
pip install botasaurus
```

**Three modes:** `@browser` (Selenium with anti-detection), `@request` (fast HTTP), `@task` (data processing)
**Anti-ban:** Real browser fingerprints, human-like behavior, user-agent rotation, proxy support
**Output:** Caching, parallel scraping, deploy as web UI or desktop app
**Use cases:** Enrich CRM data, scrape competitor pricing, aggregate content for features, build data-driven MVPs

```python
from botasaurus.browser import browser, Driver

@browser(parallel=3, cache=True)
def scrape(driver: Driver, url):
    driver.get(url)
    return driver.text("h1")
```

**When to use:** Your feature needs external data — pricing, leads, listings, reviews, competitor intel. Scrape it, enrich it, build on it.

---

## Agent Orchestration

### [OpenClaw + ClawHub](https://docs.openclaw.ai/tools/clawhub)

Open-source AI agent framework with 3,200+ skills on ClawHub registry. Skills use same SKILL.md format as Claude Code.

```bash
npm install -g clawhub          # Skill registry CLI
clawhub search "code review"    # Vector search
clawhub install <slug>          # Install skill
```

**Command:** `/openclaw` (setup, search, install, publish, mcp, sync, project)
**Project delegation:** `/openclaw project "Build me an API"` — sends to OpenClaw for full autonomous lifecycle
**MCP bridge:** Delegate tasks between Claude Code and OpenClaw agents
**Integration guide:** [docs/openclaw-integration.md](openclaw-integration.md)
**Project orchestration:** [docs/openclaw-project-orchestration.md](openclaw-project-orchestration.md)

> **Security:** ~20% of ClawHub skills flagged as malicious. Always check VirusTotal reports before installing.

---

### [Agent Zero](https://github.com/agent0ai/agent-zero)

Docker-based autonomous agent framework. Runs in its own isolated Linux container — can write code, execute terminal commands, browse the web, and self-correct. Uses the same SKILL.md format as Claude Code.

```bash
git clone https://github.com/agent0ai/agent-zero
cd agent-zero && docker compose up -d
```

**When to use:** You want isolated, autonomous execution where agents can't trash your host system.
**Unique features:** Docker sandboxing, multi-agent web UI, Ollama integration (local-first), hybrid memory (facts + solutions + behaviors), SearXNG private search, LiteLLM multi-provider support.
**Complementary to OpenClaw:** Agent Zero is the *runtime* (where agents execute safely). OpenClaw is the *orchestrator* (where agents are coordinated). Use both together for safe autonomous workflows.

```
Paperclip        → Budgets, governance, multi-project
  └── OpenClaw   → Agent orchestration, skill marketplace
       └── Agent Zero → Isolated Docker execution
            └── Claude Code + CodeAssist → Writes code
```

---

### [Paperclip](https://github.com/paperclipai/paperclip)

Multi-agent management server — the "company" layer above individual agents.

```bash
npx paperclipai onboard --yes
```

**When to use:** Running 3+ autonomous projects and need cost governance.
**Unique features:** Per-agent token budgets with throttling, heartbeat scheduling, multi-project isolation, org charts, atomic task checkout, full audit logs.
**Stack:** Node.js + PostgreSQL + React UI at localhost:3100

---

### [Vibe Kanban](https://github.com/BloopAI/vibe-kanban)

Visual kanban board for AI coding agents.

```bash
npx vibe-kanban                                              # Quick start
git clone https://github.com/BloopAI/vibe-kanban && docker compose up -d  # Self-host
```

**Features:** Kanban board with drag-drop, assign to 10+ agents (Claude Code, Codex, Gemini CLI, etc.), inline code review with diffs, built-in browser preview with devtools, per-workspace Git branches.
**When to use:** You prefer visual boards over chat-only orchestration.

---

## Design & SEO

### Design Skills

Anti-AI-slop frontend development with shadcn/ui and Tailwind CSS.

**Command:** `/design` (setup, build, tokens, audit, blocks, reference)
**Setup:** `/design setup` installs all skills

| Skill | Source | Install |
|-------|--------|---------|
| ultimate-frontend-design | [kesslerio](https://github.com/kesslerio/ultimate-frontend-design-openclaw-skill) | `git clone` to `.claude/skills/` |
| shadcnblocks (2,500+ blocks) | [masonjames](https://github.com/masonjames/Shadcnblocks-Skill) | `claude plugin install shadcnblocks` |
| tailwind-v4-shadcn (93% score) | [secondsky](https://tessl.io/registry/skills/github/secondsky/claude-skills/tailwind-v4-shadcn) | `npx tessl i` |

**Reference:** `.claude/skills/external/frontend-design/references/design-skills-registry.md`

### SEO Skill

13 sub-skills, 6 subagents for technical SEO, E-E-A-T, schema, AI search optimization.

```bash
curl -fsSL https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/install.sh | bash
```

**Source:** [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)

---

## Skill Registries

Install additional skills from these sources via `/skill-install`:

| Source | Skills | Install | Notes |
|--------|--------|---------|-------|
| [aitmpl](https://aitmpl.com) | 100+ | `npx claude-code-templates@latest --skill=<path> --yes` | Also has analytics + chat monitor |
| [ClawHub](https://docs.openclaw.ai/tools/clawhub) | 3,200+ | `clawhub install <slug>` | Vector search, security warnings |
| [SkillsMP](https://skillsmp.com) | 32,000+ | Browse + download | Community marketplace |
| [Vercel](https://github.com/vercel-labs/agent-skills) | 10+ | `git clone` to `.claude/skills/` | Official React/Next.js skills |
| [Anthropic](https://github.com/anthropics/skills) | Spec | Reference | SKILL.md format standard |

---

## Monitoring & Debugging

### claude-code-templates — Monitoring Tools

```bash
npx claude-code-templates@latest --analytics       # Real-time session monitoring (tokens, costs)
npx claude-code-templates@latest --chats            # Watch Claude responses from another terminal
npx claude-code-templates@latest --chats --tunnel   # Remote monitoring via secure tunnel
npx claude-code-templates@latest --health-check     # Diagnostics and optimization
```

**Source:** [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
**Useful for:** Monitoring OpenClaw ACP sessions, tracking costs across projects.

---

## Inspirations

Projects that influenced CodeAssist's design:

| Project | Contribution |
|---------|-------------|
| [everything-claude-code](https://github.com/affaan-m/everything-claude-code) | Rules system, hooks, TDD workflow, specialized agents |
| [agency-agents](https://github.com/msitarzewski/agency-agents) | 51 agent personalities — Sprint Prioritizer, Reality Checker, UX Architect, etc. |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Persistent memory system with SQLite + vector storage |
