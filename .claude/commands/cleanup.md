# Code Cleanup

Remove dead code, unused imports, and orphaned files.

## Scope
$ARGUMENTS

## Agent Protocol

Deploy the **refactor-cleaner** agent.

### Pre-Flight

1. **Read the agent**: `agents/refactor-cleaner.md`
2. **Run tests**: Ensure passing before cleanup
3. **Identify scope**: Specific files or whole codebase

### Execute

1. **Scan** - Find unused imports, dead code, commented code
2. **Verify** - Ensure safe to remove (no dynamic refs)
3. **Remove** - One category at a time
4. **Test** - After each removal

### Safety First

```
⚠️ NEVER remove without checking:
- Dynamic/reflection references
- External package exports
- Test utilities
- Environment-specific config
```

### Output Format

```
## Cleanup Report

### Removed
| Category | Count |
|----------|-------|
| Unused imports | X |
| Dead functions | X |
| Commented code | X |

### Skipped (Needs Review)
[Items that might be dynamically used]

### Verification
- [x] Tests pass
- [x] Build succeeds
```

Execute the refactor-cleaner agent now.
