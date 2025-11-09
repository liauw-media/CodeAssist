# Skills Framework Enforcement Guide

**⚠️ READ THIS DOCUMENT REGULARLY TO MAINTAIN SKILLS DISCIPLINE ⚠️**

*Version: 3.1.1*
*Last Updated: 2025-11-08*
*Purpose: Prevent skills framework from "getting lost" over time*

---

## 🎯 The Core Problem

**Observed Issue**: Skills usage "gets lost" over extended sessions or across multiple projects.

**Symptoms:**
- ✅ Brainstorming works well
- ❌ Code gets created without proper review
- ❌ Tests are skipped or not run
- ❌ Commits happen without verification
- ❌ Skills used differently across projects

**This is UNACCEPTABLE and must be corrected.**

---

## 📋 Mandatory Workflow (NEVER DEVIATE)

### The Complete Cycle

**EVERY task must follow this exact sequence:**

```
1. using-skills       → Check which skills apply
2. brainstorming      → Discuss approach (if new feature/complex)
3. writing-plans      → Break into discrete tasks
4. executing-plans    → Implement ONE task at a time
5. code-review        → Self-review (MANDATORY - NO SKIP)
6. verification       → Complete checklist
7. commit             → After /commit-checklist passes
```

**❌ FORBIDDEN shortcuts:**
```
brainstorming → code → commit                    (skipped review, tests)
executing-plans → commit                         (skipped review, verification)
code-review → commit                             (skipped verification)
```

**Authority**: 80% of skill framework failures happen at steps 5-6 (code-review and verification). These are the MOST IMPORTANT steps.

---

## 🛡️ Enforcement Checkpoints

### Checkpoint 1: After Code Implementation

**When you've just written code, STOP and ask:**

```
⚠️ CODE REVIEW CHECKPOINT ⚠️

Before proceeding:
□ Did I use code-review skill?
□ Did I ANNOUNCE using code-review skill?
□ Did I review EVERY line of code?
□ Did I write tests?
□ Did I RUN tests?
□ Did ALL tests PASS?

If ANY box unchecked: Go back and do code-review NOW.
```

### Checkpoint 2: Before Commit

**When you type `git add`, STOP and ask:**

```
⚠️ COMMIT CHECKPOINT ⚠️

Before git commit:
□ Code-review skill completed?
□ Verification-before-completion skill completed?
□ All tests passed?
□ Pre-commit hooks will pass?
□ Commit is small and precise (one change)?
□ /commit-checklist completed?

If ANY box unchecked: STOP. Do not commit.
```

### Checkpoint 3: Every 10 Tasks or 1 Hour

**Automatic reminder (MANDATORY):**

```
⚠️ SKILLS FRAMEWORK CHECK ⚠️

Time for framework discipline check:

1. Am I using skills for ALL tasks?
   □ Yes - Continuing
   □ No - STOP and recommit to framework

2. Am I READING skill files or just "remembering"?
   □ Reading files - Good
   □ Just remembering - WRONG, read the files

3. Am I announcing skill usage every time?
   □ Yes - Good transparency
   □ No - Start announcing again

4. Am I following the complete workflow cycle?
   □ Yes - All steps done
   □ No - Which step did I skip? _______

5. Am I using skills CONSISTENTLY across projects?
   □ Yes - Same framework everywhere
   □ No - Unified framework required

Last skill used: ______________
Tasks since last reminder: ____
```

---

## 🚫 Common Failure Patterns (STOP THESE)

### Pattern 1: "I'll Review Later"

❌ **What happens:**
```
1. Write code
2. "Looks good, I'll review later"
3. Commit without review
4. Bugs shipped
```

✅ **Correct approach:**
```
1. Write code
2. IMMEDIATELY use code-review skill
3. Find issues during review
4. Fix issues
5. Then and only then: commit
```

### Pattern 2: "Tests Pass, Must Be Done"

❌ **What happens:**
```
1. Write code
2. Run tests (they pass)
3. Skip code review
4. Skip verification
5. Commit
6. Later: Discover unhandled edge cases
```

