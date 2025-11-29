# CodeAssist Skills Index

**Version**: 3.1.5
**Last Updated**: 2025-11-29
**Total Skills**: 31 (Complete Superpowers + CodeAssist + Enforcement + Platform CLI + Design + MCP Tools + Branding + Remote Agents)

---

## 🎯 How to Use Skills (MANDATORY)

**Before starting ANY task**, you MUST:

1. Read this index to see available skills
2. Identify relevant skills for your task
3. Load and read the skill file
4. Announce which skill you're using
5. Execute the skill exactly as documented

**See**: [Using Skills](using-skills/SKILL.md) for complete protocol

---

## ⚠️ Critical Skills (ALWAYS MANDATORY)

### using-skills ⚠️
**Use when**: Starting ANY task (every request)
**Purpose**: Mandatory first-response protocol
**File**: `using-skills/SKILL.md`
**Priority**: CRITICAL - Must use for every request

### database-backup ⚠️
**Use when**: ANY database operation (tests, migrations, queries, seeders)
**Purpose**: Prevent catastrophic data loss
**File**: `safety/database-backup/SKILL.md`
**Priority**: CRITICAL - Production data is irreplaceable
**Triggers**: `php artisan migrate`, `php artisan test`, `npm test`, `pytest`, any database-touching command

---

## 🧠 Core Workflow Skills

### brainstorming
**Use when**: Starting new features, major changes, or unclear requirements
**Purpose**: Establish shared understanding before implementation
**File**: `core/brainstorming/SKILL.md`
**Benefits**: Prevents wasted effort, ensures alignment, explores trade-offs

### writing-plans
**Use when**: After brainstorming, before implementation
**Purpose**: Break work into discrete, actionable tasks
**File**: `core/writing-plans/SKILL.md`
**Benefits**: Clear roadmap, progress tracking, dependency identification

### executing-plans
**Use when**: Implementing a multi-step plan
**Purpose**: Execute with verification checkpoints
**File**: `core/executing-plans/SKILL.md`
**Benefits**: Systematic progress, catch errors early, avoid rabbit holes

### code-review
**Use when**: Completing any feature or fix
**Purpose**: Self-review before declaring "done"
**File**: `core/code-review/SKILL.md`
**Benefits**: Catch bugs, improve quality, ensure completeness

### requesting-code-review
**Use when**: Determining if external code review is needed
**Purpose**: Know when and how to request peer review
**File**: `core/requesting-code-review/SKILL.md`
**Benefits**: Appropriate review requests, team collaboration

### receiving-code-review
**Use when**: Responding to code review feedback
**Purpose**: Technical evaluation and integration of feedback
**File**: `core/receiving-code-review/SKILL.md`
**Benefits**: Effective feedback integration, continuous improvement

### verification-before-completion
**Use when**: Finishing any task
**Purpose**: Final checklist before marking complete
**File**: `core/verification-before-completion/SKILL.md`
**Benefits**: Nothing forgotten, all tests pass, documentation updated

---

## 🛡️ Safety Skills (CRITICAL)

### database-backup
**Use when**: ANY database operation (MANDATORY)
**Purpose**: Prevent catastrophic data loss
**File**: `safety/database-backup/SKILL.md`
**Authority**: Based on 2 production database wipes
**Triggers**: Tests, migrations, seeders, manual queries

### defense-in-depth
**Use when**: Implementing security features
**Purpose**: Multiple layers of security validation
**File**: `safety/defense-in-depth/SKILL.md`
**Benefits**: Fail-safe approach, redundant checks

---

## 🧪 Testing Skills

### test-driven-development
**Use when**: Adding features or fixing bugs
**Purpose**: RED/GREEN/REFACTOR cycle
**File**: `testing/test-driven-development/SKILL.md`
**Process**: Write failing test → Minimal implementation → Refactor

