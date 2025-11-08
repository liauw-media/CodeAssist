---
name: using-skills
description: "Use when starting ANY task. This skill ensures you check for and use relevant skills before proceeding. MANDATORY for all requests."
---

# Using CodeAssist Skills

## Core Principle

Before tackling any task, you MUST identify and execute relevant skills. This is mandatory, not optional.

## Mandatory First Response Protocol

Complete this checklist for EVERY request:

1. **Inventory**: Mentally list all available skills in `.claude/skills/`
2. **Assess**: Determine if ANY skill applies to this work
3. **Read**: If applicable, use the Read tool to load the skill file
4. **Announce**: Publicly state which skill you're deploying
   - Format: "I'm using [Skill Name] to [purpose]"
5. **Execute**: Follow the skill exactly as documented

## Critical Enforcement Rules

**Skills are non-negotiable.** If a skill exists for your task, using it is MANDATORY.

### The Enforcement Problem

**Skills usage "gets lost" over time** - agents stop using skills after extended sessions or across multiple projects.

**This is UNACCEPTABLE.**

### Solution: Regular Skill Reminders

**Every 10 tasks OR every hour, whichever comes first:**

```
⚠️ SKILLS FRAMEWORK CHECK ⚠️

Before continuing, verify:
1. ✅ Am I using skills for ALL tasks?
2. ✅ Did I read skill files (not just remember)?
3. ✅ Am I announcing skill usage?
4. ✅ Am I following skill protocols exactly?

If NO to any: STOP and recommit to skills framework.

Last skill used: [name]
Tasks since last reminder: [count]
```

**This reminder is MANDATORY and automatic** - do NOT skip it.

### Skill Usage Must Be Consistent Across Projects

**Problem**: AI uses skills differently in different projects.

**Solution**: Skills framework is UNIVERSAL.

- ✅ Same skill files in ALL projects (`.claude/skills/`)
- ✅ Same enforcement in ALL projects
- ✅ Same protocols in ALL projects
- ✅ NO project-specific variations

**If skills are being used differently across projects, you are doing it WRONG.**

### Common Rationalizations to Reject

- ❌ "This is straightforward" → Still check for skills
- ❌ "I recall this skill already" → Read the current file anyway
- ❌ "The skill seems excessive" → Use it regardless
- ❌ "Let me gather information first" → Skills define how to gather information
- ❌ "I'll just do it quickly" → Speed comes FROM following skills
- ❌ "This is a small change" → Small changes need skills too
- ❌ "I'm under time pressure" → Skills SAVE time and prevent errors
- ❌ "I used skills in the last project" → Use them EVERY project
- ❌ "I'm just making a small commit" → verification-before-completion is MANDATORY

### Why Skills Are Mandatory

1. **Authority**: Skills represent proven, tested approaches
2. **Consistency**: Same pattern across all projects
3. **Safety**: Skills include critical safety checks
4. **Learning**: Skills compound knowledge over time
5. **Reliability**: Skills prevent known errors

## Checklist-Based Skills

When a skill contains a checklist:
- Create individual TodoWrite todos for EACH item
- Never work through checklists mentally
- Never batch multiple steps into single tasks
- Mark each todo as completed individually

## Transparency Requirement

Always announce skill usage plainly:

> "I'm using [Skill Name] to [purpose]."

This:
- ✅ Clarifies your reasoning
- ✅ Allows user to catch errors early
- ✅ Documents which skills are being used
- ✅ Reinforces skill-first mindset
- ✅ Builds trust through transparency

## Red Flags

- ❌ Never start implementation without checking skills
- ❌ Never rationalize skipping a relevant skill
- ❌ Never assume you remember a skill's current content
- ❌ Never work on "autopilot" without skill guidance
- ❌ Never batch multiple skills mentally

## Skill Categories

### Core Workflow
- `brainstorming` - Design before implementation
- `writing-plans` - Break work into tasks
- `executing-plans` - Execute with verification
- `code-review` - Review before completing

### Framework Setup
- `laravel-api-setup` - Laravel API-first projects
- `nextjs-pwa-setup` - PWA with Next.js
- `react-native-setup` - Native mobile apps
- `python-fastapi-setup` - Python API projects

### Safety (CRITICAL)
- `database-backup` - MANDATORY before database operations
- `pre-commit-hooks` - Code quality enforcement
- `verification-before-completion` - Final checks

### Testing
- `test-driven-development` - RED/GREEN/REFACTOR
- `paratest-setup` - Parallel testing for PHP
- `testing-anti-patterns` - What NOT to do

### Workflow
- `git-workflow` - Branching and commits
- `git-worktrees` - Parallel feature development
- `dispatching-parallel-agents` - Multi-task workflow

### Meta
- `writing-skills` - Creating new skills
- `testing-skills` - Validating skills with pressure tests

## Skill Discovery by Task Type

### "I'm starting a new Laravel project"
→ `brainstorming` → `laravel-api-setup`

### "I need to run migrations/tests"
→ `database-backup` ⚠️ CRITICAL (ALWAYS)

### "I'm adding a new feature"
→ `brainstorming` → `writing-plans` → `test-driven-development`

### "I need to work on multiple features"
→ `git-worktrees`

### "I'm ready to commit my changes"
→ `git-workflow`

### "I'm finishing a feature"
→ `code-review` → `verification-before-completion`

### "I need to create a new skill"
→ `writing-skills` → `testing-skills`

## Pressure Testing Awareness

Skills are designed to work ESPECIALLY when you're under pressure. Common pressure situations where you MUST still use skills:

- ⏰ **Time Pressure**: "It's 5 PM Friday"
- 💰 **Sunk Cost**: "I've been working on this for 3 days"
- 👔 **Authority**: "My manager is waiting"
- 🔥 **Urgency**: "Production is down"
- 💪 **Confidence**: "I know what I'm doing"

**In ALL these situations**: Check and use skills anyway.

---

**Bottom Line**: Skills represent accumulated best practices. Bypassing them means repeating solved problems and recreating known errors. The few seconds it takes to check skills saves hours of debugging later.
