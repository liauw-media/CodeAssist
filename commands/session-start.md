---
description: Session start reminder - CodeAssist skills framework check
---

# Session Start Reminder

**🎯 CodeAssist Skills Framework Active**

Before starting work, ensure you're following the mandatory skills protocol:

## ✅ Pre-Session Checklist

### 1. Skills Installed?

```bash
# Verify skills are installed
find .claude/skills -name "SKILL.md" -type f | wc -l
# Should output: 24
```

**If not installed:**
```bash
/update-skills
```

### 2. Skills Up to Date?

**Last check:** _[Record date of last update check]_

**Check now:**
```bash
/check-updates
```

**Recommended**: Check monthly or before major features

### 3. Using-Skills Protocol Active?

**⚠️ MANDATORY FOR EVERY TASK:**

Before ANY task:
1. ✅ Read `.claude/skills/README.md` - identify relevant skills
2. ✅ Read the specific skill file (e.g., `.claude/skills/core/brainstorming/SKILL.md`)
3. ✅ Announce which skill you're using
4. ✅ Execute the skill exactly as documented

**Example:**
```
I'm using the brainstorming skill to discuss the approach before implementation.

Let me understand your requirements...
[follows brainstorming protocol]
```

### 4. Critical Skills Reminder

**ALWAYS MANDATORY:**

- 🛡️ **database-backup** - Before ANY database operation (tests, migrations, queries)
  - Location: `.claude/skills/safety/database-backup/SKILL.md`
  - NO EXCEPTIONS

- 📋 **using-skills** - For EVERY task (this protocol)
  - Location: `.claude/skills/using-skills/SKILL.md`
  - Check before starting any work

### 5. Workflow Cycle

For all tasks, follow:
```
1. Brainstorm → Discuss approach with user
2. Write Plan → Break into tasks with TodoWrite
3. Execute → One task at a time with verification
4. Review → Self-review with code-review skill
5. Verify → Final checks before completion
```

## 🚨 Red Flags (Skills Being Skipped)

If you find yourself:
- ❌ Starting implementation without checking skills
- ❌ Running database commands without `database-backup`
- ❌ Skipping brainstorming for "simple" tasks
- ❌ Committing without `git-workflow` check
- ❌ Declaring done without `verification-before-completion`

**STOP** → Go back and use the appropriate skill.

## 📚 Quick Skill Reference

**By Task Type:**

| Task | Skills to Use |
|------|---------------|
| New feature | brainstorming → writing-plans → test-driven-development → code-review |
| Bug fix | systematic-debugging → test-driven-development → code-review |
| Database work | database-backup (ALWAYS FIRST) → then other skills |
| Frontend test | playwright-frontend-testing (hybrid approach) |
| Git commit | git-workflow (NO AI co-author) |
| Finishing task | code-review → verification-before-completion |

## 🎓 Skills Philosophy

**Why skills are mandatory:**
- ✅ Accumulated wisdom from production incidents
- ✅ Prevents catastrophic errors (database wipes, security issues)
- ✅ Ensures consistent quality across all work
- ✅ Faster in the long run (fewer bugs, less rework)

**Common misconceptions:**
- ❌ "Skills slow me down" → Skills SAVE time by preventing errors
- ❌ "This is too simple for skills" → Simple tasks benefit most from consistency
- ❌ "I remember the process" → Skills ensure you don't forget steps

## 🔄 Session Start Actions

**Recommended at start of EVERY session:**

1. Run `/check-updates` (if >30 days since last check)
2. Confirm `.claude/skills/` exists and has 24 skills
3. Read `.claude/skills/README.md` to refresh skill awareness
4. Review skills relevant to today's work
5. Acknowledge ready to use skills framework

## 📊 Accountability

**At end of each task, ask yourself:**
- ✅ Did I check for relevant skills?
- ✅ Did I follow the skill protocol exactly?
- ✅ Did I use database-backup before ANY database operation?
- ✅ Did I follow the brainstorm → plan → execute → review → verify cycle?

**If NO to any:** Go back and do it properly.

---

**The Iron Law**: Skills are not optional. They are the accumulated wisdom of professional development and prevent catastrophic errors. Use them for EVERY task, no exceptions.

**Ready to start? Confirm:**
- [ ] Skills installed (24 total)
- [ ] Skills framework understood
- [ ] Commitment to use skills for ALL tasks
- [ ] Database-backup mandatory before ANY database operation

**Let's build great software together! 🚀**
