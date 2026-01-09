# Quickstart

Interactive onboarding for new CodeAssist users.

## Execute

Welcome the user and guide them through CodeAssist setup.

### Step 1: Confirm Installation

First, verify CodeAssist is properly installed:

```bash
# Check version
cat .claude/VERSION 2>/dev/null || echo "NOT INSTALLED"
```

If not installed, guide them:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

### Step 2: Understand the Project

Ask about their project:

**Questions to ask:**
1. What framework are you using? (Laravel, React, Python/Django, other)
2. Do you have a database that needs protection?
3. Are you working solo or on a team?

### Step 3: Recommend Commands

Based on their answers, recommend the most useful commands:

**For Laravel developers:**
```
/laravel [task]  - Laravel-specific assistance
/test            - Run tests with database backup
/backup          - Manual database backup
```

**For React developers:**
```
/react [task]    - React/Next.js assistance
/test            - Run tests
/review          - Code review before commit
```

**For Python developers:**
```
/python [task]   - Django/FastAPI assistance
/test            - Run tests
/security        - Security audit
```

**For everyone:**
```
/status          - Check git status
/mentor [topic]  - Get critical feedback
/guide           - Contextual help
```

### Step 4: Set Up Project Config (Optional)

If they want to customize, guide them to edit `.claude/CLAUDE.md`:

```markdown
## Project Conventions

Add your project-specific rules here:
- Code style preferences
- Testing requirements
- Deployment notes
```

### Step 5: Quick Demo

Offer to demonstrate with their actual project:

```
Would you like me to:
1. Run /status to show your project state?
2. Run /guide to suggest what to do next?
3. Explore your codebase structure?
```

## Output Format

```
## Welcome to CodeAssist!

**Version:** [version]
**Project:** [detected framework or "Unknown"]

### Your Personalized Setup

Based on your project, here are your key commands:

| Command | What it does |
|---------|--------------|
| [command] | [description] |

### Quick Start

Try this now:
\`\`\`
[recommended first command]
\`\`\`

### Next Steps

1. [First thing to try]
2. [Second thing to try]
3. [Where to learn more]

### Need Help?

- `/guide` - Contextual suggestions
- `/mentor [question]` - Direct answers
- `docs/INDEX.md` - Full documentation
```

Run the quickstart now. Be conversational and helpful.
