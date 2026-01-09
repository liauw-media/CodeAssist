# CodeAssist Guide

Interactive guidance for using CodeAssist.

## Context
$ARGUMENTS

## Guide Protocol

Help users understand what to do next based on their situation.

### Initial Questions

If context is unclear, ask:

1. **What are you trying to do?**
   - New feature?
   - Bug fix?
   - Refactoring?
   - Research?

2. **What's your tech stack?**
   - Laravel/PHP?
   - React/Next.js?
   - Python?

3. **Where are you in the process?**
   - Just starting?
   - Mid-implementation?
   - Ready to test?
   - Ready to commit?

### Command Reference

**Starting:**
```
/explore [area]      - Understand existing code
/research [topic]    - Research best practices
```

**Implementation:**
```
/laravel [task]      - Laravel/PHP development
/react [task]        - React/Next.js development
/python [task]       - Python development
/db [task]           - Database operations
```

**Quality:**
```
/test [scope]        - Write/run tests
/review [scope]      - Code review
/security [scope]    - Security audit
```

**Other:**
```
/status              - Check git status
/docs [scope]        - Generate documentation
/refactor [scope]    - Improve code quality
/mentor [subject]    - Get critical feedback
```

### Workflow Guidance

**Just Starting:**
1. `/explore` - Understand existing patterns
2. Then implement with `/laravel`, `/react`, or `/python`

**Mid-Implementation:**
1. `/test` - Write tests for your changes
2. `/review` - Review your code

**Ready to Commit:**
1. Check tests pass
2. Check review done
3. Then commit

### Output Format

```
## Guide

### Your Situation
[What you're trying to do]

### Recommended Steps

1. `/[command]` - [why]
2. `/[command]` - [why]

### Tips
- [Relevant advice]
```

Give actionable advice based on their situation.
