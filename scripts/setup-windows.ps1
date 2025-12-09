# CodeAssist Windows Setup
# Installs prerequisites for CodeAssist on Windows
#
# Run in PowerShell as Administrator:
#   Set-ExecutionPolicy Bypass -Scope Process -Force; .\scripts\setup-windows.ps1
#
# Or download and run:
#   irm https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/setup-windows.ps1 | iex

Write-Host ""
Write-Host "CodeAssist Windows Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Warning: Not running as Administrator. Some installations may fail." -ForegroundColor Yellow
    Write-Host "Recommend: Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
    Write-Host ""
}

# Check for winget
$hasWinget = Get-Command winget -ErrorAction SilentlyContinue

if (-not $hasWinget) {
    Write-Host "Error: winget not found." -ForegroundColor Red
    Write-Host "Install App Installer from Microsoft Store or update Windows." -ForegroundColor Yellow
    Write-Host "https://apps.microsoft.com/detail/9NBLGGH4NNS1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Using winget for installations..." -ForegroundColor Green
Write-Host ""

# Install Git for Windows (includes Git Bash)
Write-Host "[1/3] Checking Git for Windows..." -ForegroundColor Cyan
$hasGit = Get-Command git -ErrorAction SilentlyContinue

if ($hasGit) {
    $gitVersion = git --version
    Write-Host "  Already installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "  Installing Git for Windows..." -ForegroundColor Yellow
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Host "  Installed successfully" -ForegroundColor Green
    } else {
        Write-Host "  Installed. Restart terminal to use git." -ForegroundColor Yellow
    }
}
Write-Host ""

# Install GitHub CLI
Write-Host "[2/3] Checking GitHub CLI..." -ForegroundColor Cyan
$hasGh = Get-Command gh -ErrorAction SilentlyContinue

if ($hasGh) {
    $ghVersion = gh --version | Select-Object -First 1
    Write-Host "  Already installed: $ghVersion" -ForegroundColor Green
} else {
    Write-Host "  Installing GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements

    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

    if (Get-Command gh -ErrorAction SilentlyContinue) {
        Write-Host "  Installed successfully" -ForegroundColor Green
    } else {
        Write-Host "  Installed. Restart terminal to use gh." -ForegroundColor Yellow
    }
}
Write-Host ""

# Install Windows Terminal (optional but recommended)
Write-Host "[3/3] Checking Windows Terminal..." -ForegroundColor Cyan
$hasWT = Get-Command wt -ErrorAction SilentlyContinue

if ($hasWT) {
    Write-Host "  Already installed" -ForegroundColor Green
} else {
    Write-Host "  Installing Windows Terminal (recommended)..." -ForegroundColor Yellow
    winget install --id Microsoft.WindowsTerminal -e --source winget --accept-package-agreements --accept-source-agreements
    Write-Host "  Installed" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Setup Complete" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Installed:" -ForegroundColor Green
Write-Host "  - Git for Windows (includes Git Bash)"
Write-Host "  - GitHub CLI (gh)"
Write-Host "  - Windows Terminal"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open Git Bash or Windows Terminal"
Write-Host "  2. Authenticate GitHub: gh auth login"
Write-Host "  3. Install CodeAssist:"
Write-Host ""
Write-Host "     curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash" -ForegroundColor White
Write-Host ""
Write-Host "  4. Add .claude/ to .gitignore:"
Write-Host ""
Write-Host "     echo '.claude/' >> .gitignore" -ForegroundColor White
Write-Host ""