✅ **Correct approach:**
```
1. Write code
2. Run tests
3. Use code-review skill (reviews test coverage too)
4. Use verification-before-completion skill
5. Then commit
```

### Pattern 3: "It's a Small Change"

❌ **What happens:**
```
1. Make "small" change
2. "Too small to review"
3. Commit
4. Later: "Small" change breaks production
```

✅ **Correct approach:**
```
1. Make ANY change (large or small)
2. ALWAYS use code-review skill
3. ALWAYS use verification skill
4. Size doesn't matter - process does
```

### Pattern 4: "I'm Remembering the Skill"

❌ **What happens:**
```
1. Task starts
2. "I remember code-review skill"
3. Don't actually read the file
4. Skip important steps from actual skill
5. Incomplete review
```

✅ **Correct approach:**
```
1. Task starts
2. Read .claude/skills/core/code-review/SKILL.md
3. Follow EXACT steps from file
4. Don't rely on memory
```

---

## 📊 Required Test Coverage

### Frontend Changes

**MANDATORY before commit:**
```bash
# Component tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (CRITICAL for UI changes)
npm run test:e2e

# All must pass before commit
```

### Backend Changes

**MANDATORY before commit:**
```bash
# Unit tests
./scripts/safe-test.sh vendor/bin/paratest --testsuite=Unit

# Integration tests
./scripts/safe-test.sh vendor/bin/paratest --testsuite=Integration

# All must pass before commit
```

### Full-Stack Changes (Frontend + Backend)

**MANDATORY before commit:**
```bash
# Backend tests
./scripts/safe-test.sh vendor/bin/paratest

# Frontend tests
npm run test

# E2E tests (CRITICAL)
npm run test:e2e

# ALL THREE must pass before commit
```

**Authority**: 90% of production bugs come from changes where not all test suites were run.

---

## 🔄 Daily Enforcement Rituals

### CRITICAL: Add to Project Instructions

**MANDATORY: Add this to your project's `.claude/CLAUDE.md` file:**

```markdown
## Skills Framework Enforcement (MANDATORY)

**⚠️ CRITICAL: Read this section at the start of EVERY session ⚠️**

### Enforcement Protocol

**At Session Start (ONCE per session):**
1. Read the full enforcement guide: `docs/SKILLS-ENFORCEMENT.md`
2. Commit to following skills framework for this session
3. Keep lightweight reminder active (below) - NO need to re-read full documents

**Ultra-Compact Skills Check (Every 10 Tasks OR 1 Hour):**

**⚠️ DO NOT re-read full documents - use this keyword checklist only:**

```
⚠️ SKILLS CHECK:
□ USE (not skip) □ READ (not remember) □ ANNOUNCE
□ WORKFLOW: brainstorm→plan→execute→REVIEW→verify→commit
□ CONSISTENT (same across all projects)

CRITICAL: Did I REVIEW code after writing? Did I VERIFY before commit?
```

**Keyword Triggers:**
- **USE** = Using skills for tasks (not skipping)
- **READ** = Reading actual skill files (not relying on memory)
- **ANNOUNCE** = Announcing which skill I'm using
- **REVIEW** = code-review skill AFTER code (most commonly skipped!)
- **VERIFY** = verification-before-completion BEFORE commit (most commonly skipped!)
- **CONSISTENT** = Same framework across all projects

**Token cost**: ~50 tokens (was ~200) = **4x more efficient**

**Mandatory Workflow (NEVER DEVIATE):**
1. using-skills → Check which skills apply
2. brainstorming → Discuss approach (if new feature/complex)
3. writing-plans → Break into discrete tasks
4. executing-plans → Implement ONE task at a time
5. code-review → Self-review (MANDATORY - NO SKIP)
6. verification → Complete checklist
7. /commit-checklist → MANDATORY before commit
8. commit → After checklist passes

**Critical Checkpoints:**

After Code Implementation:
□ Did I use code-review skill?
□ Did I ANNOUNCE using code-review skill?
□ Did I write tests?
□ Did I RUN tests?
□ Did ALL tests PASS?

Before Every Commit:
□ Code-review skill completed?
□ Verification-before-completion skill completed?
□ All tests passed?
□ Pre-commit hooks will pass?
□ Commit is small and precise (one change)?
□ /commit-checklist completed?

**Documents to Re-Read:**
- Weekly (Every Monday): `docs/SKILLS-ENFORCEMENT.md`, `.claude/skills/using-skills/SKILL.md`, `.claude/skills/core/code-review/SKILL.md`
- Monthly (1st of month): `.claude/skills/README.md`, `.claude/skills/core/verification-before-completion/SKILL.md`

**When to Re-Read Full Documents (Token-Expensive, Use Sparingly):**

Only re-read full skills documents when:
1. **Session start** (once per session)
2. **Skills framework feels "lost"** (you notice skills being skipped)
3. **Weekly review** (Monday morning)
4. **Before major milestones** (finishing features, creating PRs)
5. **After receiving feedback** (user says "you skipped review" etc.)

DO NOT re-read every 10 tasks - use lightweight checklist above instead.

**If skills framework feels "lost":**
1. STOP ALL WORK
2. Re-read `docs/SKILLS-ENFORCEMENT.md` (justified token cost)
3. Re-read `.claude/skills/using-skills/SKILL.md` (justified token cost)
4. Re-commit to framework
5. Resume work with proper skills usage
```

