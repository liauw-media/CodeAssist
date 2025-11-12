# Skills Decision Tree (Always Loaded)

**⚠️ CHECK THIS BEFORE EVERY TASK - ALWAYS IN CONTEXT**

## Pattern Matching (Automatic Skill Detection)

```
Session Start (ALWAYS):
└─> CHECK: gh --version && glab --version (MANDATORY tools)
    If missing → BLOCK and require installation

User Request Analysis:
├─ Contains: migrate|test|seed|db:|artisan test|npm test|pytest
│  └─> 🛑 BLOCK → database-backup (MANDATORY, read full skill)
│
├─ Contains: new feature|add feature|implement|build
│  └─> brainstorming → writing-plans → git-platform-cli (create issues) → executing-plans
│
├─ Contains: task|todo|plan
│  └─> writing-plans → git-platform-cli (create issues from tasks)
│
├─ Tool Used: Edit|Write (code was written)
│  └─> 🛑 BLOCK → code-review (MANDATORY after ANY code)
│
├─ User says: done|finished|complete|commit|push
│  └─> 🛑 BLOCK → verification-before-completion (MANDATORY)
│     └─> git-platform-cli (create PR/MR with issue links)
│
├─ Contains: issue|bug report|feature request
│  └─> git-platform-cli (use gh/glab, NOT web UI)
│
├─ Contains: multiple|parallel|independent tasks
│  └─> dispatching-parallel-agents
│
├─ Contains: bug|error|broken|failing|not working
│  └─> git-platform-cli (create bug issue) → systematic-debugging → root-cause-tracing
│
├─ Contains: frontend test|browser test|e2e test|playwright
│  └─> playwright-frontend-testing (hybrid: MCP → permanent tests)
│
├─ Contains: flaky test|timeout|sleep|wait
│  └─> condition-based-waiting
│
└─ Default: Check .claude/skills/README.md for full index
```

## Critical Enforcement Points (BLOCKING)

### 🛑 0. Session Start: gh/glab Check (NEW - MANDATORY)
**Triggers**: Every session start

**Action**: CHECK if gh and glab are installed:
```bash
gh --version  # GitHub CLI - MANDATORY
glab --version  # GitLab CLI - MANDATORY
```

**If either missing**: BLOCK and require installation:
```bash
# GitHub CLI
winget install GitHub.cli  # Windows
brew install gh            # macOS/Linux

# GitLab CLI
Download from https://gitlab.com/gitlab-org/cli/-/releases
Or: brew install glab (macOS/Linux)
```

**Why MANDATORY**:
- Issue/task management integration
- Automated workflows
- Traceability (commits ↔ issues)
- Professional development standard

**Full Skill**: `.claude/skills/workflow/git-platform-cli/SKILL.md`

---

### 🛑 1. Before Database Operations
**Triggers**: migrate, test, seed, db:, artisan test, npm test, pytest

**Action**: BLOCK and require:
```bash
# User MUST create backup first
./scripts/backup-database.sh
# OR acknowledge understanding of risk
```

**Full Skill**: `.claude/skills/safety/database-backup/SKILL.md` (3500 tokens - justified)

---

### 🛑 2. After Writing Code
**Triggers**: Edit tool used, Write tool used

**Action**: BLOCK and require code-review:
```
CODE REVIEW CHECKPOINT:
□ Did I use code-review skill?
□ Did I ANNOUNCE using it?
□ Did I write tests?
□ Did I RUN tests?
□ Did ALL tests PASS?

If ANY unchecked: STOP. Review now.
```

**Full Skill**: `.claude/skills/core/code-review/SKILL.md` (4000 tokens - justified)

---

### 🛑 3. Before Commits
**Triggers**: User says "commit", "done", "finished", "complete"

**Action**: BLOCK and require verification:
```
COMMIT CHECKPOINT:
□ Code-review completed?
□ Verification completed?
□ All tests passed?
□ Pre-commit hooks installed?
□ Commit is small and precise?
□ /commit-checklist done?

If ANY unchecked: STOP. Cannot commit.
```

**Full Skill**: `.claude/skills/core/verification-before-completion/SKILL.md` (3000 tokens - justified)

---

## Ultra-Compact Periodic Check (Every 10 Requests)

```
⚠️ SKILLS CHECK:
□ USE □ READ □ ANNOUNCE
□ WORKFLOW: brainstorm→plan→execute→REVIEW→verify→commit
□ CONSISTENT

CRITICAL: REVIEW after code? VERIFY before commit?
```

**Token cost**: 50 tokens

---

## Token Budget Strategy

**Always Loaded** (200 tokens):
- This decision tree

**Periodic Reminders** (50 tokens × 10 per 100 requests = 500 tokens):
- Ultra-compact checklist

**Critical Blocking** (3500 tokens × 2-3 per session = ~10,000 tokens):
- database-backup (when database op detected)
- code-review (when code written)
- verification-before-completion (when commit mentioned)

**Total per 100-request session**: ~10,700 tokens (configurable)

**User Configuration**: See `.claude/settings.json` to adjust token budget

---

## Quick Reference

**Most Common Sequence**:
1. User: "Add new feature X"
2. Agent: Use brainstorming skill → discuss approach
3. Agent: Use writing-plans → break into tasks
4. Agent: Use executing-plans → implement ONE task
5. **🛑 BLOCK**: code-review MANDATORY
6. **🛑 BLOCK**: verification MANDATORY
7. User: "Commit"
8. **🛑 BLOCK**: /commit-checklist MANDATORY
9. Commit allowed

**Remember**: BLOCK means REFUSE to proceed until requirement met.

---

**Last Updated**: 2025-11-08
**Version**: 3.1.1 (Hybrid Enforcement)
