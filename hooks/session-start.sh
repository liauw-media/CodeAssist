#!/bin/bash

# Session Start Hook
# Loads the using-skills skill at session start to ensure mandatory protocol

set -e

# Determine plugin root
PLUGIN_ROOT="${PLUGIN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

# Path to using-skills skill
SKILL_FILE="${PLUGIN_ROOT}/skills/using-skills/SKILL.md"

# Check if skill exists
if [ ! -f "$SKILL_FILE" ]; then
    echo "Error: using-skills SKILL.md not found at $SKILL_FILE"
    exit 1
fi

# Read skill content
SKILL_CONTENT=$(cat "$SKILL_FILE")

# Output JSON for Claude to consume
cat <<EOF
{
  "hookEventName": "SessionStart",
  "hookName": "session-start",
  "additionalContext": "$(echo "$SKILL_CONTENT" | jq -Rs .)",
  "message": "CodeAssist skills framework loaded. Remember: Check skills BEFORE starting any task. The using-skills protocol is MANDATORY for all requests.",
  "priority": "critical"
}
EOF
