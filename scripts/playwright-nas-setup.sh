#!/bin/bash

# ============================================
# playwright-nas-setup.sh - Configure NAS to serve Playwright reports
# ============================================
#
# Run this script ON YOUR NAS to set up report serving.
#
# Usage:
#   ./playwright-nas-setup.sh              # Interactive setup
#   ./playwright-nas-setup.sh --port 8080  # Specify port
#
# Prerequisites:
#   - Tailscale installed and running on NAS
#   - SSH access to NAS
#
# What this script does:
#   1. Creates report directory structure
#   2. Configures tailscale serve to host reports
#   3. Sets up cleanup cron job
#   4. Provides connection info
#
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Defaults
REPORT_DIR="${PLAYWRIGHT_REPORT_DIR:-/volume1/playwright-reports}"
SERVE_PORT="${PLAYWRIGHT_SERVE_PORT:-8080}"
RETENTION_DAYS="${PLAYWRIGHT_REPORT_RETENTION:-30}"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --port) SERVE_PORT="$2"; shift 2 ;;
        --dir) REPORT_DIR="$2"; shift 2 ;;
        --retention) RETENTION_DAYS="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --port NUM       Port to serve on (default: 8080)"
            echo "  --dir PATH       Report directory (default: /volume1/playwright-reports)"
            echo "  --retention DAYS Days to keep reports (default: 30)"
            echo "  --help           Show this help"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

echo "Playwright NAS Setup"
echo "===================="
echo ""

# Check if running on NAS (or at least has tailscale)
if ! command -v tailscale >/dev/null 2>&1; then
    echo -e "${RED}Error: Tailscale not found${NC}"
    echo ""
    echo "Install Tailscale first:"
    echo "  Synology: https://tailscale.com/kb/1131/synology"
    echo "  QNAP: https://tailscale.com/kb/1273/qnap"
    echo "  TrueNAS: https://tailscale.com/kb/1274/truenas"
    echo "  Linux: curl -fsSL https://tailscale.com/install.sh | sh"
    exit 1
fi

# Check tailscale status
echo "Step 1: Checking Tailscale status"
if ! tailscale status >/dev/null 2>&1; then
    echo -e "${RED}Error: Tailscale not connected${NC}"
    echo "Run: sudo tailscale up"
    exit 1
fi

