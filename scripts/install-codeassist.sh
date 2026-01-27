#!/bin/bash

# ============================================
# CodeAssist Installation Script
# Version 1.7.2
# ============================================
#
# Downloads and installs CodeAssist from GitHub releases
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
#
# Options:
#   VERSION=v1.4.0 curl ... | bash   # Install specific version
#
# ============================================

set -e

# Use specified version or latest
INSTALL_VERSION="${VERSION:-latest}"

# Colors (optional, degrade gracefully)
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    RED='\033[0;31m'
    CYAN='\033[0;36m'
    NC='\033[0m'
else
    GREEN=''
    YELLOW=''
    RED=''
    CYAN=''
    NC=''
fi

echo ""
echo "CodeAssist Installation"
echo "========================"
echo ""

# ============================================
# Step 1: Determine version to install
# ============================================
echo -e "${CYAN}[1/5] Checking version...${NC}"

if [ "$INSTALL_VERSION" = "latest" ]; then
    # Get latest release version from GitHub API
    INSTALL_VERSION=$(curl -fsSL "https://api.github.com/repos/liauw-media/CodeAssist/releases/latest" 2>/dev/null | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/' || echo "")

    if [ -z "$INSTALL_VERSION" ]; then
        echo -e "${YELLOW}  Could not fetch latest version, using v1.7.2${NC}"
        INSTALL_VERSION="v1.7.2"
    fi
fi

# Ensure version starts with 'v'
if [[ ! "$INSTALL_VERSION" =~ ^v ]]; then
    INSTALL_VERSION="v${INSTALL_VERSION}"
fi

echo -e "${GREEN}  Installing ${INSTALL_VERSION}${NC}"
echo ""

# ============================================
# Step 2: Download release archive
# ============================================
echo -e "${CYAN}[2/5] Downloading release...${NC}"

DOWNLOAD_URL="https://github.com/liauw-media/CodeAssist/archive/refs/tags/${INSTALL_VERSION}.tar.gz"
TEMP_DIR=$(mktemp -d)
ARCHIVE_FILE="${TEMP_DIR}/codeassist.tar.gz"

if ! curl -fsSL --retry 3 --retry-delay 2 "$DOWNLOAD_URL" -o "$ARCHIVE_FILE" 2>/dev/null; then
    echo -e "${RED}  Failed to download ${INSTALL_VERSION}${NC}"
    echo -e "${RED}  URL: ${DOWNLOAD_URL}${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check your internet connection"
    echo "  2. Verify the version exists: https://github.com/liauw-media/CodeAssist/releases"
    echo "  3. Try a specific version: VERSION=v1.0.8 curl ... | bash"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}  Downloaded ($(du -h "$ARCHIVE_FILE" | cut -f1))${NC}"
echo ""

# ============================================
# Step 3: Extract and install
# ============================================
echo -e "${CYAN}[3/5] Installing...${NC}"

# Extract archive
cd "$TEMP_DIR"
tar -xzf "$ARCHIVE_FILE"

# Find extracted directory (CodeAssist-1.0.8 or similar)
EXTRACTED_DIR=$(ls -d CodeAssist-* 2>/dev/null | head -1)
if [ -z "$EXTRACTED_DIR" ]; then
    echo -e "${RED}  Failed to extract archive${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Go back to original directory
cd - > /dev/null

# Clean up old installation
if [ -d ".claude/skills" ]; then
    rm -rf .claude/skills
fi
if [ -d ".claude/commands" ]; then
    rm -rf .claude/commands
fi

# Create directories
mkdir -p .claude/commands
mkdir -p .claude/skills

# Copy commands
if [ -d "${TEMP_DIR}/${EXTRACTED_DIR}/commands" ]; then
    cp "${TEMP_DIR}/${EXTRACTED_DIR}/commands/"*.md .claude/commands/ 2>/dev/null || true
    CMD_COUNT=$(ls -1 .claude/commands/*.md 2>/dev/null | wc -l)
    echo -e "${GREEN}  ${CMD_COUNT} commands installed${NC}"
else
    echo -e "${YELLOW}  No commands found${NC}"
fi

# Copy skills
if [ -d "${TEMP_DIR}/${EXTRACTED_DIR}/skills" ]; then
    cp -r "${TEMP_DIR}/${EXTRACTED_DIR}/skills/"* .claude/skills/ 2>/dev/null || true
    SKILL_COUNT=$(find .claude/skills -name "SKILL.md" 2>/dev/null | wc -l)
    echo -e "${GREEN}  ${SKILL_COUNT} skills installed${NC}"
else
    echo -e "${YELLOW}  No skills found${NC}"
fi

# Copy CLAUDE.md
if [ -f "${TEMP_DIR}/${EXTRACTED_DIR}/.claude/CLAUDE.md" ]; then
    cp "${TEMP_DIR}/${EXTRACTED_DIR}/.claude/CLAUDE.md" .claude/CLAUDE.md
    echo -e "${GREEN}  CLAUDE.md installed${NC}"
fi

# Copy templates (MCP configs)
if [ -d "${TEMP_DIR}/${EXTRACTED_DIR}/templates" ]; then
    mkdir -p .claude/templates
    cp "${TEMP_DIR}/${EXTRACTED_DIR}/templates/"*.json .claude/templates/ 2>/dev/null || true
    TEMPLATE_COUNT=$(ls -1 .claude/templates/*.json 2>/dev/null | wc -l)
    echo -e "${GREEN}  ${TEMPLATE_COUNT} MCP templates installed${NC}"
fi

# Create VERSION file
VERSION_NUM="${INSTALL_VERSION#v}"
echo "$VERSION_NUM" > .claude/VERSION
echo -e "${GREEN}  Version ${VERSION_NUM}${NC}"

# Cleanup
rm -rf "$TEMP_DIR"
echo ""

# ============================================
# Step 4: Check .gitignore
# ============================================
echo -e "${CYAN}[4/5] Checking .gitignore...${NC}"

if [ -f .gitignore ]; then
    if grep -q "^\.claude" .gitignore 2>/dev/null; then
        echo -e "${GREEN}  .claude/ already in .gitignore${NC}"
    else
        echo -e "${YELLOW}  Add to .gitignore: echo '.claude/' >> .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}  Create .gitignore: echo '.claude/' >> .gitignore${NC}"
fi
echo ""

# ============================================
# Step 5: Summary
# ============================================
echo -e "${CYAN}[5/5] Done!${NC}"
echo ""
echo "========================"
echo "Installation Complete"
echo "========================"
echo ""
echo "Version: ${VERSION_NUM}"
echo "Commands: ${CMD_COUNT:-0}"
echo "Skills: ${SKILL_COUNT:-0}"
echo ""
echo "Quick start:"
echo "  /quickstart     - Interactive onboarding"
echo "  /status         - Show git status"
echo "  /ca-update      - Check for updates"
echo ""
echo "Extend Claude Code:"
echo "  /mcp-setup      - Configure MCPs (GitHub, Playwright, DB)"
echo "  /plugin-setup   - Install plugins (code-simplifier, LSPs)"
echo ""
echo "Branch workflow:"
echo "  /branch 123 fix login   - Create focused branch"
echo "  /branch-status          - Check progress"
echo "  /branch-done            - Complete and PR"
echo ""
echo "Infrastructure:"
echo "  /terraform, /docker, /k8s, /aws, /gcp, /azure"
echo ""
echo -e "${YELLOW}Tip: Run /quickstart to get personalized recommendations${NC}"
echo ""