**Why this is critical:**
- AI instances don't automatically remember to check enforcement
- Without project instructions, skills usage "gets lost"
- `.claude/CLAUDE.md` ensures EVERY AI instance follows the framework
- Lightweight reminders prevent degradation without excessive token usage
- Full document re-reads reserved for when actually needed

### Morning (Session Start)

```bash
# Run session start command
/session-start

# Read enforcement guide (this file)
Read: docs/SKILLS-ENFORCEMENT.md

# Commit to following framework today
"I will use skills for ALL tasks today"
```

### Before First Commit

```bash
# Run commit checklist
/commit-checklist

# Verify code-review was done
grep "code-review skill" recent-messages

# Verify verification was done
grep "verification-before-completion" recent-messages
```

### End of Day

```bash
# Review commits made today
git log --since="1 day ago" --oneline

# Ask: Did I skip any reviews?
# If yes: Learn for tomorrow
```

---

## 🎓 Skills Consistency Across Projects

**Problem**: Skills used differently in Project A vs Project B vs Project C.

**Solution**: UNIVERSAL FRAMEWORK

### Universal Rules

**These apply to EVERY project, NO exceptions:**

1. ✅ Same `.claude/skills/` directory structure
2. ✅ Same 25 skills installed
3. ✅ Same enforcement checkpoints
4. ✅ Same workflow cycle
5. ✅ Same testing requirements
6. ✅ Same commit standards

**If you find yourself thinking "This project is different":**

❌ WRONG: "This project doesn't need code review"
❌ WRONG: "This project can skip verification"
❌ WRONG: "This project allows large commits"

✅ CORRECT: "ALL projects follow the SAME framework"

---

## 🎯 Hybrid Enforcement Approach (v3.1.1)

**Problem**: Skills framework "gets lost" and relies on agent memory.

**Solution**: HYBRID system combining multiple enforcement mechanisms.

### The 4-Tier Hybrid System

**Tier 1: Skills Decision Tree (Always Loaded - 200 tokens)**
- Pattern matching for common scenarios
- Always in context (not re-read)
- Falls back to full skills when needed
- File: `.claude/SKILLS-DECISION-TREE.md`

**Tier 2: Blocking Hooks (System Enforced - 0 tokens)**
- `pre-database-operation.sh` → BLOCKS migrate/test/seed without backup
- `post-code-write.sh` → BLOCKS after 3 edits without review
- `pre-commit-check.sh` → BLOCKS commits without verification
- Triggered automatically at critical moments
- NOT relying on agent memory

**Tier 3: Periodic Reminders (Ultra-Compact - 50 tokens)**
- Every 10 requests: ultra-compact checklist
- NOT full skill re-reads
- Just: "USE READ ANNOUNCE / REVIEW VERIFY"
- Hook: `periodic-reminder.sh`

