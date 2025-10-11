# Wiki Setup & Documentation Strategy Guide

*Complete guide to using GitHub/GitLab wikis as optional documentation platforms*

---

## 📚 Overview

Both GitHub and GitLab provide integrated wiki features that can serve as alternative or complementary documentation platforms. This guide covers when and how to use wikis effectively.

**Wiki vs Repository Docs**:

| Feature | Repository Docs (`/docs/`) | Wiki |
|---------|---------------------------|------|
| **Version control** | Same as code | Separate git repo |
| **Code review** | Via PRs/MRs | Direct editing |
| **Access** | Code access required | Can be public/private |
| **Searchability** | In code searches | Separate search |
| **Backup** | With code | Separate clone |
| **CI/CD** | Can auto-deploy | Manual or scripted |
| **Best for** | Technical docs, code comments | User guides, knowledge base |

---

## 🎯 When to Use Wikis

### ✅ **Use Wikis For**:
1. **User Documentation** - Installation guides, user manuals
2. **Knowledge Base** - FAQs, troubleshooting guides
3. **Meeting Notes** - Team decisions, architecture discussions
4. **Process Documentation** - Onboarding, workflows
5. **Quick Reference** - Command cheatsheets, API quick refs
6. **Living Documents** - Frequently updated content
7. **Non-Developer Contributions** - Easy editing without Git knowledge

### ❌ **Don't Use Wikis For**:
1. **API Documentation** - Keep with code in `/docs/`
2. **Code Comments** - Inline documentation
3. **Technical Specifications** - Version with code
4. **Configuration Examples** - Should be in repo
5. **Critical Documentation** - That needs code review
6. **Automated Docs** - Generated from code

---

## 🔧 GitHub Wiki Setup

### Enable Wiki

**Via Web UI**:
1. Go to repository → Settings
2. Scroll to "Features"
3. Check ✅ "Wikis"

**Via GitHub CLI**:
```bash
gh repo edit owner/repo --enable-wiki=true
```

### Clone Wiki Repository

Wikis are separate Git repositories:

```bash
# Clone the wiki
git clone https://github.com/owner/repo.wiki.git

# Or if already cloned
cd repo.wiki
git pull origin master
```

### Wiki Structure

```
repo.wiki/
├── Home.md                    # Landing page (required)
├── Installation.md            # Installation guide
├── User-Guide.md              # User documentation
├── API-Reference.md           # Quick API reference
├── Troubleshooting.md         # Common issues
├── Development-Setup.md       # Developer onboarding
├── Architecture-Decisions.md  # ADRs
├── images/                    # Image assets (GitHub)
│   ├── diagram.png
│   └── screenshot.png
└── _Sidebar.md               # Custom sidebar (optional)
```

### Create Home Page

**Home.md**:
```markdown
# Project Name Wiki

Welcome to the Project Name wiki!

## 📚 Documentation

### Getting Started
- [Installation](Installation)
- [Quick Start](Quick-Start)
- [Configuration](Configuration)

### User Guides
- [User Manual](User-Guide)
- [API Reference](API-Reference)
- [Examples](Examples)

### Developer Documentation
- [Development Setup](Development-Setup)
- [Contributing Guidelines](Contributing)
- [Architecture Decisions](Architecture-Decisions)

### Support
- [Troubleshooting](Troubleshooting)
- [FAQ](FAQ)
- [Contact & Support](Support)

## 🔗 External Links
- [Main Repository](https://github.com/owner/repo)
- [Issue Tracker](https://github.com/owner/repo/issues)
- [Discussions](https://github.com/owner/repo/discussions)

---

*Last updated: 2025-01-11*
```

### Create Sidebar

**_Sidebar.md**:
```markdown
### Navigation

**Getting Started**
- [Home](Home)
- [Installation](Installation)
- [Quick Start](Quick-Start)

**Guides**
- [User Guide](User-Guide)
- [API Reference](API-Reference)
- [Examples](Examples)

**Development**
- [Setup](Development-Setup)
- [Contributing](Contributing)
- [Architecture](Architecture-Decisions)

**Support**
- [Troubleshooting](Troubleshooting)
- [FAQ](FAQ)

---

[📖 Full Docs](https://github.com/owner/repo/tree/main/docs)
```

### Wiki Access Control

**Public repositories**: Wiki is public by default
**Private repositories**: Wiki inherits repository permissions

