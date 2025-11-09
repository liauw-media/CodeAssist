#!/bin/bash
# Periodic Reminder Hook
# Lightweight skills framework check every 10 requests
# Triggered: Every 10 user requests

set -e

# Hook metadata
HOOK_NAME="periodic-reminder"
HOOK_VERSION="3.1.1"

# Track request count
REQUEST_COUNT_FILE=".claude/.request_count"
mkdir -p .claude

# Increment request counter
if [ -f "$REQUEST_COUNT_FILE" ]; then
    COUNT=$(cat "$REQUEST_COUNT_FILE")
    COUNT=$((COUNT + 1))
else
    COUNT=1
fi
echo "$COUNT" > "$REQUEST_COUNT_FILE"

# Check if it's time for reminder (every 10 requests)
if [ $((COUNT % 10)) -eq 0 ]; then
    echo ""
    echo "⚠️  =============================================== ⚠️"
    echo "    SKILLS FRAMEWORK CHECK (#$COUNT)"
    echo "⚠️  =============================================== ⚠️"
    echo ""
    echo "Ultra-Compact Checklist:"
    echo ""
    echo "□ USE (not skip)"
    echo "□ READ (not remember)"
    echo "□ ANNOUNCE"
    echo "□ WORKFLOW: brainstorm→plan→execute→REVIEW→verify→commit"
    echo "□ CONSISTENT (same across all projects)"
    echo ""
    echo "CRITICAL:"
    echo "  Did I REVIEW code after writing?"
    echo "  Did I VERIFY before commit?"
    echo ""
    echo "If ANY box unchecked: STOP and recommit to framework"
    echo ""
    echo "📖 If skills framework feels 'lost':"
    echo "   1. STOP ALL WORK"
    echo "   2. Read: docs/SKILLS-ENFORCEMENT.md"
    echo "   3. Read: .claude/skills/using-skills/SKILL.md"
    echo "   4. Re-commit to framework"
    echo "   5. Resume work"
    echo ""
    echo "Last reminder: Request #$COUNT"
    echo "Next reminder: Request #$((COUNT + 10))"
    echo ""
fi

exit 0
