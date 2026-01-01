# Team Adoption Guide

Step-by-step guide for teams adopting CodeAssist.

## Before You Start

### Prerequisites
- [ ] Team uses Claude Code
- [ ] Git repository for the project
- [ ] Agreement on code conventions

### Decision: Shared or Individual Install?

| Approach | Best For | Pros | Cons |
|----------|----------|------|------|
| **Shared** (commit `.claude/`) | Most teams | Same version, shared config | Updates require PR |
| **Individual** (gitignore) | Loose collaboration | Personal preferences | Version drift |

**Recommendation:** Shared install for teams > 2 people.

---

## Phase 1: Initial Setup (Lead Developer)

**Time:** 15 minutes

### Step 1: Install CodeAssist

```bash
cd your-project
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

### Step 2: Configure for Team Use

Remove `.claude/` from `.gitignore` (if present):

```bash
# Check if it's ignored
grep ".claude" .gitignore

# Remove if present
sed -i '/.claude/d' .gitignore
```

### Step 3: Add Team Conventions

Edit `.claude/CLAUDE.md` to add project-specific rules:

```markdown
## Team Conventions

### Code Style
- Use [tabs/spaces] for indentation
- Max line length: [number]
- Naming: [camelCase/snake_case/etc]

### Git Workflow
- Branch naming: `feature/`, `fix/`, `hotfix/`
- Commit message format: [conventional/other]
- Required reviewers: [number]

### Testing Requirements
- Minimum coverage: [percent]%
- Required test types: [unit/integration/e2e]

### Framework-Specific
[Add rules for your stack]
```

### Step 4: Pin Version (Recommended)

Lock to a specific version for stability:

```bash
# Record current version
echo "CODEASSIST_VERSION=1.0.5" >> .env.example
```

Document in README:
```markdown
## Development Setup

Install CodeAssist (pinned version):
\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/v1.0.5/scripts/install-codeassist.sh | bash
\`\`\`
```

### Step 5: Commit Configuration

```bash
git add .claude/
git commit -m "chore: add CodeAssist team configuration"
git push
```

---

## Phase 2: Team Onboarding

**Time:** 10 minutes per developer

### For Each Team Member

#### Step 1: Pull Latest

```bash
git pull origin main
```

CodeAssist is now available (committed in `.claude/`).

#### Step 2: Verify Installation

```bash
cat .claude/VERSION
```

Should show the team's pinned version.

#### Step 3: Try Key Commands

```bash
# In Claude Code:
/quickstart      # Interactive onboarding
/status          # See project state
/guide           # Get suggestions
```

#### Step 4: Review Team Conventions

Read `.claude/CLAUDE.md` to understand team-specific rules.

---

## Phase 3: Workflow Integration

### Daily Workflow

| Stage | Command | Purpose |
|-------|---------|---------|
| Start work | `/status` | Check current state |
| Plan feature | `/brainstorm` + `/plan` | Think before coding |
| During work | `/laravel`, `/react`, or `/python` | Framework help |
| Before commit | `/review` + `/verify` | Quality check |
| Commit | `/commit` | Consistent commits |

### Code Review Process

**Author:**
```bash
/review          # Self-review first
/verify          # Final checks
git push
```

**Reviewer:**
```bash
/explore         # Understand changes
/security        # Security check (if relevant)
```

### CI/CD Integration

Copy a team template:

```bash
# GitLab
cp docs/ci-templates/gitlab/[stack].yml .gitlab-ci.yml

# GitHub
mkdir -p .github/workflows
cp docs/ci-templates/github/[stack].yml .github/workflows/ci.yml
```

Customize for your team's needs.

---

## Phase 4: Maintenance

### Updating CodeAssist

When the team decides to update:

1. **Lead developer updates:**
   ```bash
   curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
   ```

2. **Review changes:**
   ```bash
   git diff .claude/
   ```

3. **Commit and push:**
   ```bash
   git add .claude/
   git commit -m "chore: update CodeAssist to v1.0.6"
   git push
   ```

4. **Team pulls:**
   ```bash
   git pull
   ```

### Adding Team-Specific Commands

Create custom commands in `.claude/commands/`:

```markdown
# /deploy.md

Deploy to staging environment.

## Steps
1. Run tests
2. Build application
3. Deploy to staging
4. Notify team in Slack

[Your deployment instructions]
```

### Resolving Conflicts

If `.claude/` files conflict during merge:

```bash
# Accept incoming (updated) version
git checkout --theirs .claude/
git add .claude/

# Or resolve manually
git mergetool .claude/CLAUDE.md
```

---

## Checklist Summary

### Lead Developer
- [ ] Install CodeAssist
- [ ] Remove from `.gitignore`
- [ ] Add team conventions to `CLAUDE.md`
- [ ] Pin version in documentation
- [ ] Commit and push
- [ ] Notify team

### Each Team Member
- [ ] Pull latest code
- [ ] Verify version matches
- [ ] Run `/quickstart`
- [ ] Review team conventions
- [ ] Try key commands

### Ongoing
- [ ] Scheduled version updates (quarterly?)
- [ ] Review and update conventions
- [ ] Add team-specific commands as needed

---

## Troubleshooting

### "Command not found"

```bash
# Verify .claude/ exists
ls -la .claude/

# If missing, pull latest
git pull origin main
```

### Different versions across team

```bash
# Check version
cat .claude/VERSION

# If outdated, pull latest
git pull origin main
```

### Conventions not being followed

1. Review `.claude/CLAUDE.md` - are conventions clear?
2. Add more specific examples
3. Consider adding to PR template

---

## Questions?

- `/feedback [question]` - Report issues
- Open team discussion - Share learnings
- Check `docs/team-usage.md` - More details
