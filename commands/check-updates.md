---
description: Check for CodeAssist framework updates from GitHub
---

# Check Updates Command

Check if your local CodeAssist setup is up-to-date with the latest version on GitHub.

## What This Does

1. Fetches latest version info from GitHub
2. Compares with your local skills
3. Reports available updates
4. Provides update instructions

## Execution Steps

```bash
echo "🔍 Checking for CodeAssist updates..."
echo ""

# Fetch latest skills README to check version
echo "📥 Fetching latest version info..."
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md -o /tmp/codeassist-latest-readme.md

# Extract version from latest
latest_version=$(grep "^**Version**:" /tmp/codeassist-latest-readme.md | sed 's/.*: //' | tr -d '\r')
latest_updated=$(grep "^**Last Updated**:" /tmp/codeassist-latest-readme.md | sed 's/.*: //' | tr -d '\r')
latest_skills=$(grep "^**Total Skills**:" /tmp/codeassist-latest-readme.md | sed 's/.*: //' | cut -d' ' -f1 | tr -d '\r')

echo "📊 Latest CodeAssist Version:"
echo "   Version: $latest_version"
echo "   Updated: $latest_updated"
echo "   Skills: $latest_skills"
echo ""

# Check local version
if [ -f ".claude/skills/README.md" ]; then
  local_version=$(grep "^**Version**:" .claude/skills/README.md | sed 's/.*: //' | tr -d '\r')
  local_updated=$(grep "^**Last Updated**:" .claude/skills/README.md | sed 's/.*: //' | tr -d '\r')
  local_skills=$(find .claude/skills -name "SKILL.md" -type f | wc -l)

  echo "📂 Your Local Version:"
  echo "   Version: $local_version"
  echo "   Updated: $local_updated"
  echo "   Skills: $local_skills"
  echo ""

  # Compare
  if [ "$latest_version" != "$local_version" ] || [ "$latest_skills" != "$local_skills" ]; then
    echo "⚠️  UPDATE AVAILABLE!"
    echo ""
    echo "🔄 To update, run:"
    echo "   /update-skills"
    echo ""
    echo "📖 Or manually:"
    echo "   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh -o install-skills.sh"
    echo "   chmod +x install-skills.sh"
    echo "   ./install-skills.sh"
  else
    echo "✅ You're up to date!"
    echo ""
    echo "💡 Next check recommended: $(date -d '+30 days' 2>/dev/null || date -v+30d 2>/dev/null || echo 'in 30 days')"
  fi
else
  echo "❌ Skills not installed locally"
  echo ""
  echo "🎯 To install skills framework:"
  echo "   /update-skills"
  echo ""
  echo "📖 Or manually:"
  echo "   1. Read: https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills/README.md"
  echo "   2. Run: curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh | bash"
fi

echo ""
echo "📚 What's New:"
echo "   - Changelog: https://github.com/liauw-media/CodeAssist/blob/main/CHANGELOG.md"
echo "   - Skills Index: https://github.com/liauw-media/CodeAssist/blob/main/skills/README.md"
echo "   - Release Notes: https://github.com/liauw-media/CodeAssist/releases"

# Cleanup
rm -f /tmp/codeassist-latest-readme.md
```

## When to Use

- **At session start** (monthly check)
- Before starting major features
- When seeing skill-related errors
- After hearing about new CodeAssist release
- As part of maintenance routine

## What to Check After Update

1. **Skills Index**: Read `.claude/skills/README.md` for new skills
2. **CHANGELOG**: Check for breaking changes
3. **Critical Skills**: Verify `database-backup` and `using-skills` work
4. **Team Sync**: Update team if skills are committed to repo

## Automatic Check Recommendations

Add to your workflow:

**Option 1: Git Hook (recommended)**
```bash
# .git/hooks/post-checkout
#!/bin/bash
if [ ! -d ".claude/skills" ]; then
  echo "⚠️  Skills not found. Run: /update-skills"
fi
```

**Option 2: Shell Alias**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias codeassist-check='curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-skills.sh | bash'
```

**Option 3: Cron Job (monthly)**
```bash
# Check monthly
0 0 1 * * cd /path/to/project && /update-skills
```

---

**Remember**: CodeAssist updates include critical safety improvements (like database-backup). Stay current!
