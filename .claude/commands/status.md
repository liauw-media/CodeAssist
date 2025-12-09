# Agent Status

Check current agent workflow status and what's needed before commit.

## Check Status

Read the agent state and report workflow compliance.

### Protocol

1. Read `.claude/agent-state.json`
2. Analyze workflow completion
3. Report what's done and what's needed

### Output Format

```
## Agent Workflow Status

### Current State
| Checkpoint | Status | Timestamp |
|------------|--------|-----------|
| Last Code Change | [agent] | [time] |
| Tests Run | [pass/fail/not run] | [time] |
| Code Review | [done/needed] | [time] |
| DB Backup | [taken/not needed] | [time] |

### Workflow Compliance

✓ / ✗ Code changed → Tests run
✓ / ✗ Tests passed
✓ / ✗ Review after changes
✓ / ✗ DB backup (if needed)

### Commit Status
[READY TO COMMIT] or [BLOCKED - reasons]

### Next Steps
[What needs to be done, if anything]
```

### Execution

Read the state file at `.claude/agent-state.json` and provide the status report.

If file doesn't exist, report:
```
No agent state found. This is either:
1. A fresh project (run any agent to initialize)
2. State was reset

Run `/[agent] [task]` to begin tracking.
```