**Permissions**:
- **Read**: Anyone with repo read access
- **Write**: Anyone with repo write access
- **Admin**: Repository admins

**Restrict wiki editing**:
Go to Settings → disable "Restrict editing to collaborators only"

### Add Images to Wiki

```markdown
# Method 1: Upload via GitHub UI
![Description](images/diagram.png)

# Method 2: Reference from repo
![Description](https://raw.githubusercontent.com/owner/repo/main/docs/assets/diagram.png)

# Method 3: External URL
![Description](https://example.com/image.png)
```

### Wiki Templates

Create templates for consistency:

**Template: Installation Guide**:
```markdown
# Installing [Component Name]

## Prerequisites

- Requirement 1
- Requirement 2
- Requirement 3

## Installation Steps

### Step 1: [Action]

```bash
command here
```

### Step 2: [Action]

```bash
command here
```

## Verification

```bash
# Verify installation
command to verify
```

## Troubleshooting

**Issue**: Description
**Solution**: How to fix

## Next Steps

- [Configuration](Configuration)
- [Getting Started](Getting-Started)
```

---

## 🔧 GitLab Wiki Setup

### Enable Wiki

**Via Web UI**:
1. Go to project → Settings → General
2. Expand "Visibility, project features, permissions"
3. Enable ✅ "Wiki"

**Via GitLab CLI**:
```bash
glab api projects/:id --method PUT -f wiki_enabled=true
```

### Clone Wiki Repository

```bash
# Clone the wiki
git clone https://gitlab.com/owner/repo.wiki.git

# Or if already cloned
cd repo.wiki
git pull origin master
```

### Wiki Structure

```
repo.wiki/
├── home.md                    # Landing page (required)
├── installation.md            # Installation guide
├── user-guide.md              # User documentation
├── api-reference.md           # Quick API reference
├── troubleshooting.md         # Common issues
├── development-setup.md       # Developer onboarding
├── architecture-decisions.md  # ADRs
└── uploads/                   # Uploaded files
    ├── diagram.png
    └── screenshot.png
```

### Create Home Page

**home.md**:
```markdown
# Project Name Wiki

Welcome to the Project Name documentation!

## 📚 Table of Contents

### Getting Started
- [[installation]]
- [[quick-start]]
- [[configuration]]

### User Documentation
- [[user-guide]]
- [[api-reference]]
- [[examples]]

### Developer Documentation
- [[development-setup]]
- [[contributing]]
- [[architecture-decisions]]

### Support
- [[troubleshooting]]
- [[faq]]

## 🔗 Quick Links

- [Main Repository](https://gitlab.com/owner/repo)
- [Issue Tracker](https://gitlab.com/owner/repo/issues)
- [CI/CD Pipelines](https://gitlab.com/owner/repo/pipelines)

---

*Last updated: 2025-01-11*
```

### Wiki Syntax (GitLab)

```markdown
# Internal links
[[page-name]]
[[page-name|Display Text]]

# Images from uploads
![Alt text](uploads/image.png)

# Images from repository
![Alt text](/uploads/abc123/image.png)

# External images
![Alt text](https://example.com/image.png)

# Tables
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

# Code blocks with syntax highlighting
```python
def hello():
    print("Hello, World!")
```
```

### Wiki Access Control

**Project visibility**:
- Public project: Wiki can be public or private
- Internal project: Wiki visible to authenticated users
- Private project: Wiki only for project members

**Permissions**:
- **Guest**: Can view wiki (if enabled)
- **Reporter**: Can view wiki
- **Developer**: Can create and edit wiki pages
- **Maintainer**: Can delete wiki pages
- **Owner**: Full wiki control

**Configure wiki access**:
```bash
# Set wiki access level
glab api projects/:id --method PUT -f wiki_access_level=enabled
# Options: disabled, private, enabled
```

### Wiki Features (GitLab)

**Unique GitLab features**:
- ✅ **Rich text editor** - WYSIWYG option
- ✅ **Page history** - Full version control
- ✅ **Page templates** - Reusable page structures
- ✅ **Table of contents** - Auto-generated TOC
- ✅ **Syntax highlighting** - For code blocks
- ✅ **Math equations** - LaTeX support

---

## 📋 Documentation Strategy

### Hybrid Approach (Recommended)

**Repository `/docs/` folder**:
- ✅ API documentation
- ✅ Code architecture
- ✅ Technical specifications
- ✅ Configuration examples
- ✅ Developer guides
- ✅ Change logs (CHANGELOG.md)

