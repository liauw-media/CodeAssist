# CA-Update

Check for CodeAssist updates and see what's new.

> Prefixed with `ca-` to avoid conflicts with Claude Code built-in commands.

## Execute

### Step 1: Check Versions

```bash
# Current version
CURRENT=$(cat .claude/VERSION 2>/dev/null || echo "unknown")
echo "Current: $CURRENT"

# Latest version
LATEST=$(curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/.claude/VERSION 2>/dev/null || echo "unknown")
echo "Latest:  $LATEST"
```

### Step 2: Compare and Report

If versions match:
```
✓ You're on the latest version ($CURRENT)
```

If update available:
```
⬆️ Update available: $CURRENT → $LATEST
```

### Step 3: Fetch What's New

If update available, fetch and summarize the changelog:

```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/CHANGELOG.md 2>/dev/null | head -100
```

Summarize the key changes between current and latest version.

### Step 4: Show Update Options

```
## How to Update

**Option 1: Auto-update (recommended)**
\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
\`\`\`

**Option 2: Pin to specific version**
\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/v1.0.7/scripts/install-codeassist.sh | bash
\`\`\`

## After Updating

New commands you might want to try:
- `/quickstart` - Interactive onboarding
- `/branch` - One branch per issue workflow
- `/architect` - Security audits

New skills:
- `branch-discipline` - Clean git history
- `system-architect` - Security hardening
- `ci-templates` - GitLab + GitHub CI/CD

Full changelog: https://github.com/liauw-media/CodeAssist/blob/main/CHANGELOG.md
```

### Step 5: Offer to Update Now

Ask user:
```
Would you like me to run the update now?
- Yes: Run the install script
- No: Just show the info
```

If yes:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

Then verify:
```bash
echo "Updated to: $(cat .claude/VERSION)"
```

## Output Format

```
## CodeAssist Update Check

**Current:** 1.0.4
**Latest:**  1.0.7

### What's New Since 1.0.4

**New Commands:**
- `/quickstart` - Interactive onboarding
- `/branch` - One branch per issue + worktree support
- `/branch-status`, `/branch-done`, `/branch-list`
- `/architect` - System security audits

**New Skills:**
- `branch-discipline` - Enforce clean git history
- `system-architect` - Security audit principles
- `ci-templates` - GitLab + GitHub CI/CD templates

**Improvements:**
- YAML linting in all CI templates
- Mentor reviews in branch workflow
- Team adoption documentation

### Update Command

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
\`\`\`

Run update now? [Yes/No]
```

Execute the update check now.
