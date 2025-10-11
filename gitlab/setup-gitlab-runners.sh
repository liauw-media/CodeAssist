#!/bin/bash

################################################################################
# GitLab Multi-Runner Setup Script
#
# This script creates 4 dedicated GitLab runners for different project types:
# 1. Runner-PHP      - For PHP/Laravel/Composer projects
# 2. Runner-Node     - For TypeScript/Next.js/npm projects
# 3. Runner-Python   - For Python/pip projects
# 4. Runner-General  - For general-purpose tasks
#
# Each runner gets:
# - Dedicated config directory in /opt/gitlab-runner-{type}/config/
# - Dedicated systemd service
# - Docker executor for isolated builds
# - Specific tags for targeting
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GITLAB_URL="${GITLAB_URL:-https://gitlab.liauw-media.de}"
BASE_DIR="/opt"

# Runner configurations
declare -A RUNNERS=(
    ["php"]="PHP/Laravel/Composer projects"
    ["node"]="TypeScript/Next.js/npm projects"
    ["python"]="Python/pip projects"
    ["general"]="General-purpose tasks"
)

declare -A RUNNER_TAGS=(
    ["php"]="php,laravel,composer,docker"
    ["node"]="node,typescript,nextjs,npm,docker"
    ["python"]="python,pip,docker"
    ["general"]="general,docker,shell"
)

