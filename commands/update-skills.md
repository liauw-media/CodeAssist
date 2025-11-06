---
description: Update local skills to latest CodeAssist version
---

# Update Skills Command

Update your local `.claude/skills/` directory to the latest CodeAssist skills framework.

## What This Does

1. Fetches the latest `install-skills.sh` from GitHub
2. Backs up your current skills (if any customizations exist)
3. Re-runs the installation to get all 24 latest skills
4. Reports what changed

## Execution Steps

```bash
# Backup existing skills (if customized)
if [ -d ".claude/skills" ]; then
  echo "📦 Backing up existing skills..."
  cp -r .claude/skills .claude/skills.backup.$(date +%Y%m%d-%H%M%S)
fi

# Fetch latest install script
echo "📥 Fetching latest skills installer..."
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh -o install-skills.sh
chmod +x install-skills.sh

# Run installation
echo "🎯 Installing latest skills..."
./install-skills.sh

# Verify installation
echo ""
echo "✅ Verifying installation..."
skill_count=$(find .claude/skills -name "SKILL.md" -type f | wc -l)
echo "📊 Skills installed: $skill_count (expected: 24)"

if [ "$skill_count" -eq 24 ]; then
  echo "✅ All skills successfully updated!"
else
  echo "⚠️  Warning: Expected 24 skills, found $skill_count"
  echo "Check .claude/skills/ directory"
fi

# Show what's new
echo ""
echo "📖 Key skills to check:"
echo "   - .claude/skills/README.md (skills index)"
echo "   - .claude/skills/using-skills/SKILL.md (mandatory protocol)"
echo "   - .claude/skills/safety/database-backup/SKILL.md (CRITICAL)"
echo ""
echo "🎯 Remember: Use using-skills protocol for EVERY task!"
```

## When to Use

- At the start of each project (ensure latest skills)
- When you see skill-related errors
- Monthly maintenance (get latest improvements)
- After CodeAssist releases new version
- When joining an existing project

## After Update

1. Read `.claude/skills/README.md` for any new skills
2. Check CHANGELOG for breaking changes
3. Verify critical skills still work (database-backup, using-skills)
4. Update your `.gitignore` or commit skills for team use

## Verification

```bash
# Check skills are properly installed
find .claude/skills -name "SKILL.md" -type f

# Should output 24 files
```

## Rollback (If Needed)

```bash
# If something breaks, restore backup
rm -rf .claude/skills
mv .claude/skills.backup.YYYYMMDD-HHMMSS .claude/skills
```

---

**The Iron Law**: Skills framework changes rarely, but when it does, update immediately - new skills may contain critical safety improvements.
