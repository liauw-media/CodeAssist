# CodeAssist Multi-Agent System

**Version**: 3.2.0
**Status**: Production-Ready
**Total Agents**: 16 Specialized Agents

---

## Overview

The CodeAssist Multi-Agent System provides specialized AI agents for different development tasks. Each agent is optimized for specific domains and integrates with Claude Code's Task tool.

### Key Benefits

- **Specialization**: Domain-specific expertise (Laravel, React, Python, etc.)
- **Parallel Execution**: Run multiple agents simultaneously
- **Skills Integration**: Each agent uses relevant CodeAssist skills
- **Orchestration**: Agents can delegate to other agents

### How Agents + Skills Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENTS + SKILLS SYNERGY                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SKILLS = The "HOW" (protocols, checklists, workflows)      │
│  AGENTS = The "WHO" (specialized workers that USE skills)   │
│                                                             │
│  Example: laravel-developer agent                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Uses these skills automatically:                     │   │
│  │  • database-backup      (MANDATORY before DB ops)    │   │
│  │  • test-driven-development (tests first)             │   │
│  │  • code-review          (self-review before done)    │   │
│  │  • executing-plans      (systematic implementation)  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Result: Agent provides EXPERTISE + Skills provide RIGOR    │
└─────────────────────────────────────────────────────────────┘
```

**They are COMPLEMENTARY, not competing!**

---

## Agent Categories

### Core Workflow Agents (3)
| Agent | File | Purpose |
|-------|------|---------|
| `orchestrator` | [orchestrator.md](orchestrator.md) | Coordinate multi-agent workflows |
| `plan-executor` | [plan-executor.md](plan-executor.md) | Execute implementation plans systematically |
| `code-reviewer` | [code-reviewer.md](code-reviewer.md) | Thorough code review with skill compliance |

### Research & Analysis Agents (4)
| Agent | File | Purpose |
|-------|------|---------|
| `researcher` | [researcher.md](researcher.md) | Web research, documentation lookup, API exploration |
| `codebase-explorer` | [codebase-explorer.md](codebase-explorer.md) | Deep codebase analysis, architecture discovery |
| `data-analyst` | [data-analyst.md](data-analyst.md) | Data analysis, visualization, insights |
| `security-auditor` | [security-auditor.md](security-auditor.md) | Security scanning, OWASP compliance |

### Development Agents (6)
| Agent | File | Purpose |
|-------|------|---------|
| `laravel-developer` | [laravel-developer.md](laravel-developer.md) | **Laravel ecosystem specialist** (Eloquent, Sanctum, Livewire, etc.) |
| `php-developer` | [php-developer.md](php-developer.md) | General PHP, Symfony, WordPress |
| `react-developer` | [react-developer.md](react-developer.md) | React, Next.js, component architecture |
| `python-developer` | [python-developer.md](python-developer.md) | Django, FastAPI, data science, automation |
| `database-specialist` | [database-specialist.md](database-specialist.md) | SQL optimization, migrations, schema design |
| `web-scraper` | [web-scraper.md](web-scraper.md) | Web scraping, data extraction, automation |

### Quality & Documentation Agents (3)
| Agent | File | Purpose |
|-------|------|---------|
| `testing-agent` | [testing-agent.md](testing-agent.md) | Test writing, TDD, coverage improvement |
| `documentation-agent` | [documentation-agent.md](documentation-agent.md) | Generate docs, README, API documentation |
| `refactoring-agent` | [refactoring-agent.md](refactoring-agent.md) | Code smell detection, refactoring |

---

## How to Use Agents

### Via Claude Code Task Tool

```markdown
I'm deploying the {agent-name} agent for this task.