declare -A RUNNER_IMAGES=(
    ["php"]="php:8.2"
    ["node"]="node:20"
    ["python"]="python:3.11"
    ["general"]="alpine:latest"
)

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        GitLab Multi-Runner Setup Script                   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ This script must be run as root${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is installed${NC}"

# Install GitLab Runner if not already installed
if ! command -v gitlab-runner &> /dev/null; then
    echo -e "${YELLOW}📦 Installing GitLab Runner...${NC}"

    # Add GitLab's official repository
    curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | bash

    # Install GitLab Runner
    apt-get install -y gitlab-runner

    echo -e "${GREEN}✅ GitLab Runner installed${NC}"
else
    echo -e "${GREEN}✅ GitLab Runner already installed${NC}"
fi

# Create directory structure for each runner
for runner in "${!RUNNERS[@]}"; do
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Setting up GitLab Runner: ${runner}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    RUNNER_DIR="${BASE_DIR}/gitlab-runner-${runner}"
    CONFIG_DIR="${RUNNER_DIR}/config"

    # Create directories
    echo -e "${YELLOW}📁 Creating directory: ${CONFIG_DIR}${NC}"
    mkdir -p "${CONFIG_DIR}"

    # Create config.toml template
    cat > "${CONFIG_DIR}/config.toml" << EOF
concurrent = 1
check_interval = 0

[session_server]
  session_timeout = 1800

# This runner will be registered when you run the registration script
# The registration token needs to be added manually

EOF

    # Create systemd service file
    echo -e "${YELLOW}⚙️  Creating systemd service: gitlab-runner-${runner}.service${NC}"
    cat > "/etc/systemd/system/gitlab-runner-${runner}.service" << EOF
[Unit]
Description=GitLab Runner (${runner})
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=${RUNNER_DIR}
ExecStart=/usr/bin/gitlab-runner run --config ${CONFIG_DIR}/config.toml --working-directory ${RUNNER_DIR}
Restart=always
RestartSec=120

[Install]
WantedBy=multi-user.target
EOF

    # Set permissions
    chmod 600 "${CONFIG_DIR}/config.toml"
    chown -R root:root "${RUNNER_DIR}"

    echo -e "${GREEN}✅ Directory structure created for runner: ${runner}${NC}"
done

# Reload systemd
echo ""
echo -e "${YELLOW}🔄 Reloading systemd daemon...${NC}"
systemctl daemon-reload

# Create registration helper script
REGISTER_SCRIPT="${BASE_DIR}/register-gitlab-runners.sh"
echo ""
echo -e "${YELLOW}📝 Creating registration helper script: ${REGISTER_SCRIPT}${NC}"

cat > "${REGISTER_SCRIPT}" << 'REGSCRIPT'
#!/bin/bash

################################################################################
# GitLab Runner Registration Script
#
# This script registers all GitLab runners with your GitLab instance.
# You need to provide registration tokens for each runner type.
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

GITLAB_URL="${GITLAB_URL:-https://gitlab.liauw-media.de}"
BASE_DIR="/opt"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GitLab Runner Registration Helper                     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get registration tokens
echo -e "${YELLOW}You need registration tokens from GitLab:${NC}"
echo -e "  Go to: ${GITLAB_URL}/admin/runners"
echo -e "  Or: Your Project → Settings → CI/CD → Runners"
echo ""

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
    gitlab-runner register \
        --non-interactive \
        --config "${BASE_DIR}/gitlab-runner-php/config/config.toml" \
        --url "${GITLAB_URL}" \
        --registration-token "${TOKEN_PHP}" \
        --name "Runner-PHP" \
        --tag-list "php,laravel,composer,docker" \
        --executor "docker" \
        --docker-image "php:8.2" \
        --docker-privileged=true \
        --docker-volumes "/var/run/docker.sock:/var/run/docker.sock" \
        --docker-volumes "/cache"

    echo -e "${GREEN}✅ PHP Runner registered${NC}"
    systemctl enable gitlab-runner-php
    systemctl start gitlab-runner-php
fi

# Register Node Runner
if [ ! -z "$TOKEN_NODE" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering Node Runner...${NC}"
    gitlab-runner register \
        --non-interactive \
        --config "${BASE_DIR}/gitlab-runner-node/config/config.toml" \
        --url "${GITLAB_URL}" \
        --registration-token "${TOKEN_NODE}" \
        --name "Runner-Node" \
        --tag-list "node,typescript,nextjs,npm,docker" \
        --executor "docker" \
        --docker-image "node:20" \
        --docker-privileged=true \
        --docker-volumes "/var/run/docker.sock:/var/run/docker.sock" \
        --docker-volumes "/cache"

    echo -e "${GREEN}✅ Node Runner registered${NC}"
    systemctl enable gitlab-runner-node
    systemctl start gitlab-runner-node
fi

# Register Python Runner
if [ ! -z "$TOKEN_PYTHON" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering Python Runner...${NC}"
    gitlab-runner register \
        --non-interactive \
        --config "${BASE_DIR}/gitlab-runner-python/config/config.toml" \
        --url "${GITLAB_URL}" \
        --registration-token "${TOKEN_PYTHON}" \
        --name "Runner-Python" \
        --tag-list "python,pip,docker" \
        --executor "docker" \
        --docker-image "python:3.11" \
        --docker-privileged=true \
        --docker-volumes "/var/run/docker.sock:/var/run/docker.sock" \
        --docker-volumes "/cache"

    echo -e "${GREEN}✅ Python Runner registered${NC}"
    systemctl enable gitlab-runner-python
    systemctl start gitlab-runner-python
fi

# Register General Runner
if [ ! -z "$TOKEN_GENERAL" ]; then
    echo ""
    echo -e "${YELLOW}📦 Registering General Runner...${NC}"
    gitlab-runner register \
        --non-interactive \
        --config "${BASE_DIR}/gitlab-runner-general/config/config.toml" \
        --url "${GITLAB_URL}" \
        --registration-token "${TOKEN_GENERAL}" \
        --name "Runner-General" \
        --tag-list "general,docker,shell" \
        --executor "docker" \
        --docker-image "alpine:latest" \
        --docker-privileged=true \
        --docker-volumes "/var/run/docker.sock:/var/run/docker.sock" \
        --docker-volumes "/cache"

    echo -e "${GREEN}✅ General Runner registered${NC}"
    systemctl enable gitlab-runner-general
    systemctl start gitlab-runner-general
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Registration Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Runner Status:${NC}"
systemctl status gitlab-runner-php --no-pager | head -3 || true
systemctl status gitlab-runner-node --no-pager | head -3 || true
systemctl status gitlab-runner-python --no-pager | head -3 || true
systemctl status gitlab-runner-general --no-pager | head -3 || true

echo ""
echo -e "${GREEN}Verify in GitLab:${NC} ${GITLAB_URL}/admin/runners"
echo ""
REGSCRIPT

chmod +x "${REGISTER_SCRIPT}"

# Create management helper script
MANAGE_SCRIPT="${BASE_DIR}/manage-gitlab-runners.sh"
echo -e "${YELLOW}📝 Creating management helper script: ${MANAGE_SCRIPT}${NC}"

cat > "${MANAGE_SCRIPT}" << 'MGMTSCRIPT'
#!/bin/bash

################################################################################
# GitLab Runners Management Script
################################################################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

RUNNERS=("php" "node" "python" "general")

show_status() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}GitLab Runners Status${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    for runner in "${RUNNERS[@]}"; do
        echo -e "${YELLOW}Runner: ${runner}${NC}"
        systemctl status gitlab-runner-${runner} --no-pager | head -5
        echo ""
    done
}

start_all() {
    echo -e "${YELLOW}Starting all runners...${NC}"
    for runner in "${RUNNERS[@]}"; do
        systemctl start gitlab-runner-${runner}
        echo -e "${GREEN}✅ Started gitlab-runner-${runner}${NC}"
    done
}

stop_all() {
    echo -e "${YELLOW}Stopping all runners...${NC}"
    for runner in "${RUNNERS[@]}"; do
        systemctl stop gitlab-runner-${runner}
        echo -e "${GREEN}✅ Stopped gitlab-runner-${runner}${NC}"
    done
}

restart_all() {
    echo -e "${YELLOW}Restarting all runners...${NC}"
    for runner in "${RUNNERS[@]}"; do
        systemctl restart gitlab-runner-${runner}
        echo -e "${GREEN}✅ Restarted gitlab-runner-${runner}${NC}"
    done
}

show_logs() {
    local runner=$1
    if [ -z "$runner" ]; then
        echo "Usage: $0 logs <runner-type>"
        echo "Available: php, node, python, general"
        exit 1
    fi
    journalctl -u gitlab-runner-${runner} -f
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

chmod +x "${MANAGE_SCRIPT}"

# Summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Setup Complete!                                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Created 4 GitLab runners:${NC}"
for runner in "${!RUNNERS[@]}"; do
    echo -e "   • ${YELLOW}${runner}${NC} - ${RUNNERS[$runner]}"
    echo -e "     Config: ${BASE_DIR}/gitlab-runner-${runner}/config/"
    echo -e "     Service: gitlab-runner-${runner}.service"
    echo -e "     Tags: ${RUNNER_TAGS[$runner]}"
    echo ""
done

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "1. Get registration tokens from GitLab:"
echo -e "   ${BLUE}${GITLAB_URL}/admin/runners${NC}"
echo ""
echo -e "2. Register all runners:"
echo -e "   ${GREEN}${REGISTER_SCRIPT}${NC}"
echo ""
echo -e "3. Manage runners:"
echo -e "   ${GREEN}${MANAGE_SCRIPT} status${NC}      # Check status"
echo -e "   ${GREEN}${MANAGE_SCRIPT} start${NC}       # Start all"
echo -e "   ${GREEN}${MANAGE_SCRIPT} stop${NC}        # Stop all"
echo -e "   ${GREEN}${MANAGE_SCRIPT} restart${NC}     # Restart all"
echo -e "   ${GREEN}${MANAGE_SCRIPT} logs php${NC}    # View logs"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
