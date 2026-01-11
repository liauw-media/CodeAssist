#!/bin/bash

# ============================================
# playwright-report-sync.sh - Sync Playwright reports to NAS
# ============================================
#
# Usage:
#   ./scripts/playwright-report-sync.sh                    # Sync default report
#   ./scripts/playwright-report-sync.sh ./custom-report    # Sync custom path
#   ./scripts/playwright-report-sync.sh --trace-only       # Sync only traces
#
# Environment variables (or set in .playwright-report.env):
#   PLAYWRIGHT_NAS_HOST=nas.tailnet.ts.net     # Tailscale hostname of NAS
#   PLAYWRIGHT_NAS_PATH=/reports               # Remote path on NAS
#   PLAYWRIGHT_NAS_USER=user                   # SSH user (default: current user)
#   PLAYWRIGHT_REPORT_RETENTION=30             # Days to keep reports (default: 30)
#
# The script will:
#   1. Generate HTML report if not exists
#   2. Create timestamped directory on NAS
#   3. Sync report files via rsync over Tailscale
#   4. Output direct link to view results
#
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Load config from file if exists
CONFIG_FILES=(
    ".playwright-report.env"
    "$HOME/.config/codeassist/playwright-report.env"
    "$HOME/.playwright-report.env"
)

for config in "${CONFIG_FILES[@]}"; do
    if [ -f "$config" ]; then
        source "$config"
        echo -e "${BLUE}Loaded config from: $config${NC}"
        break
    fi
done

# Defaults
NAS_HOST="${PLAYWRIGHT_NAS_HOST:-}"
NAS_PATH="${PLAYWRIGHT_NAS_PATH:-/volume1/playwright-reports}"
NAS_USER="${PLAYWRIGHT_NAS_USER:-$USER}"
RETENTION_DAYS="${PLAYWRIGHT_REPORT_RETENTION:-30}"
REPORT_DIR="${1:-playwright-report}"
TRACE_DIR="test-results"

# Parse arguments
TRACE_ONLY=0
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --trace-only) TRACE_ONLY=1; shift ;;
        --help|-h)
            echo "Usage: $0 [options] [report-dir]"
            echo ""
            echo "Options:"
            echo "  --trace-only    Only sync trace files"
            echo "  --help          Show this help"
            echo ""
            echo "Environment variables:"
            echo "  PLAYWRIGHT_NAS_HOST     Tailscale hostname (required)"
            echo "  PLAYWRIGHT_NAS_PATH     Remote path (default: /volume1/playwright-reports)"
            echo "  PLAYWRIGHT_NAS_USER     SSH user (default: current user)"
            echo ""
            echo "Config file locations (first found is used):"
            echo "  .playwright-report.env"
            echo "  ~/.config/codeassist/playwright-report.env"
            echo "  ~/.playwright-report.env"
            exit 0
            ;;
        *) REPORT_DIR="$1"; shift ;;
    esac
done

echo "Playwright Report Sync"
echo "======================"
echo ""

# Validate NAS host
if [ -z "$NAS_HOST" ]; then
    echo -e "${RED}Error: PLAYWRIGHT_NAS_HOST not set${NC}"
    echo ""
    echo "Set it in your environment or create a config file:"
    echo ""
    echo "  # .playwright-report.env"
    echo "  PLAYWRIGHT_NAS_HOST=your-nas.tailnet.ts.net"
    echo "  PLAYWRIGHT_NAS_PATH=/volume1/playwright-reports"
    echo ""
    exit 1
fi

# Check if NAS is reachable via Tailscale
echo "Step 1: Checking NAS connectivity"
if ! ping -c 1 -W 2 "$NAS_HOST" >/dev/null 2>&1; then
    echo -e "${RED}Error: Cannot reach $NAS_HOST${NC}"
    echo ""
    echo "Make sure:"
    echo "  1. Tailscale is running: tailscale status"
    echo "  2. NAS hostname is correct"
    echo "  3. NAS is online and connected to Tailscale"
    exit 1
fi
echo -e "${GREEN}NAS reachable at $NAS_HOST${NC}"

# Generate timestamp for this run
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
RUN_ID="${TIMESTAMP}_${GIT_SHA}"

# Check for report/traces to sync
echo ""
echo "Step 2: Preparing reports"

SYNC_ITEMS=()