[Uses Task tool with appropriate subagent_type]
```

#### All Slash Commands (17)

| Category | Command | Description |
|----------|---------|-------------|
| **Help** | `/guide [question]` | Interactive guidance, what to do next |
| | `/mentor [subject]` | Ruthless critical analysis (no sugarcoating) |
| | `/feedback [topic]` | Submit feedback/issues to GitHub |
| | `/status` | Check workflow compliance status |
| | `/agent-select [task]` | Get agent recommendation |
| **Dev** | `/laravel [task]` | Laravel ecosystem specialist |
| | `/react [task]` | React/Next.js development |
| | `/python [task]` | Python/Django/FastAPI |
| | `/db [task]` | Database operations |
| **Quality** | `/test [task]` | Test writing (TDD) |
| | `/review [task]` | Code review (MANDATORY) |
| | `/security [task]` | Security audit (OWASP) |
| | `/refactor [task]` | Code refactoring |
| **Research** | `/explore [task]` | Codebase exploration |
| | `/research [task]` | Web research |
| | `/docs [task]` | Documentation generation |
| **Coord** | `/orchestrate [task]` | Multi-agent workflows |

### Agent Selection Guide

```
User Request                          → Command
─────────────────────────────────────────────────────────
"I'm lost, what do I do?"             → /guide
"Is my code any good?"                → /mentor [code/file]
"Tear apart my architecture"          → /mentor this project
"Found a bug in CodeAssist"           → /feedback [description]
"Research how X works"                → /research [topic]
"Explore the codebase"                → /explore [area]
"Analyze this data"                   → data-analyst agent
"Check for security issues"           → /security [scope]
"Build Laravel feature"               → /laravel [task] ⭐
"Build Laravel API"                   → /laravel [task] ⭐
"Create Eloquent model"               → /laravel [task] ⭐
"Build PHP feature"                   → /php [task]
"Create React component"              → /react [task]
"Build Next.js page"                  → /react [task]
"Write Python script"                 → /python [task]
"Build FastAPI endpoint"              → /python [task]
"Optimize database"                   → /db [task]
"Fix slow queries"                    → /db [task]
"Write tests for this"                → /test [task]
"Improve test coverage"               → /test [task]
"Document this code"                  → /docs [task]
"Refactor this module"                → /refactor [task]
"Review this code"                    → /review [task]
"Complex multi-step task"             → /orchestrate [task]
```

---

## Parallel Agent Execution

For complex tasks, deploy multiple agents in parallel:

```markdown
Deploying agents in parallel:
1. researcher → Find best practices for feature X
2. codebase-explorer → Find existing patterns in codebase
3. php-developer → Implement the feature

[All three Task tool calls in single message]
```

---

## Agent Configuration

Each agent definition includes:

```markdown
# Agent Name

## Purpose
What this agent specializes in

## When to Deploy
Triggers and scenarios

## Agent Configuration
- Subagent Type: general-purpose | Explore | Plan
- Skills Required: List of CodeAssist skills
- Authority: Read/Write permissions

## Agent Task Prompt Template
The actual prompt to send to the Task tool

## Integration with Skills
Which skills this agent uses

## Success Criteria
When the agent completes successfully
```

---

## Orchestration Patterns

### Sequential Execution
```
researcher → php-developer → testing-agent → code-reviewer
```

### Parallel Research + Development
```
┌─ researcher ─────────┐
│                      ├─→ php-developer → code-reviewer
└─ codebase-explorer ──┘
```

### Full Feature Pipeline
```
researcher
    ↓
codebase-explorer
    ↓
[php|react|python]-developer
    ↓
testing-agent
    ↓
documentation-agent
    ↓
code-reviewer
    ↓
orchestrator (final verification)
```

---

## Installation

```bash
# Install all agents to your project
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-agents.sh | bash

# Or manually copy agents/ directory
cp -r agents/ .claude/agents/
```

---

## Agent Development Guidelines

When creating new agents:

1. **Follow the template** - Use existing agents as examples
2. **Integrate skills** - Reference appropriate CodeAssist skills
3. **Define triggers** - Clear "When to Deploy" criteria
4. **Set authority** - Explicit read/write permissions
5. **Success criteria** - How to know agent completed successfully

---

## Version History

- **v3.2.0** (2025-11-30): 15 specialized agents with orchestration
- **v3.1.4**: Initial agents (code-reviewer, plan-executor)