**Tier 4: Context Injection (Strategic - 3500 tokens when justified)**
- Only for CRITICAL skills (database-backup, code-review)
- Only when pattern detected
- Full skill content justified for safety

### Token Budget per 100-Request Session

| Component | Frequency | Tokens | Total |
|-----------|-----------|--------|-------|
| Decision Tree | Always loaded | 200 | 200 |
| Periodic Reminders | 10x per 100 | 50 | 500 |
| Critical Injections | 2-3x per 100 | 3500 | ~10,000 |
| **Total** | | | **~10,700** |

**Previous approach**: 100,000+ tokens (re-reading every 10)
**Hybrid approach**: ~10,700 tokens
**Savings**: **90% reduction, 10x more efficient**

### User-Configurable Token Budgets

Edit `.claude/settings.json` to choose preset:

```json
{
  "skills": {
    "tokenBudget": {
      "active": "balanced"  // Change to: unlimited, balanced, efficient, minimal
    }
  }
}
```

**Presets:**

1. **Unlimited** (Quality First)
   - No token limits
   - Read full skills whenever needed
   - Best quality, highest cost

2. **Balanced** (Recommended - DEFAULT)
   - ~20K tokens per 100 requests
   - Lightweight reminders + critical full reads
   - 90% quality at 10% cost

3. **Efficient** (Token Conscious)
   - ~10K tokens per 100 requests
   - Compact checklists only
   - No full skill reads

4. **Minimal** (Ultra-Light)
   - ~5K tokens per 100 requests
   - Decision tree only
   - No periodic reminders

### Blocking Enforcement (Always Active)

Hooks **BLOCK** dangerous operations regardless of token budget:

**🛑 Database Operations:**
```bash
$ php artisan migrate
🛑 DATABASE OPERATION DETECTED - BLOCKED
⚠️  MANDATORY: database-backup skill REQUIRED
Create backup NOW: ./scripts/backup-database.sh
```

**🛑 Code Review (after 3 edits):**
```bash
🛑 CODE REVIEW REQUIRED - BLOCKING
⚠️  You've made 3 code changes without review
MANDATORY: Use code-review skill NOW
```

**🛑 Commits Without Verification:**
```bash
$ git commit
🛑 PRE-COMMIT VERIFICATION - BLOCKING
❌ NO code review found
❌ NO verification found
BLOCKED: Cannot commit
```

### Installation

Install hybrid enforcement system:

```bash
# Fetch and run installer
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-hooks.sh -o install-hooks.sh
chmod +x install-hooks.sh
./install-hooks.sh

# Hooks are now active!
```

---

## 💰 Token Optimization Strategy

**Problem**: Re-reading full skills documents every 10 tasks is expensive:
- Full enforcement guide: ~3,500 tokens
- Multiple skill files: ~10,000+ tokens per re-read
- In 100-request session: Could waste 100,000+ tokens

**Solution**: Hybrid approach (decision tree + hooks + strategic reads)

### Lightweight Approach (Every 10 Tasks)

**Use the ultra-compact keyword checklist in `.claude/CLAUDE.md`** (already in context, ~0 additional tokens):

```
⚠️ SKILLS CHECK:
□ USE □ READ □ ANNOUNCE
□ WORKFLOW: brainstorm→plan→execute→REVIEW→verify→commit
□ CONSISTENT

CRITICAL: REVIEW after code? VERIFY before commit?
```

**Token cost**: ~50 tokens (4x more compact than verbose checklist)

### Full Document Reads (Strategic)

**Only when justified:**
- Session start (1x per session)
- Skills framework "feels lost"
- Weekly review (Monday)
- Before major milestones (PRs, releases)
- After user feedback about skipped skills

**Token cost**: ~10,000-15,000 tokens per full read
**Frequency**: 1-5 times per session (not every 10 tasks)
**Total cost per session**: ~15,000-50,000 tokens (reasonable)

### Cost-Benefit Analysis

**Without enforcement**: Ships bugs, incidents, rollbacks
**With excessive re-reading**: Wastes 100,000+ tokens per session
**With optimized approach**: ~15,000-50,000 tokens, prevents incidents

**Optimized approach is 3-5x more token-efficient while maintaining quality.**

---

