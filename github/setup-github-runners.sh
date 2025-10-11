#!/bin/bash

################################################################################
# GitHub Actions Multi-Runner Setup Script
#
# This script creates 4 dedicated GitHub Actions self-hosted runners:
# 1. Runner-PHP      - For PHP/Laravel/Composer projects
# 2. Runner-Node     - For TypeScript/Next.js/npm projects
# 3. Runner-Python   - For Python/pip projects
# 4. Runner-General  - For general-purpose tasks
#
# Each runner gets:
# - Dedicated directory in /opt/github-runner-{type}/
# - Dedicated systemd service
# - Specific labels for targeting
# - Isolated working directory
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RUNNER_VERSION="${RUNNER_VERSION:-2.311.0}"
BASE_DIR="/opt"

# Runner configurations
declare -A RUNNERS=(
    ["php"]="PHP/Laravel/Composer projects"
    ["node"]="TypeScript/Next.js/npm projects"
    ["python"]="Python/pip projects"
    ["general"]="General-purpose tasks"
)

declare -A RUNNER_LABELS=(
    ["php"]="self-hosted,Linux,X64,php,laravel,composer"
    ["node"]="self-hosted,Linux,X64,node,typescript,nextjs,npm"
    ["python"]="self-hosted,Linux,X64,python,pip"
    ["general"]="self-hosted,Linux,X64,general,shell"
)

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      GitHub Actions Multi-Runner Setup Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ This script should NOT be run as root${NC}"
    echo -e "${YELLOW}⚠️  GitHub Actions runners should run as a regular user${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sudo sh /tmp/get-docker.sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker installed. Please log out and log back in for group changes to take effect.${NC}"
fi

echo -e "${GREEN}✅ Docker is available${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
sudo apt-get update
sudo apt-get install -y curl jq tar

# Create directory structure for each runner
for runner in "${!RUNNERS[@]}"; do
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Setting up GitHub Actions Runner: ${runner}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    RUNNER_DIR="${BASE_DIR}/github-runner-${runner}"

    # Create directory
    echo -e "${YELLOW}📁 Creating directory: ${RUNNER_DIR}${NC}"
    sudo mkdir -p "${RUNNER_DIR}"
    sudo chown $USER:$USER "${RUNNER_DIR}"

    # Download and extract runner
    echo -e "${YELLOW}📥 Downloading GitHub Actions Runner v${RUNNER_VERSION}...${NC}"
    cd "${RUNNER_DIR}"

    curl -o actions-runner-linux-x64.tar.gz -L \
        "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"

    echo -e "${YELLOW}📦 Extracting runner...${NC}"
    tar xzf ./actions-runner-linux-x64.tar.gz
    rm ./actions-runner-linux-x64.tar.gz

    # Create systemd service file
    echo -e "${YELLOW}⚙️  Creating systemd service: github-runner-${runner}.service${NC}"
    sudo tee "/etc/systemd/system/github-runner-${runner}.service" > /dev/null << EOF
[Unit]
Description=GitHub Actions Runner (${runner})
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=${RUNNER_DIR}
ExecStart=${RUNNER_DIR}/run.sh
Restart=always
RestartSec=120

# Security settings
NoNewPrivileges=true
PrivateTmp=true

# Environment
Environment="RUNNER_ALLOW_RUNASROOT=0"

[Install]
WantedBy=multi-user.target
EOF

    echo -e "${GREEN}✅ Directory structure created for runner: ${runner}${NC}"
done

# Reload systemd
echo ""
echo -e "${YELLOW}🔄 Reloading systemd daemon...${NC}"
sudo systemctl daemon-reload

# Create registration helper script
REGISTER_SCRIPT="${BASE_DIR}/register-github-runners.sh"
echo ""
echo -e "${YELLOW}📝 Creating registration helper script: ${REGISTER_SCRIPT}${NC}"

sudo tee "${REGISTER_SCRIPT}" > /dev/null << 'REGSCRIPT'
#!/bin/bash

