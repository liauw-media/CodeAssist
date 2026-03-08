# Consolidate Sessions

Actively consolidate unconsolidated sessions — find patterns, connections, and generate cross-cutting insights. Inspired by the always-on-memory-agent pattern of active memory consolidation.

## Usage

```
/consolidate [--dry-run]
```

**Examples:**
- `/consolidate` - Consolidate all unconsolidated sessions
- `/consolidate --dry-run` - Preview which sessions would be consolidated

## Execute

### Step 1: Check Unconsolidated Sessions

```bash
python3 scripts/session-db.py consolidate --dry-run
```

If fewer than 2 unconsolidated sessions exist:
```
Not enough sessions to consolidate. Save more sessions with /save-session first.
```

If `$ARGUMENTS` contains `--dry-run`, show the preview and stop.

### Step 2: Load Sessions for Analysis

```bash
python3 scripts/session-db.py consolidate
```

This returns JSON with all unconsolidated sessions.

### Step 3: Analyze and Consolidate

Read all the sessions and perform active consolidation:

1. **Find patterns** — What themes repeat across sessions? What files keep getting modified?
2. **Identify connections** — Which sessions are related? What's the relationship?
3. **Extract insights** — What overarching conclusions can you draw from the combined context?
4. **Generate summary** — A synthesized summary of the consolidated knowledge

Think about:
- What was the user trying to achieve across these sessions?
- What recurring challenges appeared?
- What architectural patterns or decisions evolved?
- What areas of the codebase got the most attention?
- What knowledge from earlier sessions would help with later ones?

### Step 4: Save Consolidation

```bash
python3 scripts/session-db.py consolidate-save \
  --source-ids '[{comma-separated session IDs}]' \
  --summary "{synthesized summary of all sessions}" \
  --insight "{the single most important takeaway}" \
  --connections '[{"from": id1, "to": id2, "relationship": "description"}]'
```

### Step 5: Display Results

```
## Consolidation Complete

**Sessions consolidated:** {N}
**Consolidation ID:** {id}

### Summary
{synthesized summary across all sessions}

### Key Insight
{the single most important takeaway}

### Connections Found
| From | To | Relationship |
|------|-----|-------------|
| {session A} | {session B} | {how they relate} |

### Patterns Detected
- {recurring theme 1}
- {recurring theme 2}

### Recommendations
Based on consolidation:
- {actionable recommendation 1}
- {actionable recommendation 2}

---

**Next consolidation:** Save more sessions with `/save-session`, then run `/consolidate` again.
**View all sessions:** `/session-list --stats`
```

## When to Consolidate

- After completing a feature branch (consolidate all sessions from that branch)
- At the end of a work day
- Before starting a major new feature (consolidate past context)
- When switching between projects
- When `/session-list --stats` shows many unconsolidated sessions

## How It Works

Unlike passive storage (save and retrieve), consolidation actively re-processes your session history:

```
Save Session A (auth work)      → stored
Save Session B (auth tests)     → stored
Save Session C (API refactor)   → stored
                                    ↓
/consolidate                    → reads all three
                                → finds: A and B both touch auth
                                → finds: B tests depend on C's API changes
                                → insight: "Auth system is tightly coupled to API layer"
                                → connection: A↔B (same feature), B↔C (dependency)
                                → marks A, B, C as consolidated
```

Next time you `/resume-session`, the consolidation insights are included in the context.

Execute the consolidation now.
