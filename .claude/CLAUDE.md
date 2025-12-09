# CodeAssist Project Instructions

## Agent-First Development

This project uses the **CodeAssist Multi-Agent System**. Always consider deploying specialized agents for tasks.

### Quick Reference

```
HELP & GUIDANCE:
/guide [question]   - Interactive guidance, what to do next
/mentor [subject]   - Ruthless critical analysis (no sugarcoating)
/status             - Check workflow status
/agent-select [task]- Get agent recommendation

DEVELOPMENT:
/laravel [task]     - Laravel/PHP development
/react [task]       - React/Next.js development
/python [task]      - Python development
/db [task]          - Database operations

QUALITY (MANDATORY):
/test [task]        - Test writing
/review [task]      - Code review
/security [task]    - Security audit

RESEARCH & DOCS:
/explore [task]     - Codebase exploration
/research [task]    - Information research
/docs [task]        - Documentation
/refactor [task]    - Code refactoring

COORDINATION:
/orchestrate [task] - Complex multi-agent tasks
```

### Mandatory Workflow

```
1. EXPLORE/RESEARCH (if needed)
   └── /explore or /research

2. IMPLEMENT
   └── /laravel, /react, or /python

3. TEST (MANDATORY)
   └── /test

4. REVIEW (MANDATORY)
   └── /review

5. COMMIT (only after review)
```

### Enforcement

- Commits are BLOCKED without `/review` after code changes
- Commits are BLOCKED if tests haven't passed
- Database operations are BLOCKED without backup

### Agent State

Check workflow status anytime:
```
/status
```

---

## Skills Integration

Agents automatically use these skills:

| Agent | Required Skills |
|-------|-----------------|
| `/laravel` | database-backup, test-driven-development, code-review |
| `/react` | test-driven-development, frontend-design, brand-guidelines |
| `/python` | test-driven-development, database-backup |
| `/db` | database-backup (CRITICAL) |
| `/test` | test-driven-development, condition-based-waiting, testing-anti-patterns |
| `/review` | code-review, verification-before-completion |

---

## Critical Safety Rules

### Database Operations

```
⚠️ BEFORE ANY DATABASE OPERATION:
./scripts/backup-database.sh

⚠️ BEFORE ANY TEST:
./scripts/safe-test.sh [test command]
```

**Authority**: 2 production database wipes. Data is IRREPLACEABLE.

### No AI Co-Author

```
❌ NEVER add to commits:
Co-Authored-By: Claude
Co-Authored-By: AI
```

---

## When to Use Agents

| Situation | Agent |
|-----------|-------|
| "I need to build X" | `/laravel`, `/react`, or `/python` |
| "I need to understand X" | `/explore` or `/research` |
| "I need to test X" | `/test` |
| "I need to review X" | `/review` |
| "Is this secure?" | `/security` |
| "This code is messy" | `/refactor` |
| "I need docs for X" | `/docs` |
| "Complex feature with API + frontend" | `/orchestrate` |
| "Which agent should I use?" | `/agent-select [task]` |

---

## Reminders

Every 10 interactions, check:
- [ ] Am I using agents? (not raw implementation)
- [ ] Did I run `/test` after code changes?
- [ ] Did I run `/review` before committing?
- [ ] Is database backed up? (`/status` to check)

---

## Getting Help

| Situation | Command |
|-----------|---------|
| "What should I do next?" | `/guide` |
| "Which agent do I use?" | `/agent-select [task]` |
| "Is my code/idea good?" | `/mentor [subject]` |
| "What's my workflow status?" | `/status` |

### The Mentor

Use `/mentor` when you want brutal honesty:
- Analyze your code for weaknesses
- Stress-test your architecture
- Find holes in your plan
- Get a real score (not inflated praise)

**The mentor doesn't sugarcoat. If it's weak, you'll know why.**