if [ "$TRACE_ONLY" = "0" ]; then
    # Check for HTML report
    if [ -d "$REPORT_DIR" ]; then
        echo -e "${GREEN}Found HTML report: $REPORT_DIR${NC}"
        SYNC_ITEMS+=("$REPORT_DIR")
    elif [ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ]; then
        echo -e "${YELLOW}No HTML report found. Generating...${NC}"
        npx playwright show-report --host 127.0.0.1 &
        SHOW_PID=$!
        sleep 2
        kill $SHOW_PID 2>/dev/null || true

        if [ -d "$REPORT_DIR" ]; then
            echo -e "${GREEN}Generated HTML report${NC}"
            SYNC_ITEMS+=("$REPORT_DIR")
        fi
    fi
fi

# Check for trace files
if [ -d "$TRACE_DIR" ]; then
    TRACE_COUNT=$(find "$TRACE_DIR" -name "*.zip" 2>/dev/null | wc -l)
    if [ "$TRACE_COUNT" -gt 0 ]; then
        echo -e "${GREEN}Found $TRACE_COUNT trace file(s) in $TRACE_DIR${NC}"
        SYNC_ITEMS+=("$TRACE_DIR")
    fi
fi

if [ ${#SYNC_ITEMS[@]} -eq 0 ]; then
    echo -e "${RED}Error: No reports or traces found to sync${NC}"
    echo ""
    echo "Run your Playwright tests first:"
    echo "  npx playwright test"
    echo "  npx playwright test --reporter=html"
    echo "  npx playwright test --trace=on"
    exit 1
fi

# Create remote directory
echo ""
echo "Step 3: Creating remote directory"
REMOTE_PATH="$NAS_PATH/$RUN_ID"
ssh "${NAS_USER}@${NAS_HOST}" "mkdir -p '$REMOTE_PATH'" 2>/dev/null || {
    echo -e "${RED}Error: Cannot create directory on NAS${NC}"
    echo "Check SSH access: ssh ${NAS_USER}@${NAS_HOST}"
    exit 1
}
echo -e "${GREEN}Created: $REMOTE_PATH${NC}"

# Sync files
echo ""
echo "Step 4: Syncing files"
for item in "${SYNC_ITEMS[@]}"; do
    echo -e "  Syncing ${BLUE}$item${NC}..."
    rsync -avz --progress "$item" "${NAS_USER}@${NAS_HOST}:${REMOTE_PATH}/" 2>/dev/null || {
        # Fallback to scp if rsync not available
        echo -e "${YELLOW}rsync not available, using scp...${NC}"
        scp -r "$item" "${NAS_USER}@${NAS_HOST}:${REMOTE_PATH}/"
    }
done

# Update 'latest' symlink
echo ""
echo "Step 5: Updating 'latest' symlink"
ssh "${NAS_USER}@${NAS_HOST}" "cd '$NAS_PATH' && rm -f latest && ln -s '$RUN_ID' latest"
echo -e "${GREEN}Updated latest -> $RUN_ID${NC}"

# Generate access URL
# Assumes tailscale serve is configured on port 8080
REPORT_URL="https://${NAS_HOST}:8080/${RUN_ID}/playwright-report/index.html"
LATEST_URL="https://${NAS_HOST}:8080/latest/playwright-report/index.html"

echo ""
echo "============================================"
echo -e "${GREEN}Reports synced successfully!${NC}"
echo "============================================"
echo ""
echo "View this run:"
echo -e "  ${BLUE}${REPORT_URL}${NC}"
echo ""
echo "View latest (always points to most recent):"
echo -e "  ${BLUE}${LATEST_URL}${NC}"
echo ""

# Check for traces and provide trace viewer links
if [ -d "$TRACE_DIR" ]; then
    TRACE_FILES=$(find "$TRACE_DIR" -name "*.zip" 2>/dev/null | head -5)
    if [ -n "$TRACE_FILES" ]; then
        echo "Trace files available at:"
        echo -e "  ${BLUE}https://${NAS_HOST}:8080/${RUN_ID}/test-results/${NC}"
        echo ""
        echo "To view traces locally:"
        echo "  npx playwright show-trace <trace-url>"
        echo ""
    fi
fi

# Optional: Trigger cleanup of old reports
if command -v ssh >/dev/null 2>&1; then
    OLD_COUNT=$(ssh "${NAS_USER}@${NAS_HOST}" "find '$NAS_PATH' -maxdepth 1 -type d -mtime +${RETENTION_DAYS} 2>/dev/null | wc -l")
    if [ "$OLD_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}Note: $OLD_COUNT report(s) older than $RETENTION_DAYS days${NC}"
        echo "Run cleanup: ssh ${NAS_USER}@${NAS_HOST} 'find $NAS_PATH -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;'"
    fi
fi

exit 0
