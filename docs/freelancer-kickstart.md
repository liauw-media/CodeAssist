# Freelancer Kickstart Guide

Everything a solo web developer/freelancer needs to go from "I have a domain and Odoo" to a fully operational business with AI-powered workflows.

## Your Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    Your Freelance Business                       │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Portfolio    │  │    Odoo      │  │    Obsidian Vault     │  │
│  │  Website      │  │  (Invoices,  │  │  (Clients, projects,  │  │
│  │  yourdomain   │  │   CRM, etc.) │  │   decisions, notes)   │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                       │              │
│         │          ┌──────▼───────┐        ┌──────▼──────┐      │
│         │          │  Odoo MCP    │        │    QMD      │      │
│         │          │  Server      │        │  Search     │      │
│         │          └──────┬───────┘        └──────┬──────┘      │
│         │                 │                       │              │
│  ┌──────▼─────────────────▼───────────────────────▼──────────┐  │
│  │                   Claude Code + CodeAssist                 │  │
│  │                                                            │  │
│  │  /design — Build client sites                              │  │
│  │  /seo    — Optimize for search + AI                        │  │
│  │  /plan   — Scope and estimate projects                     │  │
│  │  Odoo MCP — Create invoices, check payments, manage CRM    │  │
│  │  QMD     — Search past projects, client notes, decisions   │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │               GSD (Get Shit Done)                         │    │
│  │  Discuss → Plan → Execute → Verify → Ship                │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## Phase 1: Foundation (Day 1)

### 1.1 Connect Odoo to Claude Code

This is the highest-impact integration — Claude can create invoices, check payment status, manage clients, and search your business data directly.

Add to your `.mcp.json`:

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

**Setup:**
1. In Odoo: Settings → Users → API Keys → Generate
2. Install `uv`: `curl -LsSf https://astral.sh/uv/install.sh | sh`
3. Add the MCP config above
4. Restart Claude Code

**What you can now do:**
```
"Create an invoice for Client X, 40 hours at €95/hr for website redesign"
"Show me all unpaid invoices older than 30 days"
"Add a new contact: John Doe, Acme Corp, john@acme.com"
"What's my revenue this quarter?"
"Find all projects for client Acme"
```

### 1.2 Set Up Knowledge Base (Obsidian + QMD)

```bash
# Install QMD
npm install -g @tobilu/qmd

# Create an Obsidian vault (or point to existing)
mkdir -p ~/Obsidian/Freelance

# Index it
qmd collection add ~/Obsidian/Freelance --name freelance --mask "**/*.md"
qmd context add qmd://freelance "Freelance business: client notes, project specs, proposals, decisions"
qmd context add qmd://freelance/clients "Client information, contacts, project history"
qmd context add qmd://freelance/projects "Active and past project specs, requirements, architecture"
qmd context add qmd://freelance/proposals "Proposals, estimates, scope documents"
qmd context add qmd://freelance/templates "Reusable templates for proposals, contracts, briefs"
qmd embed

# Add QMD to Claude Code
# Add to .mcp.json:
# "qmd": { "command": "qmd", "args": ["mcp"] }
```

### 1.3 Install GSD

```bash
npx get-shit-done-cc --claude --global
```

Now every project follows: discuss → plan → execute → verify.

## Phase 2: Portfolio Website (Day 2-3)

### 2.1 Install Design Skills

```bash
# Anti-AI-slop design
git clone https://github.com/kesslerio/ultimate-frontend-design-openclaw-skill .claude/skills/frontend-design-ultimate

# 2,500+ shadcn blocks
claude plugin marketplace add masonjames/Shadcnblocks-Skill
claude plugin install shadcnblocks
```

### 2.2 Build Your Portfolio

```bash
/design corporate portfolio for a freelance web developer.
Style: clean, minimal, professional.
Sections: hero with tagline, services (web dev, design, consulting),
featured projects, testimonials, about, contact form.
Stack: Astro + Tailwind v4 + shadcn/ui.
Deploy to: Vercel/Netlify on yourdomain.com
```

### 2.3 SEO From Day 1

```bash
# Install SEO skill
curl -fsSL https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/install.sh | bash
```

Then:
```bash
/seo audit yourdomain.com
/seo schema    # Add JSON-LD structured data
/seo content   # E-E-A-T analysis
/seo geo       # Optimize for AI search (Google AI Overviews, ChatGPT, Perplexity)
```

## Phase 3: Client Workflow (Day 4-5)

### 3.1 Vault Templates

Create these templates in your Obsidian vault for reuse:

**`templates/client-brief.md`:**
```markdown
# Client Brief: {{client}}

## Contact
- Name:
- Company:
- Email:
- Phone:

## Project
- Type: (website / app / redesign / maintenance)
- Budget range:
- Timeline:
- Domain:

## Requirements
-

## Competitors
-

## Notes
-
```