**Wiki**:
- ✅ User installation guides
- ✅ FAQ / Troubleshooting
- ✅ Getting started tutorials
- ✅ Architecture Decision Records (ADRs)
- ✅ Meeting notes
- ✅ Process documentation
- ✅ Quick reference sheets

**Benefits**:
- Technical docs version with code
- User docs easier to update
- Clear separation of concerns
- Both easily accessible

### Cross-Reference Strategy

**Link from repo docs to wiki**:

```markdown
# In /docs/README.md

## Additional Resources

- [User Installation Guide](https://github.com/owner/repo/wiki/Installation) (Wiki)
- [FAQ](https://github.com/owner/repo/wiki/FAQ) (Wiki)
- [Quick Start](https://github.com/owner/repo/wiki/Quick-Start) (Wiki)
```

**Link from wiki to repo docs**:

```markdown
# In wiki

## Developer Documentation

For technical documentation, see:
- [API Documentation](https://github.com/owner/repo/blob/main/docs/api.md)
- [Architecture](https://github.com/owner/repo/blob/main/docs/architecture.md)
- [Contributing Guide](https://github.com/owner/repo/blob/main/CONTRIBUTING.md)
```

---

## 🔄 Synchronization Strategies

### Keep Wiki in Sync with Code

**Option 1: Manual updates** (Simple)
- Update wiki when major features are added
- Add to PR checklist: "Update wiki if user-facing changes"

**Option 2: Automated sync** (Advanced)

**GitHub Action to sync docs → wiki**:
```yaml
# .github/workflows/sync-wiki.yml
name: Sync Wiki

on:
  push:
    branches: [ main ]
    paths:
      - 'docs/wiki/**'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Clone wiki repository
        run: |
          git clone https://github.com/${{ github.repository }}.wiki.git wiki

      - name: Copy documentation
        run: |
          cp -r docs/wiki/* wiki/
          cd wiki
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add .
          git commit -m "Sync from main repository" || exit 0
          git push
```

**GitLab CI to sync docs → wiki**:
```yaml
# .gitlab-ci.yml
sync-wiki:
  stage: deploy
  script:
    - git clone https://gitlab.com/${CI_PROJECT_PATH}.wiki.git wiki
    - cp -r docs/wiki/* wiki/
    - cd wiki
    - git config user.name "GitLab CI"
    - git config user.email "ci@gitlab.com"
    - git add .
    - git commit -m "Sync from main repository" || exit 0
    - git push
  only:
    - main
  when: manual
```

### Backup Wiki

**Clone wiki regularly**:
```bash
#!/bin/bash
# backup-wiki.sh

GITHUB_REPO="owner/repo"
BACKUP_DIR="./wiki-backups"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Clone wiki
git clone "https://github.com/${GITHUB_REPO}.wiki.git" "${BACKUP_DIR}/wiki-${DATE}"

# Create archive
cd "${BACKUP_DIR}"
tar -czf "wiki-${DATE}.tar.gz" "wiki-${DATE}"
rm -rf "wiki-${DATE}"

echo "✅ Wiki backed up to: ${BACKUP_DIR}/wiki-${DATE}.tar.gz"
```

**Automated backup** (cron):
```bash
# Run daily at 3 AM
0 3 * * * /path/to/backup-wiki.sh
```

---

## 📝 Wiki Templates

### Template: Feature Documentation

```markdown
# [Feature Name]

## Overview

Brief description of what this feature does.

## Prerequisites

- Requirement 1
- Requirement 2

## Usage

### Basic Usage

```bash
# Example command
command --option value
```

### Advanced Usage

```bash
# More complex example
command --advanced --option value
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | "default" | What it does |
| option2 | boolean | false | What it does |

## Examples

### Example 1: Common Use Case

Description of use case.

```bash
# Code example
command here
```

### Example 2: Advanced Use Case

Description of use case.

```bash
# Code example
command here
```

## Troubleshooting

**Issue**: Common problem
**Cause**: Why it happens
**Solution**: How to fix

## See Also

- [Related Feature](Related-Feature)
- [API Reference](API-Reference)
```

### Template: Troubleshooting Guide

```markdown
# Troubleshooting

## Common Issues

### Issue 1: [Problem Description]

**Symptoms**:
- Symptom 1
- Symptom 2

**Cause**:
Explanation of root cause.

**Solution**:
```bash
# Commands to fix
fix-command
```

