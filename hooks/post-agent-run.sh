#!/bin/bash

# ============================================
# Post-Agent Run Hook
# Updates agent state tracking
# ============================================

AGENT_STATE=".claude/agent-state.json"
AGENT_NAME="$1"
STATUS="$2"  # success, failed
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Ensure directory exists
mkdir -p .claude

# Initialize state file if doesn't exist
if [ ! -f "$AGENT_STATE" ]; then
    echo '{}' > "$AGENT_STATE"
fi

# Update state based on agent
case "$AGENT_NAME" in
    "code-reviewer"|"review")
        if [ "$STATUS" == "success" ]; then
            # Use temporary file for safe update
            jq --arg ts "$TIMESTAMP" '. + {last_review: $ts}' "$AGENT_STATE" > "${AGENT_STATE}.tmp" && mv "${AGENT_STATE}.tmp" "$AGENT_STATE"
        fi
        ;;
    "testing-agent"|"test")
        if [ "$STATUS" == "success" ]; then
            jq --arg ts "$TIMESTAMP" '. + {last_test: $ts, tests_passed: true}' "$AGENT_STATE" > "${AGENT_STATE}.tmp" && mv "${AGENT_STATE}.tmp" "$AGENT_STATE"
        else
            jq '. + {tests_passed: false}' "$AGENT_STATE" > "${AGENT_STATE}.tmp" && mv "${AGENT_STATE}.tmp" "$AGENT_STATE"
        fi
        ;;
    "database-specialist"|"db")
        if [ "$STATUS" == "success" ]; then
            jq --arg ts "$TIMESTAMP" '. + {last_db_operation: $ts, db_backup_taken: true}' "$AGENT_STATE" > "${AGENT_STATE}.tmp" && mv "${AGENT_STATE}.tmp" "$AGENT_STATE"
        fi
        ;;
    "laravel-developer"|"react-developer"|"python-developer"|"laravel"|"react"|"python")
        jq --arg ts "$TIMESTAMP" --arg agent "$AGENT_NAME" '. + {last_code_change: $ts, last_dev_agent: $agent, tests_passed: false}' "$AGENT_STATE" > "${AGENT_STATE}.tmp" && mv "${AGENT_STATE}.tmp" "$AGENT_STATE"
        ;;
esac

echo "Agent state updated: $AGENT_NAME ($STATUS) at $TIMESTAMP"
