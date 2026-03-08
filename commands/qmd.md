# QMD - Knowledge Base Search

Set up and use QMD as your local knowledge base search engine. Index Obsidian vaults, markdown notes, docs, and meeting transcripts — search with hybrid AI (BM25 + vector + LLM reranking), all on-device.

## Task
$ARGUMENTS

## Decision Tree

Based on the user's arguments, determine the action:

```
No arguments or "setup"     → Run SETUP flow
"obsidian" or "vault"       → Run OBSIDIAN SETUP flow
"add [path]"                → Run ADD COLLECTION flow
"search [query]"            → Run SEARCH flow
"query [query]"             → Run DEEP SEARCH flow (hybrid + reranking)
"status"                    → Run STATUS flow
"reindex" or "embed"        → Run REINDEX flow
"mcp"                       → Run MCP SETUP flow
"stack"                     → Show full Docker stack guide (Obsidian + CouchDB + QMD)
"help"                      → Show all commands
```

---

## SETUP Flow

### Step 1: Check Prerequisites

```bash
# Check Node.js version (needs 22+)
node --version

# Check if qmd is installed
qmd --version 2>/dev/null || echo "QMD_NOT_FOUND"
```

### Step 2: Install QMD

If not found:

```bash
npm install -g @tobilu/qmd
```

Verify:
```bash
qmd --version
```

**Note:** First run downloads ~1.7GB of models (embedding + reranking). This is a one-time download.

### Step 3: Ask User What to Index

Ask the user:

> What would you like to index? Common options:
> 1. **Obsidian vault** — Point to your vault folder
> 2. **Project docs** — Index this project's documentation
> 3. **Notes directory** — Any folder of markdown files
> 4. **Meeting transcripts** — Transcripts and recordings notes
> 5. **Multiple sources** — Set up several collections

Based on their answer, proceed to the appropriate ADD COLLECTION flow.

### Step 4: Generate Embeddings

```bash
qmd embed
```

This processes all indexed documents. First run is slow (downloading models + processing). Subsequent runs are incremental.

### Step 5: Verify

```bash
# Check status
qmd status

# Test a search
qmd search "test query" --limit 3
```

### Step 6: Set Up MCP (Optional)

Ask the user if they want Claude to be able to search their knowledge base directly:

If yes, proceed to MCP SETUP flow.

### Output

```
## QMD Setup Complete

**Collections:**
- [name]: [path] ([N] documents)

**Models:** Downloaded and ready
**Embeddings:** Generated

**Quick Reference:**
| Action | Command |
|--------|---------|
| Keyword search | `/qmd search [query]` |
| Deep search | `/qmd query [query]` |
| Add collection | `/qmd add [path]` |
| Reindex | `/qmd reindex` |
| Status | `/qmd status` |

**Next:** Try `/qmd query your first search`
```

---

## OBSIDIAN SETUP Flow

Interactive setup for Obsidian vaults.

### Step 1: Find Vault Location

```bash
# Common Obsidian vault locations
ls -d ~/Obsidian\ Vaults/*/ 2>/dev/null
ls -d ~/Documents/Obsidian/*/ 2>/dev/null
ls -d ~/Documents/*.md 2>/dev/null
ls -d ~/vaults/*/ 2>/dev/null
```

If not found, ask the user for the path.

### Step 2: Add Vault as Collection

```bash
# Replace with actual vault path
qmd collection add "[VAULT_PATH]" --name vault --mask "**/*.md"
```

### Step 3: Add Context Hierarchy

Context helps Claude understand what it's searching. Ask the user about their vault structure, then add context:

```bash
# Top-level context
qmd context add qmd://vault "Personal knowledge base - Obsidian vault"

# Add context for key folders (adapt to user's actual structure)
qmd context add qmd://vault/projects "Active project notes, specs, and planning"
qmd context add qmd://vault/meetings "Meeting notes, decisions, and action items"
qmd context add qmd://vault/references "Reference material, research, bookmarks"
qmd context add qmd://vault/daily "Daily notes and journal entries"
qmd context add qmd://vault/templates "Note templates - skip for search"
```

**Important:** Ask the user what their main folders are. Don't assume the structure above — adapt to their actual vault layout.

### Step 4: Exclude Folders (Optional)

If the user has folders they don't want indexed (templates, attachments, trash):

```bash
# Add exclusion masks if needed
qmd collection update vault --mask "**/*.md" --exclude "**/templates/**" --exclude "**/.trash/**"
```

### Step 5: Generate Embeddings

```bash
qmd embed
```

### Step 6: Test It

```bash
# Keyword search
qmd search "project planning" --limit 5

# Semantic search (finds related concepts)
qmd vsearch "how to structure authentication" --limit 5

# Deep search (hybrid + reranking - most accurate)
qmd query "architecture decisions for the API" --limit 5
```

### Output

```
## Obsidian Vault Connected

**Vault:** [path]
**Documents indexed:** [N] markdown files
**Embeddings:** Generated

**Context added for:**
- [folder1]: [description]
- [folder2]: [description]

**Quick test:**
- `/qmd search meeting notes about [topic]`
- `/qmd query architecture decisions`

**Tip:** Run `/qmd reindex` after adding new notes, or set up a cron job:
```bash
# Reindex every hour
0 * * * * qmd embed --quiet
```
```

---

## ADD COLLECTION Flow

