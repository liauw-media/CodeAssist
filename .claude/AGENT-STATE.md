# Agent State Tracking

This file documents the agent state system that tracks workflow compliance.

## State File

Location: `.claude/agent-state.json`

### Schema

```json
{
  "last_review": "2024-01-15T10:30:00Z",
  "last_test": "2024-01-15T10:25:00Z",
  "last_code_change": "2024-01-15T10:20:00Z",
  "last_db_operation": "2024-01-15T10:15:00Z",
  "last_dev_agent": "laravel-developer",
  "tests_passed": true,
  "db_backup_taken": true,
  "workflow_complete": false
}
```

### State Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT STATE MACHINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   START                                                      │
│     │                                                        │
│     ▼                                                        │
│   /explore OR /research (optional)                           │
│     │                                                        │
│     ▼                                                        │
│   /laravel OR /react OR /python                              │
│     │ ─────► last_code_change = NOW                          │
│     │ ─────► tests_passed = false (reset)                    │
│     │                                                        │
│     ▼                                                        │
│   /test                                                      │
│     │ ─────► last_test = NOW                                 │
│     │ ─────► tests_passed = true/false                       │
│     │                                                        │
│     ▼                                                        │
│   /review                                                    │
│     │ ─────► last_review = NOW                               │
│     │                                                        │
│     ▼                                                        │
│   COMMIT ALLOWED (if last_review > last_code_change          │
│                   AND tests_passed = true)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Enforcement Rules

| Action | Requirement | Blocked If |
|--------|-------------|------------|
| `git commit` | Review after code change | `last_review < last_code_change` |
| `git commit` | Tests must pass | `tests_passed = false` |
| `git commit` (with DB changes) | Backup taken | `db_backup_taken = false` |

### Manual State Update

If needed, manually update state:

```bash
# Mark review complete
./hooks/post-agent-run.sh code-reviewer success

# Mark tests passed
./hooks/post-agent-run.sh testing-agent success

# Mark backup taken
./hooks/post-agent-run.sh database-specialist success
```

### Reset State

```bash
# Full reset
echo '{}' > .claude/agent-state.json

# Or delete
rm .claude/agent-state.json
```

## Integration with Pre-Commit

The `hooks/pre-commit-agent-check.sh` script reads this state file and blocks commits if workflow wasn't followed.

Install to git:
```bash
cp hooks/pre-commit-agent-check.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```
