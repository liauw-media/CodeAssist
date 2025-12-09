# Agent Selection Guide

Analyze the user's request and recommend the optimal agent(s).

## User Request
$ARGUMENTS

## Selection Protocol

Analyze the request and match to agents:

### Keyword Matching

| Keywords | Agent | Command |
|----------|-------|---------|
| laravel, eloquent, artisan, sanctum, livewire, blade | laravel-developer | `/laravel` |
| php, symfony, wordpress, composer | php-developer | `/php` |
| react, next.js, component, hook, tsx, jsx | react-developer | `/react` |
| python, django, fastapi, flask, pytest | python-developer | `/python` |
| database, sql, query, migration, index, optimize | database-specialist | `/db` |
| test, coverage, tdd, jest, phpunit, pytest | testing-agent | `/test` |
| review, check, verify, approve | code-reviewer | `/review` |
| security, vulnerability, owasp, audit | security-auditor | `/security` |
| document, readme, api docs, jsdoc | documentation-agent | `/docs` |
| refactor, clean, smell, improve | refactoring-agent | `/refactor` |
| explore, understand, find, where, how | codebase-explorer | `/explore` |
| research, best practice, how to, compare | researcher | `/research` |
| complex, multiple, full feature, end-to-end | orchestrator | `/orchestrate` |

### Complexity Analysis

**Simple Task** (1 agent):
- Single domain
- Clear scope
- Example: "Add a logout button" → `/laravel` or `/react`

**Medium Task** (2-3 agents, sequential):
- Multiple steps
- One domain
- Example: "Add user profile with tests" → `/laravel` → `/test` → `/review`

**Complex Task** (3+ agents, orchestration needed):
- Multiple domains
- Cross-cutting concerns
- Example: "Build complete auth system" → `/orchestrate`

### Output Format

```
## Agent Recommendation

### Request Analysis
- Domain(s): [identified domains]
- Complexity: [Simple/Medium/Complex]
- Keywords matched: [keywords]

### Recommended Agent(s)

**Primary**: `/[command]` - [agent-name]
- Reason: [why this agent]

**Supporting** (if needed):
1. `/[command]` - [reason]
2. `/[command]` - [reason]

### Suggested Workflow

\`\`\`
[workflow diagram if multiple agents]
\`\`\`

### Ready Command

Copy and run:
\`\`\`
/[command] [task description]
\`\`\`

Or for complex tasks:
\`\`\`
/orchestrate [full task description]
\`\`\`
```

Analyze the request and provide recommendation now.