```bash
# Ask user for path and name
qmd collection add "[PATH]" --name [name] --mask "**/*.md"

# Add context
qmd context add qmd://[name] "[description of this collection]"

# Generate embeddings for new content
qmd embed
```

---

## SEARCH Flow

Quick keyword search (BM25):

```bash
qmd search "[USER_QUERY]" --limit 10
```

Present results to the user in a readable format. If results aren't relevant, suggest:
- `/qmd query [same query]` for hybrid + reranking (more accurate)
- Adding more context to collections
- Checking that embeddings are up to date

---

## DEEP SEARCH Flow (query)

Hybrid search with AI reranking — the most accurate mode:

```bash
qmd query "[USER_QUERY]" --limit 10 --min-score 0.3
```

This combines:
1. BM25 keyword matching
2. Vector semantic similarity
3. LLM reranking for relevance

Present the results with scores and context. Offer to fetch full documents:

```bash
# Get full document content
qmd get [doc_path]
```

---

## STATUS Flow

```bash
qmd status
```

Show the user:
- Number of collections
- Number of indexed documents
- Embedding status
- Model info

---

## REINDEX Flow

```bash
# Regenerate all embeddings (picks up new/changed files)
qmd embed
```

If the user wants a full rebuild:

```bash
# Full reindex from scratch
qmd embed --force
```

---

## MCP SETUP Flow

Set up QMD as an MCP server so Claude can search your knowledge base directly during any session.

### Option 1: Plugin (Recommended)

```bash
claude plugin marketplace add tobi/qmd
claude plugin install qmd@qmd
```

### Option 2: Manual MCP Config

Add to `.mcp.json` or `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

### Option 3: Project-Level MCP

Add to project's `.mcp.json` to share with team:

```bash
# Check if .mcp.json exists
cat .mcp.json 2>/dev/null || echo "{}" > .mcp.json
```

Then add the qmd server entry.

### Verify MCP

After restart, Claude should have access to:
- `qmd_search` — Keyword search
- `qmd_deep_search` — Hybrid + reranking
- `qmd_get` — Retrieve full documents
- `qmd_status` — Check index status

---

## Tips

### Keep Index Fresh

```bash
# Manual reindex
qmd embed

# Or set up a cron/scheduled task
# Linux/macOS:
crontab -e
# Add: 0 * * * * qmd embed --quiet

# Windows (Task Scheduler):
# Run qmd embed on schedule
```

### Multiple Vaults / Collections

```bash
qmd collection add "~/Obsidian Vaults/Work" --name work --mask "**/*.md"
qmd collection add "~/Obsidian Vaults/Personal" --name personal --mask "**/*.md"
qmd collection add "~/Documents/meeting-notes" --name meetings --mask "**/*.md"

qmd context add qmd://work "Work knowledge base - projects, specs, decisions"
qmd context add qmd://personal "Personal notes, learning, ideas"
qmd context add qmd://meetings "Meeting transcripts and notes"

qmd embed
```

### Search Modes Comparison

| Mode | Command | Speed | Accuracy | Best For |
|------|---------|-------|----------|----------|
| Keyword | `qmd search` | Fast | Good for exact terms | Finding specific notes |
| Semantic | `qmd vsearch` | Medium | Good for concepts | "How to..." questions |
| Hybrid | `qmd query` | Slower | Best overall | Complex research queries |

### Output Formats

```bash
qmd query "auth" --json          # JSON (for scripts)
qmd query "auth" --xml           # XML (for LLMs)
qmd query "auth" --csv           # CSV (for spreadsheets)
qmd query "auth" --markdown      # Markdown (default)
```

### GSD Integration

QMD pairs well with GSD's research phase. During `/gsd:discuss` or `/gsd:plan`, Claude can search your knowledge base for relevant past decisions, architecture notes, and meeting context.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "command not found" | `npm install -g @tobilu/qmd` |
| Models not downloading | Check disk space (~1.7GB needed), check network |
| Node.js version error | Needs Node.js 22+: `node --version` |
| No search results | Run `qmd embed` to generate embeddings |
| Stale results | Run `qmd embed` to pick up new files |
| MCP not loading | Restart Claude Code after configuring |
| Slow first search | Normal — models load on first query |

## STACK Flow

Show the user the full self-hosted Obsidian + AI stack guide:

```bash
# Read and present the guide
cat docs/obsidian-ai-setup.md
```

The guide covers:
- **Obsidian in Docker** (LinuxServer.io image) — browser access from anywhere
- **CouchDB** — real-time LiveSync across all devices (desktop, mobile, NAS)
- **Caddy** — reverse proxy with automatic HTTPS
- **QMD** — AI search engine indexing the vault
- **Tailscale** — secure encrypted network between devices
- **E2E encryption** — data encrypted before leaving your device
- **Auto-reindex** — cron or Docker sidecar keeps QMD fresh
- **Backups** — daily automated backups

Walk the user through the guide step by step. Adapt to their infrastructure (domain vs Tailscale, NAS type, etc.).

---

## References

- [QMD GitHub](https://github.com/tobi/qmd)
- [QMD npm](https://www.npmjs.com/package/@tobilu/qmd)
- [Obsidian + AI Setup Guide](docs/obsidian-ai-setup.md)
- [Obsidian LiveSync](https://github.com/vrtmrz/obsidian-livesync)
- [LinuxServer Obsidian Docker](https://docs.linuxserver.io/images/docker-obsidian/)

**Execute the appropriate flow based on user arguments. If no arguments, run the full SETUP flow interactively.**
