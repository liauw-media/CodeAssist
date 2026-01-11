# Memory Setup

Set up persistent memory across Claude Code sessions using claude-mem.

## Task
$ARGUMENTS

## Memory Setup Protocol

You are setting up **claude-mem** - a persistent memory system for Claude Code.

### Pre-Flight

1. **Read the skill**: Read `skills/ai/persistent-memory/SKILL.md`

### What is claude-mem?

claude-mem automatically captures everything during coding sessions and makes it available in future sessions:

| Feature | Description |
|---------|-------------|
| **Auto-capture** | Hooks into session lifecycle |
| **Vector search** | Semantic + keyword search |
| **Web UI** | Browse memory at localhost:37777 |
| **Privacy tags** | Exclude sensitive content |
| **Token-aware** | Shows context injection costs |

### Installation Steps

#### Step 1: Install Plugin

```bash
/plugin marketplace add thedotmack/claude-mem
```

Then:

```bash
/plugin install claude-mem
```

#### Step 2: Restart Claude Code

Exit and restart Claude Code for the plugin to initialize.

#### Step 3: Verify Installation

After restart, check:

```bash
# Web UI should be accessible
# Open in browser: http://localhost:37777
```

### Configuration

#### Privacy Tags

Use `<private>` tags to exclude sensitive content from memory:

```markdown
Database credentials:
<private>
DB_PASSWORD=secret123
API_KEY=sk-xxx
</private>

The database uses PostgreSQL...
```

#### Memory Service

The service runs automatically on port 37777. To check status:

```bash
curl http://localhost:37777/health
```

### Using Memory

After installation, memory works automatically:

| Action | What Happens |
|--------|--------------|
| **Session start** | Relevant context loaded |
| **During work** | Observations captured |
| **Session end** | Summary generated |
| **Next session** | Context available |

### Querying Memory

Memory can be searched:

```
# Good queries (specific)
"How did we implement the auth system?"
"What was our decision on the database schema?"

# Check past work
"What did we accomplish in the last session?"
```

### Output Format

```
## Memory Setup Complete

### Installation Status
- [ ] Plugin installed from marketplace
- [ ] Plugin activated
- [ ] Claude Code restarted
- [ ] Web UI accessible at localhost:37777

### Configuration
- Privacy tags: Configured
- Auto-capture: Enabled
- Vector search: Ready

### Quick Reference

**View memory:**
http://localhost:37777

**Privacy tags:**
\`\`\`
<private>sensitive content here</private>
\`\`\`

**Search memory:**
Ask Claude about past sessions/decisions

### Next Steps
1. Restart Claude Code if not done
2. Check web UI at localhost:37777
3. Start working - memory captures automatically
4. Use <private> tags for sensitive content
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin not found | Run `/plugin marketplace add thedotmack/claude-mem` |
| Web UI not loading | Restart Claude Code |
| Memory not capturing | Verify plugin is installed with `/plugin list` |
| Port 37777 in use | Check for conflicting services |

### Uninstalling

If you need to remove:

```bash
/plugin uninstall claude-mem
```

Execute the memory setup now.