**`templates/proposal.md`:**
```markdown
# Proposal: {{project}}

## Executive Summary
One paragraph explaining what we'll build and why.

## Scope of Work
### Phase 1: Discovery & Design
- Requirement gathering
- Wireframes / design mockups
- Design approval

### Phase 2: Development
- Frontend development
- Backend/CMS setup
- Content integration

### Phase 3: Launch
- Testing & QA
- Deployment
- Training / handoff

## Timeline
| Phase | Duration | Deliverables |
|-------|----------|-------------|
| Discovery | 1 week | Brief, wireframes |
| Design | 1-2 weeks | Approved mockups |
| Development | 2-4 weeks | Working site |
| Launch | 1 week | Live site + docs |

## Investment
| Item | Hours | Rate | Total |
|------|-------|------|-------|
| | | €/hr | € |

## Terms
- 50% upfront, 50% on delivery
- Revisions: 2 rounds included
- Payment: 14 days net
```

**`templates/project-kickoff.md`:**
```markdown
# Project Kickoff: {{project}}

## Client
Link: [[clients/{{client}}]]

## Stack
-

## Repository
-

## Environments
- Dev:
- Staging:
- Production:

## Design
- Figma/Mockup:
- Style: (corporate / startup / editorial)
- Colors:
- Fonts:

## Milestones
- [ ] Brief approved
- [ ] Design approved
- [ ] MVP delivered
- [ ] Content populated
- [ ] QA complete
- [ ] Launched
- [ ] Invoice sent
- [ ] Paid

## Decision Log
| Date | Decision | Reason |
|------|----------|--------|
```

### 3.2 Client Workflow

When a new client reaches out:

```
1. Create client note    → Obsidian: clients/acme-corp.md (from template)
2. Scope the project     → /plan [project description]
3. Generate proposal     → Fill proposal template, use /summary for executive summary
4. Client approves       → Create Odoo contact + quotation via MCP
5. Create project        → /branch [issue-id] [project-name]
6. Design                → /design [brief]
7. Develop               → /gsd:discuss → /gsd:plan → /gsd:execute
8. Review & QA           → /review, /e2e, /evidence
9. Ship                  → /verify, deploy
10. Invoice              → "Create invoice in Odoo for [project], [amount]"
11. Follow up            → "Show unpaid invoices" via Odoo MCP
```

## Phase 4: Ongoing Operations

### 4.1 Weekly Routine

```
Monday:    "Show me all unpaid invoices" (Odoo MCP)
           "What projects are due this week?" (QMD search)

Per project: /gsd:discuss → /gsd:execute → /gsd:verify

Friday:    "What did I ship this week?" (git log)
           /save-session
```

### 4.2 Useful Claude Queries with Odoo

```
"Create a quotation for Client X: website redesign, 60 hours at €95"
"Convert quotation Q-2026-001 to an invoice"
"Show me revenue by client this year"
"List all contacts added this month"
"What's my average project value?"
"Find all overdue invoices and draft follow-up emails"
```

### 4.3 Useful Claude Queries with QMD

```
"Search my vault for architecture decisions on the Acme project"
"Find my proposal template"
"What was the tech stack for the last e-commerce project?"
"Search meeting notes about the redesign requirements"
```

## Essential Skills Summary

### Must Install (Core Business)

| What | Install | Why |
|------|---------|-----|
| **Odoo MCP** | `.mcp.json` config (see above) | Invoices, CRM, payments — hands-free |
| **QMD + Obsidian** | `/qmd setup` then `/qmd obsidian` | Knowledge base, client notes, searchable |
| **GSD** | `npx get-shit-done-cc --claude --global` | Project workflow, context management |
| **Design skills** | `/design setup` | Build client sites professionally |
| **SEO** | `curl -fsSL .../install.sh \| bash` | Every site needs SEO from day 1 |

### Nice to Have (Scale Up)

| What | Install | When |
|------|---------|------|
| **OpenClaw** | `/openclaw setup` | Automate repetitive project tasks |
| **Vibe Kanban** | `npx vibe-kanban` | Visual board when juggling 3+ projects |
| **Paperclip** | `npx paperclipai onboard` | Token budgets when running autonomous agents |
| **Chat monitor** | `npx claude-code-templates@latest --analytics` | Track costs across projects |

### Skip (Not Worth It for Solo)

| What | Why Skip |
|------|----------|
| 139 scientific skills | You're not doing computational biology |
| Generic ClawHub skills | You already have CodeAssist equivalents |
| Multi-agent org charts | You're one person |

## MCP Config (Complete)

Your final `.mcp.json` for the freelance setup:

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
    },
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
      }
    }
  }
}
```

> Keep it to 3 MCPs. More will eat your context window.

## Quick Start Checklist

```
Day 1:
[ ] Connect Odoo MCP (invoices, CRM)
[ ] Set up Obsidian vault with templates
[ ] Index vault with QMD
[ ] Install GSD

Day 2-3:
[ ] Install design skills
[ ] Build portfolio site
[ ] Run SEO audit + fix
[ ] Deploy to domain

Day 4-5:
[ ] Create client brief template
[ ] Create proposal template
[ ] Create project kickoff template
[ ] Test full workflow: brief → proposal → build → invoice

Ongoing:
[ ] Weekly: check unpaid invoices
[ ] Per project: GSD workflow
[ ] Monthly: qmd embed (reindex new notes)
```
