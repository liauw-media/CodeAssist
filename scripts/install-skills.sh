#!/bin/bash
# install-skills.sh - Install all CodeAssist skills locally
# Usage: ./scripts/install-skills.sh

set -e

SKILLS_BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main/skills"

echo "🎯 Installing CodeAssist Skills Framework..."
echo ""

# Create base directory
mkdir -p skills

# Fetch skills index
echo "📋 Fetching skills index..."
curl -fsSL "$SKILLS_BASE_URL/README.md" -o skills/README.md
echo "✅ Skills index installed"
echo ""

# Function to fetch skill
fetch_skill() {
    local path=$1
    mkdir -p "skills/$(dirname "$path")"
    curl -fsSL "$SKILLS_BASE_URL/$path" -o "skills/$path" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ $path"
    else
        echo "❌ Failed: $path"
    fi
}

echo "📦 Installing core skills..."
fetch_skill "using-skills/SKILL.md"
fetch_skill "core/brainstorming/SKILL.md"
fetch_skill "core/writing-plans/SKILL.md"
fetch_skill "core/executing-plans/SKILL.md"
fetch_skill "core/code-review/SKILL.md"
fetch_skill "core/requesting-code-review/SKILL.md"
fetch_skill "core/receiving-code-review/SKILL.md"
fetch_skill "core/verification-before-completion/SKILL.md"

echo ""
echo "🛡️  Installing safety skills (CRITICAL)..."
fetch_skill "safety/database-backup/SKILL.md"
fetch_skill "safety/defense-in-depth/SKILL.md"

echo ""
echo "🧪 Installing testing skills..."
fetch_skill "testing/test-driven-development/SKILL.md"
fetch_skill "testing/condition-based-waiting/SKILL.md"
fetch_skill "testing/testing-anti-patterns/SKILL.md"
fetch_skill "testing/playwright-frontend-testing/SKILL.md"

echo ""
echo "🔍 Installing debugging skills..."
fetch_skill "debugging/systematic-debugging/SKILL.md"
fetch_skill "debugging/root-cause-tracing/SKILL.md"

echo ""
echo "🔀 Installing workflow skills..."
fetch_skill "workflow/git-workflow/SKILL.md"
fetch_skill "workflow/git-worktrees/SKILL.md"
fetch_skill "workflow/dispatching-parallel-agents/SKILL.md"
fetch_skill "workflow/finishing-a-development-branch/SKILL.md"
fetch_skill "workflow/subagent-driven-development/SKILL.md"

echo ""
echo "📚 Installing meta skills..."
fetch_skill "meta/writing-skills/SKILL.md"
fetch_skill "meta/writing-skills/anthropic-best-practices.md"
fetch_skill "meta/writing-skills/persuasion-principles.md"
fetch_skill "meta/testing-skills-with-subagents/SKILL.md"
fetch_skill "meta/sharing-skills/SKILL.md"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Skills framework installation complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Total skills installed: 24"
echo "📂 Location: ./skills/"
echo ""
echo "📖 Next steps:"
echo "   1. Read: skills/README.md (complete index)"
echo "   2. Start with: skills/using-skills/SKILL.md (mandatory protocol)"
echo "   3. Critical safety: skills/safety/database-backup/SKILL.md"
echo ""
echo "🎯 Use skills for every task - check using-skills protocol!"
echo ""
