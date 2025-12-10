#!/bin/bash

# ============================================
# safe-test.sh - Run tests with backup + resource limits
# ============================================
#
# Usage:
#   ./scripts/safe-test.sh                    # Auto-detect framework
#   ./scripts/safe-test.sh vendor/bin/pest    # Specific command
#   ./scripts/safe-test.sh --no-limit pytest  # Disable limits (local dev)
#
# Environment variables:
#   CODEASSIST_NO_LIMIT=1     # Disable resource limits
#   CODEASSIST_CPU_LIMIT=50   # CPU percentage limit (default: 50)
#
# The script will:
#   1. Detect if this is a shared server (nginx/apache running)
#   2. Create a database backup
#   3. Run tests with resource limits (unless disabled)
#
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Defaults
CPU_LIMIT="${CODEASSIST_CPU_LIMIT:-50}"
NO_LIMIT="${CODEASSIST_NO_LIMIT:-0}"

# Parse arguments
if [ "$1" = "--no-limit" ]; then
    NO_LIMIT=1
    shift
fi

# Detect if shared server (web server running)
is_shared_server() {
    pgrep -x nginx >/dev/null 2>&1 && return 0
    pgrep -x apache2 >/dev/null 2>&1 && return 0
    pgrep -x httpd >/dev/null 2>&1 && return 0
    pgrep -x php-fpm >/dev/null 2>&1 && return 0
    return 1
}

# Detect test framework
detect_framework() {
    if [ -f "vendor/bin/pest" ]; then
        echo "vendor/bin/pest"
    elif [ -f "vendor/bin/phpunit" ]; then
        echo "vendor/bin/phpunit"
    elif [ -f "package.json" ] && grep -q '"test"' package.json 2>/dev/null; then
        echo "npm test"
    elif [ -f "pytest.ini" ] || [ -f "pyproject.toml" ]; then
        echo "pytest"
    else
        echo ""
    fi
}

echo "Safe Test Runner"
echo "================"
echo ""

# Get test command
if [ -n "$1" ]; then
    TEST_CMD="$@"
else
    TEST_CMD=$(detect_framework)
    if [ -z "$TEST_CMD" ]; then
        echo -e "${RED}Error: No test framework detected${NC}"
        echo ""
        echo "Usage: ./scripts/safe-test.sh [test command]"
        echo ""
        echo "Examples:"
        echo "  ./scripts/safe-test.sh npm test"
        echo "  ./scripts/safe-test.sh vendor/bin/pest"
        echo "  ./scripts/safe-test.sh pytest"
        echo ""
        echo "Or set CODEASSIST_NO_LIMIT=1 to disable resource limits"
        exit 1
    fi
fi

# Check environment
SHARED_SERVER=0
if is_shared_server; then
    SHARED_SERVER=1
    echo -e "${YELLOW}Environment: Shared server (web server detected)${NC}"
else
    echo -e "${GREEN}Environment: Local/dedicated${NC}"
fi

# Step 1: Create backup
echo ""
echo "Step 1: Database backup"
if [ -f "./scripts/backup-database.sh" ]; then
    if ./scripts/backup-database.sh; then
        echo -e "${GREEN}Backup created${NC}"
    else
        echo -e "${YELLOW}Backup skipped (script failed)${NC}"
    fi
else
    echo -e "${YELLOW}Backup skipped (no backup script)${NC}"
fi

# Step 2: Prepare command with resource limits
echo ""
echo "Step 2: Running tests"

if [ "$NO_LIMIT" = "1" ]; then
    # No limits - run directly
    FINAL_CMD="$TEST_CMD"
    echo -e "${YELLOW}Resource limits: DISABLED${NC}"
elif [ "$SHARED_SERVER" = "1" ]; then
    # Shared server - apply limits
    LIMIT_PREFIX="nice -n 19 ionice -c 3"

    # Check if cpulimit is available
    if command -v cpulimit >/dev/null 2>&1; then
        LIMIT_PREFIX="$LIMIT_PREFIX cpulimit -l $CPU_LIMIT --"
        echo -e "${GREEN}Resource limits: nice + ionice + cpulimit (${CPU_LIMIT}% CPU)${NC}"
    else
        echo -e "${GREEN}Resource limits: nice + ionice (install cpulimit for CPU cap)${NC}"
    fi

    # Add single-process flag for known frameworks
    case "$TEST_CMD" in
        *pest*|*phpunit*)
            TEST_CMD="$TEST_CMD --processes=1"
            ;;
    esac

    FINAL_CMD="$LIMIT_PREFIX $TEST_CMD"
else
    # Local - still use nice but no hard limits
    FINAL_CMD="nice -n 10 $TEST_CMD"
    echo -e "${GREEN}Resource limits: nice (light)${NC}"
fi

echo -e "Command: ${GREEN}$FINAL_CMD${NC}"
echo ""

# Run tests
eval $FINAL_CMD
EXIT_CODE=$?

# Report results
echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}Tests passed${NC}"
else
    echo -e "${RED}Tests failed (exit code: $EXIT_CODE)${NC}"
    echo ""
    echo "To restore database from backup:"
    echo "  ./scripts/restore-database.sh --latest"
fi

exit $EXIT_CODE
