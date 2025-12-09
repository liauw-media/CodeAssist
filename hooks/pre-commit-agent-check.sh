#!/bin/bash

# ============================================
# Pre-Commit Agent Enforcement Hook
# Blocks commits without proper agent workflow
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check for agent state file
AGENT_STATE=".claude/agent-state.json"

echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}   PRE-COMMIT AGENT ENFORCEMENT CHECK${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check 1: Was code-reviewer agent run?
check_review() {
    if [ -f "$AGENT_STATE" ]; then
        LAST_REVIEW=$(cat "$AGENT_STATE" | grep -o '"last_review":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "never")
        LAST_CODE_CHANGE=$(cat "$AGENT_STATE" | grep -o '"last_code_change":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "never")

        if [ "$LAST_REVIEW" != "never" ] && [ "$LAST_CODE_CHANGE" != "never" ]; then
            if [ "$LAST_REVIEW" \> "$LAST_CODE_CHANGE" ] || [ "$LAST_REVIEW" == "$LAST_CODE_CHANGE" ]; then
                echo -e "${GREEN}✓ Code review completed after last change${NC}"
                return 0
            fi
        fi
    fi

    echo -e "${RED}✗ Code review NOT completed${NC}"
    echo ""
    echo -e "${YELLOW}Run the code-reviewer agent before committing:${NC}"
    echo "  /review [description of changes]"
    echo ""
    return 1
}

# Check 2: Were tests run?
check_tests() {
    if [ -f "$AGENT_STATE" ]; then
        TESTS_PASSED=$(cat "$AGENT_STATE" | grep -o '"tests_passed":true' 2>/dev/null || echo "")

        if [ -n "$TESTS_PASSED" ]; then
            echo -e "${GREEN}✓ Tests passed${NC}"
            return 0
        fi
    fi

    echo -e "${RED}✗ Tests NOT verified${NC}"
    echo ""
    echo -e "${YELLOW}Run tests with the testing agent:${NC}"
    echo "  /test run all tests"
    echo ""
    return 1
}

# Check 3: Database backup (if DB files changed)
check_db_backup() {
    # Check if any migration or database files are staged
    DB_FILES=$(git diff --cached --name-only | grep -E "(migration|database|\.sql)" || true)

    if [ -n "$DB_FILES" ]; then
        if [ -f "$AGENT_STATE" ]; then
            BACKUP_TAKEN=$(cat "$AGENT_STATE" | grep -o '"db_backup_taken":true' 2>/dev/null || echo "")

            if [ -n "$BACKUP_TAKEN" ]; then
                echo -e "${GREEN}✓ Database backup verified${NC}"
                return 0
            fi
        fi

        echo -e "${RED}✗ Database files changed but NO BACKUP verified${NC}"
        echo ""
        echo -e "${YELLOW}Database changes detected:${NC}"
        echo "$DB_FILES"
        echo ""
        echo -e "${YELLOW}Take backup first:${NC}"
        echo "  ./scripts/backup-database.sh"
        echo "  OR use: /db [your task]"
        echo ""
        return 1
    fi

    echo -e "${GREEN}✓ No database changes (backup not required)${NC}"
    return 0
}

# Run all checks
FAILED=0

check_review || FAILED=1
check_tests || FAILED=1
check_db_backup || FAILED=1

echo ""

if [ $FAILED -eq 1 ]; then
    echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
    echo -e "${RED}   COMMIT BLOCKED - Complete agent workflow first${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Required workflow:${NC}"
    echo "  1. Implement with /laravel, /react, or /python"
    echo "  2. Test with /test"
    echo "  3. Review with /review"
    echo "  4. Then commit"
    echo ""
    echo -e "${YELLOW}To bypass (NOT recommended):${NC}"
    echo "  git commit --no-verify"
    echo ""
    exit 1
fi

echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ALL CHECKS PASSED - Commit allowed${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""

exit 0
