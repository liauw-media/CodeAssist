# Delegate a Full Project to OpenClaw

Use OpenClaw as your autonomous project manager. Send it a project idea via chat (WhatsApp, Telegram, Discord) and let it orchestrate the full lifecycle — from requirements to shipped code — using Claude Code as the coding agent.

## Architecture

```
You (chat message)
  │
  │  "Build me a REST API for inventory management"
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     OpenClaw Gateway                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Orchestrator Agent                          │    │
│  │  Breaks project into phases and tasks                    │    │
│  │  Manages state via STATE.yaml                            │    │
│  │  Runs Lobster workflows for deterministic flow           │    │
│  └────────┬────────────────────┬───────────────────┬───────┘    │
│           │                    │                   │             │
│     ┌─────▼──────┐   ┌────────▼────────┐  ┌──────▼────────┐   │
│     │  Architect  │   │   Programmer    │  │   Reviewer    │   │
│     │   Agent     │   │     Agent       │  │    Agent      │   │
│     │             │   │                 │  │               │   │
│     │ Plans arch, │   │ Spawns Claude   │  │ Reviews code  │   │
│     │ picks stack │   │ Code via ACP    │  │ via read-only │   │
│     └─────────────┘   │                 │  │ Claude Code   │   │
│                       │  ┌───────────┐  │  └───────────────┘   │
│                       │  │Claude Code│  │                       │
│                       │  │  (ACP)    │  │  ┌───────────────┐   │
│                       │  │ Writes    │  │  │   Tester      │   │
│                       │  │ code,     │  │  │    Agent      │   │
│                       │  │ runs      │  │  │               │   │
│                       │  │ tests     │  │  │ Runs tests,   │   │
│                       │  └───────────┘  │  │ validates     │   │
│                       └─────────────────┘  └───────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Shared State: STATE.yaml, PROJECT.md, REQUIREMENTS.md  │    │
│  │  QMD: Search past decisions from Obsidian vault          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## How It Works

1. **You send a message** to OpenClaw via chat: "Build an inventory API with auth"
2. **Orchestrator agent** breaks it into phases (architect → code → review → test → deploy)
3. **Architect agent** plans the stack, creates requirements, designs the schema
4. **Programmer agent** spawns Claude Code via ACP to write the actual code
5. **Reviewer agent** reviews with a read-only Claude Code session
6. **Loop**: if review fails, programmer fixes → re-review (max 3 iterations)
7. **Tester agent** runs the test suite
8. **You get notified** via chat when it's done (or if it needs a decision)

The key principle from the community: **"Don't orchestrate with LLMs. LLMs are unreliable routers. Use them for creative work, use code for plumbing."** — Lobster handles the deterministic flow, LLMs handle the creative coding.

## Prerequisites

- OpenClaw running (gateway + at least one chat adapter)
- Claude Code installed and accessible on the same machine
- ACP plugin enabled
- CodeAssist skills available to Claude Code

## Step 1: Configure ACP for Claude Code

In your OpenClaw config (`~/.openclaw/openclaw.json`):

```json
{
  "acp": {
    "enabled": true,
    "backend": "acpx",
    "allowedAgents": ["claude", "pi"],
    "defaults": {
      "permissionMode": "approve-reads",
      "timeout": 600000,
      "maxTurns": 100
    }
  }
}
```

## Step 2: Create the Agent Roles

### Orchestrator Agent

Create `~/.openclaw/agents/project-orchestrator/AGENT.md`:

```markdown
---
name: project-orchestrator
description: "Orchestrates full project lifecycle from idea to shipped code"
---

# Project Orchestrator

You are a project orchestrator. When given a project idea, you:

1. **Decompose** the idea into concrete requirements
2. **Plan** the architecture and tech stack
3. **Delegate** coding to the programmer agent (which uses Claude Code)
4. **Coordinate** review and testing cycles
5. **Report** progress back to the user

## Workflow

For each project:

1. Create PROJECT.md with vision and scope
2. Create REQUIREMENTS.md with acceptance criteria
3. Create ROADMAP.md with phases
4. Delegate each phase to the appropriate agent
5. Track state in STATE.yaml

## State Management

Maintain STATE.yaml in the project directory:

```yaml
project: project-name
status: in_progress
current_phase: coding
phases:
  architect:
    status: completed
    output: "docs/architecture.md"
  coding:
    status: in_progress
    current_task: "implement auth endpoints"
    iterations: 1
  review:
    status: pending
  testing:
    status: pending
decisions: []
blockers: []
```

## Delegation Rules

