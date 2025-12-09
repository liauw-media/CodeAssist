#!/bin/bash

# CodeAssist Linux Setup
# Installs prerequisites for CodeAssist on Linux
#
# Run:
#   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-linux.sh | bash

echo ""
echo "CodeAssist Linux Setup"
echo "======================"
echo ""

# Detect package manager
if command -v apt-get &> /dev/null; then
    PKG_MANAGER="apt"
    INSTALL_CMD="sudo apt-get install -y"
    UPDATE_CMD="sudo apt-get update"
elif command -v dnf &> /dev/null; then
    PKG_MANAGER="dnf"
    INSTALL_CMD="sudo dnf install -y"
    UPDATE_CMD=""
elif command -v yum &> /dev/null; then
    PKG_MANAGER="yum"
    INSTALL_CMD="sudo yum install -y"
    UPDATE_CMD=""
elif command -v pacman &> /dev/null; then
    PKG_MANAGER="pacman"
    INSTALL_CMD="sudo pacman -S --noconfirm"
    UPDATE_CMD="sudo pacman -Sy"
else
    echo "Error: No supported package manager found (apt, dnf, yum, pacman)"
    exit 1
fi

echo "Detected package manager: $PKG_MANAGER"
echo ""

# Update package list
if [ -n "$UPDATE_CMD" ]; then
    echo "Updating package list..."
    $UPDATE_CMD
    echo ""
fi

# Install Git
echo "[1/2] Checking Git..."
if command -v git &> /dev/null; then
    echo "  Already installed: $(git --version)"
else
    echo "  Installing Git..."
    $INSTALL_CMD git
fi
echo ""

# Install GitHub CLI
echo "[2/2] Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    echo "  Already installed: $(gh --version | head -1)"
else
    echo "  Installing GitHub CLI..."

    case $PKG_MANAGER in
        apt)
            # Debian/Ubuntu
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y gh
            ;;
        dnf|yum)
            # Fedora/RHEL/CentOS
            sudo dnf install -y 'dnf-command(config-manager)' 2>/dev/null || true
            sudo dnf config-manager --add-repo https://cli.github.com/packages/rpm/gh-cli.repo
            sudo dnf install -y gh
            ;;
        pacman)
            # Arch Linux
            sudo pacman -S --noconfirm github-cli
            ;;
    esac
fi
echo ""

# Verification
echo "======================"
echo "Verifying Installation"
echo "======================"
echo ""

ALL_GOOD=true

# Verify Git
echo -n "Checking git..."
if command -v git &> /dev/null; then
    echo " OK ($(git --version))"
else
    echo " NOT FOUND"
    echo "  Try: $INSTALL_CMD git"
    ALL_GOOD=false
fi

# Verify GitHub CLI
echo -n "Checking gh..."
if command -v gh &> /dev/null; then
    echo " OK ($(gh --version | head -1))"
else
    echo " NOT FOUND"
    echo "  See: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    ALL_GOOD=false
fi

# Verify curl
echo -n "Checking curl..."
if command -v curl &> /dev/null; then
    echo " OK"
else
    echo " NOT FOUND"
    echo "  Try: $INSTALL_CMD curl"
    ALL_GOOD=false
fi

echo ""

if [ "$ALL_GOOD" = true ]; then
    echo "======================"
    echo "All tools verified!"
    echo "======================"
else
    echo "======================"
    echo "Some tools need attention"
    echo "======================"
    echo "Fix the issues above, then re-run this script to verify."
fi

echo ""
echo "Next steps:"
echo "  1. Authenticate GitHub: gh auth login"
echo "  2. Install CodeAssist:"
echo ""
echo "     curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash"
echo ""
echo "  3. Add .claude/ to .gitignore:"
echo ""
echo "     echo '.claude/' >> .gitignore"
echo ""
