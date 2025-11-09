#!/bin/bash
# Post-Code Write Hook
# REMINDS about code-review after writing code
# Triggered: After Edit or Write tools used

set -e

# Hook metadata
HOOK_NAME="post-code-write"
HOOK_VERSION="3.1.1"

# Track how many code edits since last review
CODE_EDITS_FILE=".claude/.code_edits_count"
mkdir -p .claude

# Increment edit counter
if [ -f "$CODE_EDITS_FILE" ]; then
    EDITS=$(cat "$CODE_EDITS_FILE")
    EDITS=$((EDITS + 1))
else
    EDITS=1
fi
echo "$EDITS" > "$CODE_EDITS_FILE"

# Get file that was modified
MODIFIED_FILE="${1:-unknown}"

echo ""
echo "📝 CODE MODIFIED: $MODIFIED_FILE"
echo "   (Edit #$EDITS since last review)"
echo ""

# If 3+ edits without review, escalate to BLOCKING
if [ $EDITS -ge 3 ]; then
    echo "🛑 ============================================ 🛑"
    echo "   CODE REVIEW REQUIRED - BLOCKING"
    echo "🛑 ============================================ 🛑"
    echo ""
    echo "⚠️  You've made $EDITS code changes without review"
    echo ""
    echo "📖 MANDATORY: Use code-review skill NOW"
    echo "   .claude/skills/core/code-review/SKILL.md"
    echo ""
    echo "✅ Required Actions:"
    echo ""
    echo "1. Announce: 'I'm using code-review skill to review implementation'"
    echo "2. Review ALL code changes made"
    echo "3. Run ALL tests"
    echo "4. Verify ALL tests pass"
    echo "5. Fix any issues found"
    echo ""
    echo "🔴 AUTHORITY: 60% of bugs caught during code review"
    echo "   Skipping review = shipping bugs"
    echo ""
    echo "After review, reset counter:"
    echo "   rm $CODE_EDITS_FILE"
    echo ""

    # BLOCK further operations
    exit 1
elif [ $EDITS -ge 1 ]; then
    # Gentle reminder for 1-2 edits
    echo "💡 REMINDER: code-review skill after implementation"
    echo ""
    echo "Code Review Checkpoint:"
    echo "□ Did I use code-review skill?"
    echo "□ Did I ANNOUNCE using it?"
    echo "□ Did I write tests?"
    echo "□ Did I RUN tests?"
    echo "□ Did ALL tests PASS?"
    echo ""
    echo "If ready to review now:"
    echo "   1. Read: .claude/skills/core/code-review/SKILL.md"
    echo "   2. Complete review"
    echo "   3. Reset counter: rm $CODE_EDITS_FILE"
    echo ""
    echo "Continuing (will block at 3 edits)..."
    echo ""
fi

exit 0