- Architecture decisions → architect agent
- Code writing → programmer agent (uses Claude Code via ACP)
- Code review → reviewer agent (read-only Claude Code)
- Testing → tester agent
- Decisions requiring human input → notify user via chat

## When Stuck

If a task fails 3 times or requires human decisions:
1. Update STATE.yaml with the blocker
2. Notify the user with context and options
3. Wait for user response before continuing
```

### Programmer Agent

Create `~/.openclaw/agents/programmer/AGENT.md`:

```markdown
---
name: programmer
description: "Writes code using Claude Code via ACP"
tools:
  - agent-send
  - acp
  - file-read
  - file-write
---

# Programmer Agent

You write code by delegating to Claude Code via ACP.

## Process

1. Read the current task from STATE.yaml
2. Read requirements from REQUIREMENTS.md
3. Spawn a Claude Code ACP session in the project directory
4. Give Claude Code clear instructions with:
   - What to build (from requirements)
   - Architecture constraints (from architect output)
   - CodeAssist skills to use (e.g., /tdd, /laravel, /react)
5. Monitor progress
6. Report completion back to orchestrator

## Claude Code Instructions Template

When spawning Claude Code, always include:

```
You are working on: [project-name]
Task: [specific task from STATE.yaml]
Requirements: [from REQUIREMENTS.md]
Architecture: [from architecture.md]

Use CodeAssist skills:
- /tdd for test-driven development
- Follow the project's coding style
- Commit atomically per feature

When done, update STATE.yaml current_task status to "completed".
```

## Tool Permissions

Claude Code runs with `approve-reads` permission — it can read freely but will
need approval for writes. For trusted projects, use `approve-all`.
```

### Reviewer Agent

Create `~/.openclaw/agents/reviewer/AGENT.md`:

```markdown
---
name: reviewer
description: "Reviews code using read-only Claude Code"
tools:
  - agent-send
  - acp
  - file-read
---

# Reviewer Agent

You review code by spawning a read-only Claude Code session.

## Process

1. Read what was implemented from STATE.yaml
2. Spawn Claude Code with read-only permissions
3. Ask it to review the code for:
   - Correctness (does it meet requirements?)
   - Security (OWASP top 10, input validation)
   - Code quality (naming, structure, complexity)
   - Test coverage (>80%)
4. Return structured review:

```json
{
  "approved": true/false,
  "score": 0-100,
  "issues": [
    {"severity": "high", "file": "path", "description": "..."}
  ],
  "suggestions": ["..."]
}
```

5. If not approved, send issues back to programmer agent
```

### Tester Agent

Create `~/.openclaw/agents/tester/AGENT.md`:

```markdown
---
name: tester
description: "Runs test suites and validates builds"
tools:
  - agent-send
  - acp
  - shell
---

# Tester Agent

You run tests using Claude Code or direct shell commands.

## Process

1. Read project type from architecture docs
2. Run the appropriate test suite:
   - Laravel: `./scripts/safe-test.sh` (CodeAssist)
   - Node.js: `npm test`
   - Python: `pytest`
3. Check coverage meets threshold (>80%)
4. Return structured result:

```json
{
  "passed": true/false,
  "tests_run": 42,
  "tests_passed": 40,
  "tests_failed": 2,
  "coverage": 85,
  "failures": [...]
}
```
```

## Step 3: Create the Lobster Pipeline

Create `~/.openclaw/workflows/project-pipeline.lobster`:

```yaml
name: project-pipeline
args:
  idea:
    description: "The project idea or description"
  workdir:
    default: "/tmp/projects"
  max_review_iterations:
    default: "3"

