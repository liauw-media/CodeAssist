#!/bin/bash

# CodeAssist macOS Setup
# Installs prerequisites for CodeAssist on macOS
#
# Run:
#   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-macos.sh | bash

echo ""
echo "CodeAssist macOS Setup"
echo "======================"
echo ""

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "[1/3] Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Add to PATH for Apple Silicon
    if [[ -f /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo "[1/3] Homebrew already installed"
fi
echo ""

# Install Git
echo "[2/3] Checking Git..."
if command -v git &> /dev/null; then
    echo "  Already installed: $(git --version)"
else
    echo "  Installing Git..."
    brew install git
fi
echo ""

# Install GitHub CLI
echo "[3/3] Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    echo "  Already installed: $(gh --version | head -1)"
else
    echo "  Installing GitHub CLI..."
    brew install gh
fi
echo ""

# Summary
echo "======================"
echo "Setup Complete"
echo "======================"
echo ""
echo "Installed:"
echo "  - Homebrew"
echo "  - Git"
echo "  - GitHub CLI (gh)"
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