################################################################################
# GitHub Actions Runner Registration Script
#
# This script registers all GitHub Actions runners with your repositories.
# You need to provide registration tokens for each runner type.
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_DIR="/opt"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GitHub Actions Runner Registration Helper             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Runner configurations
declare -A RUNNER_LABELS=(
    ["php"]="php,laravel,composer"
    ["node"]="node,typescript,nextjs,npm"
    ["python"]="python,pip"
    ["general"]="general,shell"
)

# Get repository URL
echo -e "${YELLOW}Enter your repository URL (e.g., https://github.com/owner/repo):${NC}"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}❌ Repository URL is required${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Getting registration tokens...${NC}"
echo -e "Go to: ${REPO_URL}/settings/actions/runners/new"
echo -e "Or for organization: https://github.com/organizations/YOUR_ORG/settings/actions/runners/new"
echo ""

# Get registration tokens
read -p "Enter registration token for PHP runner: " TOKEN_PHP
read -p "Enter registration token for Node runner: " TOKEN_NODE
read -p "Enter registration token for Python runner: " TOKEN_PYTHON
read -p "Enter registration token for General runner: " TOKEN_GENERAL

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Registering Runners...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Register PHP Runner
if [ ! -z "$TOKEN_PHP" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering PHP Runner...${NC}"
    cd "${BASE_DIR}/github-runner-php"
    ./config.sh \
        --url "${REPO_URL}" \
        --token "${TOKEN_PHP}" \
        --name "Runner-PHP" \
        --labels "${RUNNER_LABELS[php]}" \
        --work "_work" \
        --unattended \
        --replace

    echo -e "${GREEN}✅ PHP Runner registered${NC}"
    sudo systemctl enable github-runner-php
    sudo systemctl start github-runner-php
fi

# Register Node Runner
if [ ! -z "$TOKEN_NODE" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering Node Runner...${NC}"
    cd "${BASE_DIR}/github-runner-node"
    ./config.sh \
        --url "${REPO_URL}" \
        --token "${TOKEN_NODE}" \
        --name "Runner-Node" \
        --labels "${RUNNER_LABELS[node]}" \
        --work "_work" \
        --unattended \
        --replace

    echo -e "${GREEN}✅ Node Runner registered${NC}"
    sudo systemctl enable github-runner-node
    sudo systemctl start github-runner-node
fi

# Register Python Runner
if [ ! -z "$TOKEN_PYTHON" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering Python Runner...${NC}"
    cd "${BASE_DIR}/github-runner-python"
    ./config.sh \
        --url "${REPO_URL}" \
        --token "${TOKEN_PYTHON}" \
        --name "Runner-Python" \
        --labels "${RUNNER_LABELS[python]}" \
        --work "_work" \
        --unattended \
        --replace

    echo -e "${GREEN}✅ Python Runner registered${NC}"
    sudo systemctl enable github-runner-python
    sudo systemctl start github-runner-python
fi

# Register General Runner
if [ ! -z "$TOKEN_GENERAL" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering General Runner...${NC}"
    cd "${BASE_DIR}/github-runner-general"
    ./config.sh \
        --url "${REPO_URL}" \
        --token "${TOKEN_GENERAL}" \
        --name "Runner-General" \
        --labels "${RUNNER_LABELS[general]}" \
        --work "_work" \
        --unattended \
        --replace

    echo -e "${GREEN}✅ General Runner registered${NC}"
    sudo systemctl enable github-runner-general
    sudo systemctl start github-runner-general
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Registration Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Runner Status:${NC}"
sudo systemctl status github-runner-php --no-pager | head -3 || true
sudo systemctl status github-runner-node --no-pager | head -3 || true
sudo systemctl status github-runner-python --no-pager | head -3 || true
sudo systemctl status github-runner-general --no-pager | head -3 || true

echo ""
echo -e "${GREEN}Verify in GitHub:${NC} ${REPO_URL}/settings/actions/runners"
echo ""
REGSCRIPT

sudo chmod +x "${REGISTER_SCRIPT}"

# Create management helper script
MANAGE_SCRIPT="${BASE_DIR}/manage-github-runners.sh"
echo -e "${YELLOW}📝 Creating management helper script: ${MANAGE_SCRIPT}${NC}"

sudo tee "${MANAGE_SCRIPT}" > /dev/null << 'MGMTSCRIPT'
#!/bin/bash

################################################################################
# GitHub Actions Runners Management Script
################################################################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

RUNNERS=("php" "node" "python" "general")

show_status() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}GitHub Actions Runners Status${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    for runner in "${RUNNERS[@]}"; do
        echo -e "${YELLOW}Runner: ${runner}${NC}"
        systemctl status github-runner-${runner} --no-pager | head -5
        echo ""
    done
}

start_all() {
    echo -e "${YELLOW}Starting all runners...${NC}"
    for runner in "${RUNNERS[@]}"; do
        sudo systemctl start github-runner-${runner}
        echo -e "${GREEN}✅ Started github-runner-${runner}${NC}"
    done
}

stop_all() {
    echo -e "${YELLOW}Stopping all runners...${NC}"
    for runner in "${RUNNERS[@]}"; do
        sudo systemctl stop github-runner-${runner}
        echo -e "${GREEN}✅ Stopped github-runner-${runner}${NC}"
    done
}

restart_all() {
    echo -e "${YELLOW}Restarting all runners...${NC}"
    for runner in "${RUNNERS[@]}"; do
        sudo systemctl restart github-runner-${runner}
        echo -e "${GREEN}✅ Restarted github-runner-${runner}${NC}"
    done
}

show_logs() {
    local runner=$1
    if [ -z "$runner" ]; then
        echo "Usage: $0 logs <runner-type>"
        echo "Available: php, node, python, general"
        exit 1
    fi
    sudo journalctl -u github-runner-${runner} -f
}

case "${1}" in
    status)
        show_status
        ;;
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    logs)
        show_logs "${2}"
        ;;
    *)
        echo "Usage: $0 {status|start|stop|restart|logs <runner-type>}"
        echo ""
        echo "Examples:"
        echo "  $0 status              # Show status of all runners"
        echo "  $0 start               # Start all runners"
        echo "  $0 stop                # Stop all runners"
        echo "  $0 restart             # Restart all runners"
        echo "  $0 logs php            # Show logs for PHP runner"
        exit 1
        ;;
esac
MGMTSCRIPT

sudo chmod +x "${MANAGE_SCRIPT}"

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Setup Complete!                                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Created 4 GitHub Actions runners:${NC}"
for runner in "${!RUNNERS[@]}"; do
    echo -e "   • ${YELLOW}${runner}${NC} - ${RUNNERS[$runner]}"
    echo -e "     Directory: ${BASE_DIR}/github-runner-${runner}/"
    echo -e "     Service: github-runner-${runner}.service"
    echo -e "     Labels: ${RUNNER_LABELS[$runner]}"
    echo ""
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "1. Get registration tokens from GitHub:"
echo -e "   ${BLUE}https://github.com/YOUR_ORG/YOUR_REPO/settings/actions/runners/new${NC}"
echo ""
echo -e "2. Register all runners:"
echo -e "   ${GREEN}sudo ${REGISTER_SCRIPT}${NC}"
echo ""
echo -e "3. Manage runners:"
echo -e "   ${GREEN}sudo ${MANAGE_SCRIPT} status${NC}      # Check status"
echo -e "   ${GREEN}sudo ${MANAGE_SCRIPT} start${NC}       # Start all"
echo -e "   ${GREEN}sudo ${MANAGE_SCRIPT} stop${NC}        # Stop all"
echo -e "   ${GREEN}sudo ${MANAGE_SCRIPT} restart${NC}     # Restart all"
echo -e "   ${GREEN}sudo ${MANAGE_SCRIPT} logs php${NC}    # View logs"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