steps:
  # Phase 1: Architecture
  - id: architect
    command: >
      agent-send project-orchestrator
      "Analyze this project idea and create PROJECT.md, REQUIREMENTS.md, and architecture.md:
      ${{ args.idea }}
      Working directory: ${{ args.workdir }}"

  # Phase 2: Code (via Claude Code ACP)
  - id: code
    command: >
      acp spawn claude
      --mode session
      --workdir ${{ args.workdir }}
      --task "Read REQUIREMENTS.md and architecture.md, then implement the project.
      Use /tdd for test-driven development.
      Commit atomically per feature.
      When done, output JSON: {\"completed\": true, \"files_changed\": N}"

  # Phase 3: Review Loop (max 3 iterations)
  - id: review-loop
    lobster: ./review-cycle.lobster
    loop:
      maxIterations: ${{ args.max_review_iterations }}
      condition: '! echo "$LOBSTER_LOOP_JSON" | jq -e ".approved"'

  # Phase 4: Test
  - id: test
    command: >
      acp spawn claude
      --mode run
      --workdir ${{ args.workdir }}
      --task "Run the test suite. Use ./scripts/safe-test.sh if available, otherwise detect the framework and run tests. Output JSON: {\"passed\": bool, \"coverage\": N}"

  # Phase 5: Notify
  - id: notify
    command: >
      agent-send project-orchestrator
      "Project complete. Review: ${{ steps.review-loop.json }}, Tests: ${{ steps.test.json }}.
      Summarize results for the user."
```

Create `~/.openclaw/workflows/review-cycle.lobster`:

```yaml
name: review-cycle
steps:
  - id: review
    command: >
      acp spawn claude
      --mode run
      --workdir ${{ env.LOBSTER_WORKDIR }}
      --permissions deny-all
      --task "Review all code in this project. Check: correctness, security (OWASP), code quality, test coverage (>80%). Output JSON: {\"approved\": bool, \"score\": N, \"issues\": [...]}"

  - id: fix
    condition: '! echo "${{ steps.review.json }}" | jq -e ".approved"'
    command: >
      acp spawn claude
      --mode run
      --workdir ${{ env.LOBSTER_WORKDIR }}
      --task "Fix these review issues: ${{ steps.review.json }}. Commit fixes atomically."
```

## Step 4: Install CodeAssist Skills for Claude Code

Make sure Claude Code has CodeAssist skills available when OpenClaw spawns it:

```bash
# Global install (available to all ACP sessions)
cp -r /path/to/CodeAssist/skills/ ~/.claude/skills/
cp -r /path/to/CodeAssist/rules/ ~/.claude/rules/
```

Or in the ACP spawn, reference the CodeAssist directory:

```bash
acp spawn claude --workdir /project --add-dir /path/to/CodeAssist/.claude
```

## Step 5: Give Claude Code Access to Your Knowledge Base

If QMD is set up with your Obsidian vault, Claude Code sessions spawned by OpenClaw can search your knowledge base:

```json
// In ~/.claude/settings.json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

This means when Claude Code is working on your project, it can pull context from your past architecture decisions, meeting notes, and research.

## Step 6: Trigger a Project

### Via Chat (WhatsApp/Telegram/Discord)

Just send a message to your OpenClaw bot:

```
Build me a REST API for inventory management with:
- JWT authentication
- CRUD for products, categories, warehouses
- Stock level tracking with low-stock alerts
- PostgreSQL database
- Laravel 11
- 90% test coverage
```

OpenClaw's orchestrator picks it up and runs the full pipeline.

### Via CLI

```bash
# Direct Lobster invocation
lobster run project-pipeline \
  --arg idea="REST API for inventory management with JWT auth, CRUD, PostgreSQL, Laravel 11" \
  --arg workdir="/home/dev/projects/inventory-api"
```

### Via OpenClaw API

```bash
curl -X POST http://localhost:18789/api/v1/chat \
  -H "Authorization: Bearer $GATEWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Build me a REST API for inventory management with JWT auth, CRUD for products/categories/warehouses, stock tracking, PostgreSQL, Laravel 11, 90% test coverage",
    "agent": "project-orchestrator"
  }'
```

## How the Full Flow Looks

```
You: "Build me an inventory API with auth, Laravel, PostgreSQL"
  │
  ▼
Orchestrator: Creates PROJECT.md, REQUIREMENTS.md, ROADMAP.md
  │
  ▼
Architect Agent: Designs schema, picks packages, writes architecture.md
  │
  ▼
Programmer Agent: Spawns Claude Code via ACP
  │  Claude Code reads requirements + architecture
  │  Uses /tdd → writes tests first
  │  Implements endpoints one by one
  │  Commits atomically per feature
  │
  ▼
Reviewer Agent: Spawns read-only Claude Code
  │  Reviews code, security, coverage
  │  Score: 72/100 → NOT APPROVED
  │  Issues: "Missing rate limiting on auth endpoints"
  │
  ▼
Programmer Agent: Spawns Claude Code again
  │  Fixes review issues
  │  Adds rate limiting
  │  Commits fix
  │
  ▼
Reviewer Agent: Re-reviews
  │  Score: 94/100 → APPROVED
  │
  ▼
Tester Agent: Runs full test suite
  │  Tests: 47/47 passed
  │  Coverage: 91%
  │
  ▼
You (via chat): "✅ Project complete!
  47 tests passing, 91% coverage.
  Review score: 94/100.
  Ready at /projects/inventory-api"
```

## Approval Gates

You can add human approval checkpoints at any phase:

```yaml
# In the Lobster workflow
- id: approve-architecture
  command: >
    approve --prompt "Architecture ready for review"
    --preview-from-stdin
  stdin: ${{ steps.architect.stdout }}
  approval: required

- id: code
  condition: ${{ steps.approve-architecture.approved }}
  command: ...
```

This pauses the pipeline and notifies you via chat. You approve or reject, and the pipeline continues.

## Monitoring Progress

### Via Chat

Ask your OpenClaw bot:

```
What's the status of the inventory API project?
```

It reads STATE.yaml and reports current phase, progress, and any blockers.

### Via Mission Control Dashboard

If you have [openclaw-mission-control](https://github.com/abhi1693/openclaw-mission-control) installed:

```bash
docker run -p 8080:8080 ghcr.io/abhi1693/openclaw-mission-control:latest
```

Visual dashboard showing all agents, tasks, and pipeline status.

## Error Handling

| Scenario | What Happens |
|----------|-------------|
| Code fails review 3 times | Pipeline pauses, notifies you with issues |
| Tests fail | Programmer agent gets failure details, attempts fix |
| Tests fail after fix | Pipeline pauses, asks for your input |
| Claude Code times out | ACP retries once, then escalates to orchestrator |
| Unknown error | STATE.yaml updated with blocker, you're notified |

## Cost Optimization

| Strategy | How | Savings |
|----------|-----|---------|
| Ollama for reviews | Use local model for code review gate | ~40% |
| Sonnet for simple tasks | Architecture, testing use cheaper model | ~30% |
| Opus for coding only | Only programmer agent uses Opus | Focused spend |
| QMD context | Less research needed, reuse past decisions | Time saved |

Configure in ACP spawn:
```bash
# Coding: use Opus
acp spawn claude --model claude-opus-4-6

# Review: use Sonnet
acp spawn claude --model claude-sonnet-4-6 --permissions deny-all

# Or use Ollama for review
acp spawn pi --model qwen3-coder
```

## Integration with GSD

If the project also has GSD installed, Claude Code sessions will use GSD's context engineering within each coding phase:

```
OpenClaw Orchestrator (project-level)
  └── Lobster Pipeline (deterministic flow)
       └── Claude Code ACP Session (coding)
            └── GSD (context management within session)
                 └── CodeAssist Skills (specialized tasks)
```

This gives you three layers:
1. **OpenClaw** — project orchestration, agent coordination, chat interface
2. **GSD** — context engineering, preventing quality degradation within sessions
3. **CodeAssist** — specialized skills, safety rails, domain expertise

## Quick Start Checklist

```
[ ] 1. OpenClaw running with gateway + chat adapter
[ ] 2. ACP enabled with Claude Code as allowed agent
[ ] 3. Agent configs created (orchestrator, programmer, reviewer, tester)
[ ] 4. Lobster workflows created (project-pipeline, review-cycle)
[ ] 5. CodeAssist skills installed globally (~/.claude/skills/)
[ ] 6. QMD configured for knowledge base access (optional)
[ ] 7. GSD installed for context management (optional)
[ ] 8. Test: send a small project idea via chat
```

## Scaling to Multiple Projects

When you're running 3+ autonomous projects simultaneously, consider [Paperclip](https://github.com/paperclipai/paperclip) as the management layer above OpenClaw:

```bash
npx paperclipai onboard --yes
```

Paperclip adds:
- **Token budgets** — set monthly spend limits per agent, auto-throttle when exceeded
- **Heartbeat scheduling** — agents wake on schedule, check for work, act, sleep
- **Multi-project isolation** — run multiple OpenClaw pipelines without conflicts
- **Atomic task checkout** — prevents two agents from working on the same task
- **Audit trail** — full tool-call tracing across all agents and projects

```
Paperclip (governance, budgets, multi-project)
  └── OpenClaw (orchestration per project)
       └── Claude Code + CodeAssist (coding)
            └── GSD (context management)
```

## References

- [OpenClaw ACP Agents](https://docs.openclaw.ai/tools/acp-agents)
- [Lobster Workflow Engine](https://docs.openclaw.ai/tools/lobster)
- [OpenClaw AGENTS.md](https://github.com/openclaw/openclaw/blob/main/AGENTS.md)
- [Multi-Agent Dev Pipeline](https://dev.to/ggondim/how-i-built-a-deterministic-multi-agent-dev-pipeline-inside-openclaw-and-contributed-a-missing-4ool)
- [OpenClaw Mission Control](https://github.com/abhi1693/openclaw-mission-control)
- [Autonomous Project Management Use Case](https://github.com/hesamsheikh/awesome-openclaw-usecases/blob/main/usecases/autonomous-project-management.md)