### condition-based-waiting
**Use when**: Writing tests with async operations
**Purpose**: Eliminate flaky tests caused by arbitrary timeouts
**File**: `testing/condition-based-waiting/SKILL.md`
**Benefits**: Reliable tests, faster execution, clear failures

### testing-anti-patterns
**Use when**: Reviewing test code
**Purpose**: Identify and avoid common testing mistakes
**File**: `testing/testing-anti-patterns/SKILL.md`
**Examples**: Brittle tests, slow tests, unclear assertions

### playwright-frontend-testing
**Use when**: Testing frontend applications
**Purpose**: AI-assisted browser testing with Playwright MCP
**File**: `testing/playwright-frontend-testing/SKILL.md`
**Benefits**: Fast, deterministic, accessibility-first testing

### lighthouse-performance-optimization
**Use when**: Optimizing website performance
**Purpose**: Run Google Lighthouse audits to measure and improve performance
**File**: `testing/lighthouse-performance-optimization/SKILL.md`
**Benefits**: Data-driven optimization, Core Web Vitals, accessibility audits
**MCP**: Requires Lighthouse MCP server

---

## 🔀 Workflow Skills

### git-platform-cli ⚠️
**Use when**: ALWAYS (session start, creating tasks, committing, creating PR/MR)
**Purpose**: MANDATORY gh/glab usage for issue/task management
**File**: `workflow/git-platform-cli/SKILL.md`
**Includes**: Issue creation from tasks, commit linking, PR/MR creation
**Policy**: NO manual web UI for issues - ALWAYS use CLI
**Priority**: CRITICAL - Required for all projects

### git-workflow
**Use when**: Making commits, creating branches
**Purpose**: Consistent Git practices
**File**: `workflow/git-workflow/SKILL.md`
**Includes**: Commit messages, branching, merging
**Policy**: NO AI co-author attribution

### git-worktrees
**Use when**: Working on multiple features simultaneously
**Purpose**: Isolated workspaces without branch switching
**File**: `workflow/git-worktrees/SKILL.md`
**Benefits**: Parallel work, no stashing, independent testing

### dispatching-parallel-agents
**Use when**: Multiple independent tasks can run simultaneously
**Purpose**: Efficient parallel work execution
**File**: `workflow/dispatching-parallel-agents/SKILL.md`
**Benefits**: Faster completion, better resource use

### finishing-a-development-branch
**Use when**: Ready to merge feature branch
**Purpose**: Complete checklist before PR/MR
**File**: `workflow/finishing-a-development-branch/SKILL.md`
**Includes**: Tests pass, docs updated, conflicts resolved

### subagent-driven-development
**Use when**: Complex tasks requiring fresh perspective
**Purpose**: Use specialized subagents for focused work
**File**: `workflow/subagent-driven-development/SKILL.md`
**Benefits**: Fresh context, specialized expertise, parallel execution

### remote-code-agents
**Use when**: Long-running analysis, resource-intensive tasks, parallel workload distribution
**Purpose**: Delegate tasks to remote Claude Code agent containers
**File**: `workflow/remote-code-agents/SKILL.md`
**Benefits**: Async execution, parallel processing, no workflow blocking
**Features**: REST API, CLI tool, CI/CD integration, three agent types (general/research/testing)
**Configuration**: Environment variables (safe for public repos)

---

## 🛠️ Debugging Skills

### systematic-debugging
**Use when**: Encountering bugs or unexpected behavior
**Purpose**: Methodical root cause identification
**File**: `workflow/systematic-debugging/SKILL.md`
**Process**: Reproduce → Isolate → Identify → Fix → Verify

### root-cause-tracing
**Use when**: Bug is complex or obscure
**Purpose**: Trace through layers to find actual cause
**File**: `workflow/root-cause-tracing/SKILL.md`
**Benefits**: Fix root cause, not symptoms

