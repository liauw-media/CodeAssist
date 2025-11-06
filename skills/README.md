# CodeAssist Skills Index

**Version**: 3.1.0
**Last Updated**: 2025-01-06
**Total Skills**: 23 (Complete Superpowers Implementation)

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

### verification-before-completion
**Use when**: Finishing any task
**Purpose**: Final checklist before marking complete
**File**: `core/verification-before-completion/SKILL.md`
**Benefits**: Nothing forgotten, all tests pass, documentation updated

---

## 🏗️ Framework Setup Skills

### laravel-api-setup
**Use when**: Setting up new Laravel API project
**Purpose**: API-first Laravel with Sanctum, Paratest, Scramble
**File**: `framework/laravel-api-setup/SKILL.md`
**Includes**: Auth setup, database config, testing, API docs

### nextjs-pwa-setup
**Use when**: Creating PWA with Next.js
**Purpose**: Installable web app with offline support
**File**: `framework/nextjs-pwa-setup/SKILL.md`
**Includes**: next-pwa config, manifest, service workers, install prompt

### react-native-setup
**Use when**: Creating native mobile app
**Purpose**: React Native with Expo setup
**File**: `framework/react-native-setup/SKILL.md`
**Includes**: Expo config, navigation, API client, auth

### python-fastapi-setup
**Use when**: Setting up Python API project
**Purpose**: FastAPI with JWT, SQLAlchemy, pytest
**File**: `framework/python-fastapi-setup/SKILL.md`
**Includes**: API structure, auth, database, testing

---

## 🛡️ Safety Skills (CRITICAL)

### database-backup
**Use when**: ANY database operation (MANDATORY)
**Purpose**: Prevent catastrophic data loss
**File**: `safety/database-backup/SKILL.md`
**Authority**: Based on 2 production database wipes
**Triggers**: Tests, migrations, seeders, manual queries

### pre-commit-hooks
**Use when**: Setting up new project or adding quality gates
**Purpose**: Automated code quality enforcement
**File**: `safety/pre-commit-hooks/SKILL.md`
**Includes**: Language-specific linters, formatters, type checkers

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

### paratest-setup
**Use when**: Setting up PHP/Laravel project testing
**Purpose**: Parallel test execution (2-10x faster)
**File**: `testing/paratest-setup/SKILL.md`
**Benefits**: Faster feedback, better CI/CD times

### testing-anti-patterns
**Use when**: Reviewing test code
**Purpose**: Identify and avoid common testing mistakes
**File**: `testing/testing-anti-patterns/SKILL.md`
**Examples**: Brittle tests, slow tests, unclear assertions

### testing-skills
**Use when**: Validating a new skill works correctly
**Purpose**: Pressure test skills with realistic scenarios
**File**: `meta/testing-skills/SKILL.md`
**Process**: RED (pressure) → GREEN (skill) → REFACTOR (improve)

---

## 🔀 Workflow Skills

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

---

## 📝 Meta Skills

### writing-skills
**Use when**: Creating a new skill
**Purpose**: TDD for skills - test first, document second
**File**: `meta/writing-skills/SKILL.md`
**Process**: RED (pressure test) → GREEN (skill) → REFACTOR (improve)
**Iron Law**: NO SKILL WITHOUT A FAILING TEST FIRST

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
2. Framework skill (`laravel-api-setup`, `nextjs-pwa-setup`, etc.)
3. `git-workflow` - Initialize repository
4. `pre-commit-hooks` - Quality gates

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

- `migrate`, `test`, `seed` → `database-backup` ⚠️
- "new feature" → `brainstorming` → `writing-plans` → `test-driven-development`
- "bug", "error" → `systematic-debugging`
- "new project" → Framework skill (`laravel-api-setup`, etc.)
- "commit", "push" → `git-workflow`
- "parallel", "multiple features" → `git-worktrees`
- "done", "complete" → `code-review` → `verification-before-completion`

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

**Critical Skills (ALWAYS)**: 2
- `using-skills`
- `database-backup`

**Core Workflow**: 5
- `brainstorming`, `writing-plans`, `executing-plans`, `code-review`, `verification-before-completion`

**Framework Setup**: 4+
- `laravel-api-setup`, `nextjs-pwa-setup`, `react-native-setup`, `python-fastapi-setup`

**Safety**: 3
- `database-backup`, `pre-commit-hooks`, `defense-in-depth`

**Testing**: 4
- `test-driven-development`, `paratest-setup`, `testing-anti-patterns`, `testing-skills`

**Workflow**: 4
- `git-workflow`, `git-worktrees`, `dispatching-parallel-agents`, `finishing-a-development-branch`

**Debugging**: 2
- `systematic-debugging`, `root-cause-tracing`

**Meta**: 2
- `writing-skills`, `sharing-skills`

**Total**: 26 skills

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
