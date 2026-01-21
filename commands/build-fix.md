# Build Fix

Diagnose and fix build/compilation errors.

## Error Context
$ARGUMENTS

## Agent Protocol

Deploy the **build-error-resolver** agent.

### Pre-Flight

1. **Read the agent**: `agents/build-error-resolver.md`
2. **Gather error info**: Full error message, stack trace, recent changes

### Execute

1. **Analyze** - Identify error type and location
2. **Diagnose** - Find root cause (not just symptoms)
3. **Fix** - Apply minimal change
4. **Verify** - Build passes, tests pass

### Output Format

```
## Build Fix: [Error Type]

### Error
**Message:** [error]
**Location:** [file:line]

### Root Cause
[Explanation]

### Fix Applied
[Description of change]

### Verification
- [x] Build passes
- [x] Tests pass
```

Execute the build-error-resolver agent now.