### browser-automation-debugging
**Use when**: Debugging web apps or automating browser tasks
**Purpose**: Use Chrome DevTools MCP for inspection and automation
**File**: `debugging/browser-automation-debugging/SKILL.md`
**Benefits**: Live browser control, screenshots, network analysis, performance profiling
**MCP**: Requires Chrome DevTools MCP server

---

## 🎨 Design Skills

### brand-guidelines
**Use when**: Starting projects, rebranding, documenting existing brand
**Purpose**: Establish comprehensive brand identity that other skills automatically reference
**File**: `design/brand-guidelines/SKILL.md`
**Benefits**: Consistent brand across all outputs, automatic application, composable with other skills
**Features**: Interactive discovery, project analysis, guideline templates, skill integration
**Integration**: Automatically referenced by frontend-design and playwright-frontend-testing
**Attribution**: Based on [Anthropic - Package Brand Guidelines](https://website.claude.com/resources/use-cases/package-your-brand-guidelines-in-a-skill)

### frontend-design
**Use when**: Building web components, pages, or applications
**Purpose**: Create distinctive, production-grade frontend interfaces
**File**: `design/frontend-design/SKILL.md`
**Benefits**: Avoid generic aesthetics, intentional design, memorable UIs
**Features**: Typography excellence, color strategy, motion/animation, spatial composition
**Integration**: Automatically applies brand-guidelines if they exist
**Attribution**: Adapted from [Anthropic Skills](https://github.com/anthropics/skills/tree/main/frontend-design)

---

## 📝 Meta Skills

### writing-skills
**Use when**: Creating a new skill
**Purpose**: TDD for skills - test first, document second
**File**: `meta/writing-skills/SKILL.md`
**Process**: RED (pressure test) → GREEN (skill) → REFACTOR (improve)
**Iron Law**: NO SKILL WITHOUT A FAILING TEST FIRST

### testing-skills-with-subagents
**Use when**: Validating a new skill works correctly
**Purpose**: Pressure test skills with realistic scenarios
**File**: `meta/testing-skills-with-subagents/SKILL.md`
**Benefits**: Validate skill effectiveness before deployment

### sharing-skills
**Use when**: Contributing skills back to community
**Purpose**: Share knowledge across teams/projects
**File**: `meta/sharing-skills/SKILL.md`
**Benefits**: Compound learning, help others

---

## 🔍 Skill Discovery Guide

### By Task Type

**Starting New Project**:
1. `brainstorming` - Understand requirements
2. `writing-plans` - Break project into phases
3. `git-workflow` - Initialize repository
4. `database-backup` - Set up safety scripts before any DB work

**Adding Feature**:
1. `brainstorming` - Design approach
2. `writing-plans` - Break into tasks
3. `git-worktrees` - If parallel work needed
4. `test-driven-development` - Implement with TDD
5. `code-review` - Self-review
6. `verification-before-completion` - Final checks
7. `finishing-a-development-branch` - Prepare for merge

**Database Operation**:
1. `database-backup` - ALWAYS FIRST ⚠️
2. Run operation via safety wrapper
3. Verify backup exists

**Debugging**:
1. `systematic-debugging` - Methodical approach
2. `root-cause-tracing` - If complex
3. `test-driven-development` - Add test for bug
4. Fix bug
5. Verify test passes

**Creating New Skill**:
1. `writing-skills` - TDD for skills
2. `testing-skills` - Pressure test
3. Add to this index

### By Trigger Keyword

- **Session start** → `git-platform-cli` (check gh/glab) ⚠️ MANDATORY
- `migrate`, `test`, `seed` → `database-backup` ⚠️
- "new feature" → `brainstorming` → `writing-plans` → `git-platform-cli` (create issues) → `test-driven-development`
- "task", "todo", "plan" → `writing-plans` → `git-platform-cli` (create issues)
- "bug", "error" → `git-platform-cli` (create bug issue) → `systematic-debugging`
- "new project" → `brainstorming` → `writing-plans` → `git-platform-cli` (create issues)
- "issue", "feature request" → `git-platform-cli` (use gh/glab, not web UI) ⚠️
- "frontend test", "browser test" → `playwright-frontend-testing`
- "performance", "lighthouse", "Core Web Vitals" → `lighthouse-performance-optimization`
- "browser automation", "screenshot", "network debugging" → `browser-automation-debugging`
- "brand", "branding", "brand identity", "brand guidelines" → `brand-guidelines`
- "frontend", "UI", "web component", "design" → `brand-guidelines` (first) → `frontend-design`
- "remote agent", "delegate task", "long-running", "code review automation" → `remote-code-agents`
- "flaky test", "timeout" → `condition-based-waiting`
- "commit", "push" → `git-workflow` + `git-platform-cli` (link issues)
- "parallel", "multiple features" → `git-worktrees` or `dispatching-parallel-agents`
- "done", "complete" → `code-review` → `verification-before-completion` → `git-platform-cli` (create PR/MR)
- "code review feedback" → `receiving-code-review`

---

## 🎓 Skill Philosophy

### Why Skills Exist

Skills represent **accumulated wisdom**:
- Lessons from production incidents
- Industry best practices
- Proven patterns that work
- Safety checks that prevent disasters

### Why Skills Are Mandatory

1. **Reliability**: Consistent behavior across all tasks
2. **Safety**: Critical checks never forgotten
3. **Quality**: Best practices always applied
4. **Learning**: Knowledge compounds over time
5. **Speed**: Paradoxically, following skills is FASTER

### Common Misconceptions

❌ "Skills slow me down" → Skills SAVE time by preventing errors
❌ "Skills are overkill" → Skills prevent catastrophes
❌ "I know this already" → Skills ensure you don't forget steps
❌ "Skills are just documentation" → Skills are MANDATORY protocols

---

## 📊 Skill Statistics

**Critical Skills (ALWAYS)**: 3
- `using-skills` (mandatory protocol)
- `database-backup` (mandatory before ANY database operation)
- `git-platform-cli` (mandatory gh/glab for issues/tasks) ⚠️ NEW

**Core Workflow**: 7
- `brainstorming`, `writing-plans`, `executing-plans`
- `code-review`, `requesting-code-review`, `receiving-code-review`
- `verification-before-completion`

**Safety**: 2
- `database-backup`, `defense-in-depth`

**Testing**: 5
- `test-driven-development`, `condition-based-waiting`
- `testing-anti-patterns`, `playwright-frontend-testing`
- `lighthouse-performance-optimization`

**Workflow**: 7
- `git-platform-cli`, `git-workflow`, `git-worktrees`, `dispatching-parallel-agents`
- `finishing-a-development-branch`, `subagent-driven-development`, `remote-code-agents`

**Debugging**: 3
- `systematic-debugging`, `root-cause-tracing`
- `browser-automation-debugging`

**Design**: 2
- `brand-guidelines`, `frontend-design`

**Meta**: 3
- `writing-skills`, `testing-skills-with-subagents`, `sharing-skills`

**Total**: 31 skills (1 critical protocol + 2 mandatory tools + 28 operational skills)

---

## 🚀 Getting Started

1. **Read**: [Using Skills](using-skills/SKILL.md) - Mandatory protocol
2. **Bookmark**: This index for quick reference
3. **Practice**: Use skills for every task
4. **Contribute**: Create new skills when you find gaps

---

## 📚 Attribution

Skills framework inspired by:
- **Blog**: https://blog.fsck.com/2025/10/09/superpowers/
- **Repository**: https://github.com/obra/superpowers
- **Author**: Jesse Vincent (@obra)

The CodeAssist skills framework adapts these concepts for our specific development workflows and tools.

---

**Remember**: Before starting ANY task, check this index. Skills are mandatory, not optional. They represent the accumulated wisdom of our development practice and the lessons learned from past mistakes. Use them.