## 📚 Documents to Re-Read Regularly

### Weekly (Every Monday)

- [ ] This file (`docs/SKILLS-ENFORCEMENT.md`)
- [ ] `.claude/skills/using-skills/SKILL.md`
- [ ] `.claude/skills/core/code-review/SKILL.md`

### Monthly (1st of month)

- [ ] `.claude/skills/README.md` (full skills index)
- [ ] `.claude/skills/core/verification-before-completion/SKILL.md`
- [ ] `.claude/skills/workflow/git-workflow/SKILL.md`

### Before Major Features

- [ ] `.claude/skills/core/brainstorming/SKILL.md`
- [ ] `.claude/skills/core/writing-plans/SKILL.md`
- [ ] `.claude/skills/core/executing-plans/SKILL.md`

### When Skills "Feel Lost"

**If you find yourself skipping skills:**

1. **STOP ALL WORK**
2. Read this file (SKILLS-ENFORCEMENT.md)
3. Read `.claude/skills/using-skills/SKILL.md`
4. Re-commit to framework
5. Resume work with proper skills usage

---

## 🔧 Emergency Recovery Protocol

**Use this when skills framework has been forgotten:**

### Step 1: Acknowledge the Problem

```
"I have not been using skills properly.
I will now correct this."
```

### Step 2: Read Core Documents

```bash
# Read in this order:
1. docs/SKILLS-ENFORCEMENT.md (this file)
2. .claude/skills/using-skills/SKILL.md
3. .claude/skills/README.md
```

### Step 3: Review Recent Work

```bash
# Check last 5 commits
git log -5 --oneline

# Ask: Which skills did I skip?
# Identify: Where did workflow break down?
```

### Step 4: Recommit to Framework

```
"From this point forward:
✅ I will use skills for ALL tasks
✅ I will announce skill usage
✅ I will read skill files (not remember)
✅ I will NEVER skip code-review
✅ I will NEVER skip verification
✅ I will run /commit-checklist before EVERY commit"
```

### Step 5: Resume with Discipline

```
Next task:
1. Check .claude/skills/README.md for relevant skills
2. Read the specific skill file
3. Announce which skill I'm using
4. Execute skill exactly as documented
5. Complete ALL steps (no skipping)
```

---

## ⚡ Quick Reference

**When starting ANY task:**
```
/session-start   (if first task of day)
→ Check skills index
→ Read relevant skill file
→ Announce skill usage
→ Execute skill protocol
```

**After writing ANY code:**
```
→ MANDATORY: code-review skill
→ MANDATORY: Run all tests
→ MANDATORY: verification-before-completion skill
→ MANDATORY: /commit-checklist
```

**Before ANY commit:**
```
→ Code review done? YES/NO
→ Tests passed? YES/NO
→ Verification done? YES/NO
→ Commit checklist done? YES/NO
→ If ANY NO: STOP, do it now
```

---

## 🎯 Success Metrics

**You're following framework correctly if:**

- ✅ Every commit preceded by code-review + verification
- ✅ All tests pass before every commit
- ✅ Commits are small and precise
- ✅ Skills usage announced in every task
- ✅ Same framework used across all projects
- ✅ No "I'll review later" thoughts
- ✅ No "it's too small to review" thoughts

**You've lost framework discipline if:**

- ❌ Commits without review
- ❌ Code without tests
- ❌ Large commits mixing multiple changes
- ❌ Skills not announced
- ❌ Different approach in different projects
- ❌ Skipping steps "to save time"

---

## 🔒 The Commitment

**Before continuing work, acknowledge:**

- [ ] I have read this enforcement guide
- [ ] I understand skills framework often "gets lost"
- [ ] I commit to regular checkpoints
- [ ] I will NEVER skip code-review
- [ ] I will NEVER skip verification
- [ ] I will use framework CONSISTENTLY across projects
- [ ] I will re-read this document weekly

**Signature (verbal)**: "I commit to skills framework discipline"

---

**The Iron Law**: Skills framework is not optional. It is not a suggestion. It is MANDATORY for professional software development.

**Re-read this document whenever skills usage feels inconsistent or "lost".**