HOSTNAME=$(tailscale status --json | grep -o '"Self":{[^}]*"HostName":"[^"]*"' | grep -o '"HostName":"[^"]*"' | cut -d'"' -f4 2>/dev/null || hostname)
TAILNET=$(tailscale status --json | grep -o '"MagicDNSSuffix":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "your-tailnet.ts.net")

echo -e "${GREEN}Connected as: ${HOSTNAME}.${TAILNET}${NC}"

# Create directory structure
echo ""
echo "Step 2: Creating directory structure"
if [ ! -d "$REPORT_DIR" ]; then
    mkdir -p "$REPORT_DIR"
    echo -e "${GREEN}Created: $REPORT_DIR${NC}"
else
    echo -e "${BLUE}Already exists: $REPORT_DIR${NC}"
fi

# Set permissions (readable by web server)
chmod 755 "$REPORT_DIR"

# Create index.html for directory listing
cat > "$REPORT_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Reports</title>
    <style>
        :root { --bg: #1a1a2e; --card: #16213e; --accent: #e94560; --text: #eee; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; min-height: 100vh; }
        h1 { margin-bottom: 1rem; color: var(--accent); }
        .info { background: var(--card); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
        .reports { display: grid; gap: 1rem; }
        .report { background: var(--card); padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
        .report:hover { background: #1f2b47; }
        a { color: var(--accent); text-decoration: none; }
        a:hover { text-decoration: underline; }
        .latest { border: 2px solid var(--accent); }
        .date { color: #888; font-size: 0.9rem; }
        code { background: #0f0f1a; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem; }
    </style>
</head>
<body>
    <h1>Playwright Test Reports</h1>
    <div class="info">
        <p><strong>Latest report:</strong> <a href="latest/playwright-report/index.html">View Latest</a></p>
        <p style="margin-top: 0.5rem; color: #888;">Reports are automatically cleaned up after 30 days.</p>
    </div>
    <div class="reports" id="reports">
        <p>Loading reports...</p>
    </div>
    <script>
        // This is a static page - for dynamic listing, use a simple file server
        // or generate this page during sync
        document.getElementById('reports').innerHTML = `
            <p style="color: #888;">
                Browse directories manually or use the "latest" link above.<br>
                Report URLs follow the pattern: <code>/YYYY-MM-DD_HH-MM-SS_gitsha/playwright-report/</code>
            </p>
        `;
    </script>
</body>
</html>
EOF
echo -e "${GREEN}Created index.html${NC}"

# Configure tailscale serve
echo ""
echo "Step 3: Configuring Tailscale Serve"

# Check if already serving
CURRENT_SERVE=$(tailscale serve status 2>/dev/null || echo "")
if echo "$CURRENT_SERVE" | grep -q "$REPORT_DIR"; then
    echo -e "${BLUE}Already serving $REPORT_DIR${NC}"
else
    # Set up serve (HTTPS on tailnet, not public funnel)
    echo "Configuring tailscale serve..."

    # For background serving
    tailscale serve --bg --https=$SERVE_PORT "$REPORT_DIR" 2>/dev/null || {
        # Older tailscale version syntax
        tailscale serve https:$SERVE_PORT "$REPORT_DIR" 2>/dev/null || {
            echo -e "${YELLOW}Auto-config failed. Run manually:${NC}"
            echo "  tailscale serve --bg --https=$SERVE_PORT $REPORT_DIR"
        }
    }

    echo -e "${GREEN}Tailscale serve configured on port $SERVE_PORT${NC}"
fi

# Set up cleanup cron
echo ""
echo "Step 4: Setting up cleanup cron"

CRON_CMD="0 3 * * * find $REPORT_DIR -maxdepth 1 -type d -mtime +$RETENTION_DAYS -not -name 'latest' -exec rm -rf {} \;"
CRON_EXISTS=$(crontab -l 2>/dev/null | grep -F "$REPORT_DIR" || true)

if [ -n "$CRON_EXISTS" ]; then
    echo -e "${BLUE}Cleanup cron already exists${NC}"
else
    # Add to crontab
    (crontab -l 2>/dev/null || true; echo "$CRON_CMD") | crontab - 2>/dev/null || {
        echo -e "${YELLOW}Could not add cron automatically.${NC}"
        echo "Add this to your crontab (crontab -e):"
        echo "  $CRON_CMD"
    }
    echo -e "${GREEN}Cleanup cron added (runs daily at 3am, removes reports older than $RETENTION_DAYS days)${NC}"
fi

# Summary
echo ""
echo "============================================"
echo -e "${GREEN}NAS Setup Complete!${NC}"
echo "============================================"
echo ""
echo "Report Directory:"
echo -e "  ${BLUE}$REPORT_DIR${NC}"
echo ""
echo "Access URL (Tailscale network only):"
echo -e "  ${BLUE}https://${HOSTNAME}.${TAILNET}:${SERVE_PORT}/${NC}"
echo ""
echo "Latest Report:"
echo -e "  ${BLUE}https://${HOSTNAME}.${TAILNET}:${SERVE_PORT}/latest/playwright-report/${NC}"
echo ""
echo "Retention Policy:"
echo -e "  Reports older than ${RETENTION_DAYS} days are automatically deleted"
echo ""
echo "============================================"
echo "Client Setup"
echo "============================================"
echo ""
echo "On your test servers, create ${BLUE}.playwright-report.env${NC}:"
echo ""
echo "  PLAYWRIGHT_NAS_HOST=${HOSTNAME}.${TAILNET}"
echo "  PLAYWRIGHT_NAS_PATH=$REPORT_DIR"
echo "  PLAYWRIGHT_NAS_USER=$USER"
echo ""
echo "Then run after tests:"
echo "  ./scripts/playwright-report-sync.sh"
echo ""

# Security reminder
echo -e "${YELLOW}Security Note:${NC}"
echo "  - Reports are only accessible on your Tailscale network"
echo "  - Do NOT use 'tailscale funnel' - that makes it public"
echo "  - Test artifacts may contain sensitive data"
echo ""

exit 0
