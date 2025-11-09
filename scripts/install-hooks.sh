#!/bin/bash
# Install CodeAssist Skills Framework Hooks
# Version: 3.1.1
# Date: 2025-11-08

set -e

echo "============================================"
echo "CodeAssist Skills Framework Hooks Installer"
echo "Version 3.1.1 - Hybrid Enforcement"
echo "============================================"
echo ""

# Check if in git repository
if [ ! -d ".git" ]; then
    echo "⚠️  Warning: Not a git repository"
    echo "   Some hooks require git (e.g., pre-commit)"
    echo ""
fi

# Create .claude directory if doesn't exist
mkdir -p .claude
mkdir -p hooks

# Base URL for fetching hooks
BASE_URL="https://raw.githubusercontent.com/liauw-media/CodeAssist/main"

# Function to fetch and install a hook
install_hook() {
    local hook_name=$1
    local hook_file="hooks/${hook_name}.sh"
    local url="${BASE_URL}/${hook_file}"

    echo "📥 Installing: $hook_name"

    # Fetch hook
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" -o "$hook_file"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$url" -O "$hook_file"
    else
        echo "❌ Error: Neither curl nor wget available"
        exit 1
    fi

    # Make executable
    chmod +x "$hook_file"

    echo "   ✅ Installed: $hook_file"
}

# Install decision tree (always loaded)
echo ""
echo "📋 Step 1: Installing Skills Decision Tree (Always Loaded)"
echo "   Token cost: ~200 tokens (always in context)"
echo ""

DECISION_TREE=".claude/SKILLS-DECISION-TREE.md"
curl -fsSL "${BASE_URL}/${DECISION_TREE}" -o "$DECISION_TREE"
echo "   ✅ Installed: $DECISION_TREE"

# Install settings configuration
echo ""
echo "⚙️  Step 2: Installing Settings Configuration"
echo ""

SETTINGS=".claude/settings.json"
if [ -f "$SETTINGS" ]; then
    echo "   ⚠️  $SETTINGS already exists"
    read -p "   Overwrite? (yes/NO): " OVERWRITE
    if [ "$OVERWRITE" = "yes" ]; then
        curl -fsSL "${BASE_URL}/${SETTINGS}" -o "$SETTINGS"
        echo "   ✅ Overwritten: $SETTINGS"
    else
        echo "   ⏭️  Skipped: $SETTINGS"
    fi
else
    curl -fsSL "${BASE_URL}/${SETTINGS}" -o "$SETTINGS"
    echo "   ✅ Installed: $SETTINGS"
fi

# Install hooks
echo ""
echo "🪝 Step 3: Installing Enforcement Hooks"
echo ""

install_hook "pre-database-operation"
install_hook "post-code-write"
install_hook "pre-commit-check"
install_hook "periodic-reminder"

echo ""
echo "✅ All hooks installed!"

# Configure hooks in Claude Code (if applicable)
echo ""
echo "🔧 Step 4: Hook Configuration"
echo ""

# Check if .claude/hooks.json exists
HOOKS_CONFIG=".claude/hooks.json"
if [ ! -f "$HOOKS_CONFIG" ]; then
    echo "   Creating hooks configuration..."

    cat > "$HOOKS_CONFIG" <<'EOF'
{
  "version": "3.1.1",
  "hooks": {
    "session-start": {
      "command": "./hooks/periodic-reminder.sh",
      "enabled": true,
      "description": "Load skills framework at session start"
    },
    "periodic": {
      "command": "./hooks/periodic-reminder.sh",
      "frequency": 10,
      "enabled": true,
      "description": "Skills check every 10 requests"
    },
    "pre-tool-use": {
      "Bash": {
        "command": "./hooks/pre-database-operation.sh \"$COMMAND\"",
        "enabled": true,
        "description": "Check for database operations before Bash execution"
      },
      "Edit": {
        "command": "./hooks/post-code-write.sh \"$FILE_PATH\"",
        "enabled": true,
        "description": "Remind about code review after editing"
      },
      "Write": {
        "command": "./hooks/post-code-write.sh \"$FILE_PATH\"",
        "enabled": true,
        "description": "Remind about code review after writing"
      }
    },
    "pre-commit": {
      "command": "./hooks/pre-commit-check.sh",
      "enabled": true,
      "description": "Verify code review and verification before commits"
    }
  }
}
EOF

    echo "   ✅ Created: $HOOKS_CONFIG"
else
    echo "   ✅ Hooks config already exists: $HOOKS_CONFIG"
fi

# Create tracking directory
echo ""
echo "📊 Step 5: Creating Tracking Directory"
echo ""

mkdir -p .claude
echo "0" > .claude/.request_count
echo "0" > .claude/.code_edits_count

echo "   ✅ Tracking directory ready"

# Installation summary
echo ""
echo "============================================"
echo "✅ INSTALLATION COMPLETE"
echo "============================================"
echo ""
echo "📦 Installed Components:"
echo "   ✅ Skills Decision Tree (.claude/SKILLS-DECISION-TREE.md)"
echo "   ✅ Settings Configuration (.claude/settings.json)"
echo "   ✅ 4 Enforcement Hooks (hooks/*.sh)"
echo "   ✅ Hooks Configuration (.claude/hooks.json)"
echo "   ✅ Tracking Directory (.claude/)"
echo ""
echo "🎯 Enforcement Mode: HYBRID (Blocking)"
echo ""
echo "Token Budget Presets:"
echo "   • Unlimited: No limits (quality first)"
echo "   • Balanced: ~20K tokens/100 requests (ACTIVE)"
echo "   • Efficient: ~10K tokens/100 requests"
echo "   • Minimal: ~5K tokens/100 requests"
echo ""
echo "   Change in: .claude/settings.json"
echo ""
echo "🛡️ Blocking Enforcement Enabled For:"
echo "   🛑 Database operations (migrate/test/seed) without backup"
echo "   🛑 Commits without code-review + verification"
echo "   🛑 3+ code edits without review"
echo ""
echo "📋 What Happens Next:"
echo ""
echo "1. Session Start:"
echo "   → Decision tree loaded (200 tokens)"
echo "   → Skills framework active"
echo ""
echo "2. Every 10 Requests:"
echo "   → Ultra-compact skills check (50 tokens)"
echo "   → USE READ ANNOUNCE / REVIEW VERIFY"
echo ""
echo "3. Critical Moments:"
echo "   → Database operation? → BLOCK until backup confirmed"
echo "   → Code written? → Remind about code-review"
echo "   → 3rd edit? → BLOCK until review done"
echo "   → Commit attempt? → BLOCK until verification done"
echo ""
echo "🔧 Manual Hook Execution (for testing):"
echo "   ./hooks/pre-database-operation.sh \"php artisan migrate\""
echo "   ./hooks/post-code-write.sh \"src/file.php\""
echo "   ./hooks/pre-commit-check.sh"
echo "   ./hooks/periodic-reminder.sh"
echo ""
echo "📖 Documentation:"
echo "   • Enforcement Guide: docs/SKILLS-ENFORCEMENT.md"
echo "   • Skills Index: .claude/skills/README.md"
echo "   • Decision Tree: .claude/SKILLS-DECISION-TREE.md"
echo ""
echo "✨ Hooks are now active! Skills framework will enforce automatically."
echo ""