**Prevention**:
How to avoid this in future.

---

### Issue 2: [Problem Description]

[Same structure as above]

---

## Getting Help

If you can't find a solution here:

1. Check [FAQ](FAQ)
2. Search [existing issues](https://github.com/owner/repo/issues)
3. Ask in [Discussions](https://github.com/owner/repo/discussions)
4. Create a [new issue](https://github.com/owner/repo/issues/new)

## Diagnostic Commands

```bash
# Check version
command --version

# View logs
tail -f /var/log/app.log

# Test configuration
command config test
```
```

---

## 🎯 Best Practices

### Content Organization
1. ✅ **Clear navigation** - Use sidebar and home page table of contents
2. ✅ **Consistent naming** - Use kebab-case for page names
3. ✅ **Cross-linking** - Link related pages together
4. ✅ **Search-friendly** - Use descriptive titles and headers
5. ✅ **Version notes** - Add "Last updated" timestamps

### Writing Style
1. ✅ **User-focused** - Write for your audience
2. ✅ **Action-oriented** - Use verbs, clear steps
3. ✅ **Examples** - Show, don't just tell
4. ✅ **Concise** - Get to the point quickly
5. ✅ **Visual** - Use diagrams and screenshots

### Maintenance
1. ✅ **Regular reviews** - Quarterly doc audits
2. ✅ **Update on releases** - Keep in sync with features
3. ✅ **Archive old content** - Don't delete, archive
4. ✅ **Link checking** - Verify links periodically
5. ✅ **Backup regularly** - Clone wiki to backups

### Team Collaboration
1. ✅ **Wiki guidelines** - Document your wiki standards
2. ✅ **Review process** - Even wikis benefit from review
3. ✅ **Templates** - Provide reusable page templates
4. ✅ **Ownership** - Assign page owners
5. ✅ **Changelog** - Track major wiki updates

---

## ✅ Checklist: Setting Up Wiki

### Initial Setup
- [ ] Enable wiki in repository/project settings
- [ ] Clone wiki repository locally
- [ ] Create home page with navigation
- [ ] Create sidebar (if supported)
- [ ] Set up access permissions
- [ ] Create initial page structure

### Content
- [ ] Installation guide
- [ ] Quick start guide
- [ ] User manual / guide
- [ ] API quick reference
- [ ] Troubleshooting guide
- [ ] FAQ
- [ ] Contributing guidelines (or link to repo)

### Organization
- [ ] Consistent page naming convention
- [ ] Clear navigation structure
- [ ] Cross-links between related pages
- [ ] Images organized in folders
- [ ] Templates created for common pages

### Maintenance
- [ ] Backup strategy implemented
- [ ] Update process documented
- [ ] Sync with code docs (if applicable)
- [ ] Review schedule established
- [ ] Team trained on wiki editing

---

## 🔗 Integration with Development Workflow

### Update Wiki in PR/MR Checklist

**Add to `.github/pull_request_template.md`**:
```markdown
## Checklist

- [ ] Code changes completed
- [ ] Tests added/updated
- [ ] Documentation updated in `/docs/`
- [ ] Wiki updated (if user-facing changes)
- [ ] CHANGELOG.md updated
```

### Link to Wiki in README

**README.md**:
```markdown
## Documentation

- **[User Guide](https://github.com/owner/repo/wiki/User-Guide)** - Installation and usage
- **[API Documentation](docs/api.md)** - Technical API reference
- **[FAQ](https://github.com/owner/repo/wiki/FAQ)** - Common questions
- **[Troubleshooting](https://github.com/owner/repo/wiki/Troubleshooting)** - Problem solving
```

---

## 📊 Wiki vs Docs Matrix

| Documentation Type | Location | Audience | Update Frequency |
|-------------------|----------|----------|------------------|
| API Reference | `/docs/api.md` | Developers | With code changes |
| Architecture | `/docs/architecture.md` | Developers | Quarterly |
| Installation | Wiki | Users | With releases |
| User Guide | Wiki | Users | With features |
| FAQ | Wiki | All | As needed |
| Troubleshooting | Wiki | All | As needed |
| Contributing | `CONTRIBUTING.md` | Contributors | Yearly |
| Changelog | `CHANGELOG.md` | All | With releases |
| Meeting Notes | Wiki | Team | After meetings |
| ADRs | Wiki or `/docs/adr/` | Team | With decisions |

---

*Good documentation in the right place makes everyone's life easier!*
