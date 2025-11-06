#!/bin/bash
# setup-session-reminder.sh - Set up automatic skills reminder for projects
# Usage: ./scripts/setup-session-reminder.sh

set -e

echo "🎯 Setting up CodeAssist session reminder..."
echo ""

# Create .claude directory if it doesn't exist
mkdir -p .claude

# Create session reminder file
cat > .claude/SESSION_START.md << 'EOF'
# 🎯 CodeAssist Skills Framework

**Before starting work, check:**

1. ✅ Skills installed: `find .claude/skills -name "SKILL.md" | wc -l` (should be 24)
2. ✅ Skills up to date: `/check-updates` (check monthly)
3. ✅ Using-skills protocol: Read `.claude/skills/using-skills/SKILL.md`

## Quick Start

**For EVERY task:**
1. Check `.claude/skills/README.md` for relevant skills
2. Read the specific skill file
3. Announce which skill you're using
4. Execute the skill protocol

## Critical Reminders

- 🛡️ **database-backup** - MANDATORY before ANY database operation
- 📋 **using-skills** - MANDATORY for ALL tasks
- 🔄 **Workflow**: brainstorm → plan → execute → review → verify

## Commands

- `/check-updates` - Check for CodeAssist framework updates
- `/update-skills` - Update local skills to latest version
- `/session-start` - Show full session start checklist

---

**Ready?** Confirm skills installed and protocol understood before proceeding.
EOF

echo "✅ Session reminder created: .claude/SESSION_START.md"
echo ""

# Create .gitignore entry for skills (optional)
if [ -f ".gitignore" ]; then
  if ! grep -q "\.claude/skills/" .gitignore; then
    echo ""
    read -p "Add .claude/skills/ to .gitignore? (team can install individually) [y/N] " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "" >> .gitignore
      echo "# CodeAssist skills (install via /update-skills)" >> .gitignore
      echo ".claude/skills/" >> .gitignore
      echo "✅ Added to .gitignore"
    else
      echo "ℹ️  Skills will be committed (team shares same skills)"
    fi
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Session reminder setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "   1. Read: .claude/SESSION_START.md (quick reminder)"
echo "   2. Run: /update-skills (install skills if not present)"
echo "   3. Run: /session-start (full checklist)"
echo ""
echo "💡 Tip: Read .claude/SESSION_START.md at the start of each work session"
echo ""
