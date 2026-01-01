# Solo vs Team Usage

CodeAssist works for solo developers out of the box. Teams need additional considerations.

**Ready to adopt for your team?** See [team-adoption.md](team-adoption.md) for step-by-step instructions.

## Current State: Solo Developer

CodeAssist is optimized for:
- One developer, one machine
- Personal preferences in `.claude/`
- No coordination with others
- Direct control over all settings

## Team Implications

When multiple developers use CodeAssist on the same project:

### What Works

| Feature | Team-Safe? | Notes |
|---------|------------|-------|
| Skills | Yes | Read-only guidance |
| Commands | Yes | Same behavior for everyone |
| CI templates | Yes | Committed to repo |
| Scripts | Yes | Shared tooling |

### What Doesn't Work (Yet)

| Feature | Issue | Workaround |
|---------|-------|------------|
| `.claude/` in gitignore | Each dev has different version | Commit `.claude/` or use install script |
| Personal settings | No per-user config | Use environment variables |
| Database backups | Local paths hardcoded | Configure backup path |

## Team Setup Options

### Option 1: Commit CodeAssist (Recommended for Teams)

```bash
# Remove from .gitignore
sed -i '/.claude/d' .gitignore

# Commit CodeAssist files
git add .claude/
git commit -m "Add CodeAssist configuration"
```

**Pros:**
- Everyone has same version
- Custom commands shared
- Project-specific settings

**Cons:**
- Updates require PR
- Larger repo

### Option 2: Install Script (Current Default)

Each developer runs:
```bash
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/install-codeassist.sh | bash
```

**Pros:**
- Always latest version
- No repo bloat

**Cons:**
- Version drift between developers
- "Works on my machine" issues

### Option 3: Pin Version (Best for Stability)

```bash
# In project setup docs
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/v1.0.5/scripts/install-codeassist.sh | bash
```

**Pros:**
- Everyone on same version
- Controlled updates

**Cons:**
- Manual version bumps

## Team-Specific Considerations

### Code Style Consistency

**Issue:** Different developers get different suggestions.

**Solution:** Add project conventions to `.claude/CLAUDE.md`:
```markdown
## Project Conventions

- Use tabs, not spaces
- Function names: camelCase
- Max line length: 120
- Always use TypeScript strict mode
```

### Shared Database

**Issue:** Multiple developers running tests against same database.

**Solution:** Use isolated test databases:
```bash
# Each dev gets own test DB
export TEST_DB_NAME="myapp_test_${USER}"
```

Or use Docker:
```yaml
# docker-compose.override.yml (gitignored)
services:
  db:
    ports:
      - "${DB_PORT:-5432}:5432"
```

### CI/CD Secrets

**Issue:** Private registry credentials.

**Solution:** Use CI variables, not committed config:
```yaml
# .gitlab-ci.yml
variables:
  REGISTRY: ${CI_REGISTRY_IMAGE}  # Set in GitLab settings
```

### Custom Commands

**Issue:** Developer-specific commands cluttering shared config.

**Solution:** Use `.claude/commands.local/` (gitignored):
```
.claude/
├── commands/           # Shared (committed)
├── commands.local/     # Personal (gitignored)
└── CLAUDE.md
```

## Team Checklist

Before team adoption:

- [ ] Decide: Commit `.claude/` or use install script?
- [ ] Add project conventions to CLAUDE.md
- [ ] Configure test database isolation
- [ ] Set up CI/CD with proper secrets management
- [ ] Document team-specific workflows
- [ ] Pin CodeAssist version in setup docs

## Future Team Features

Not implemented yet, but planned:

| Feature | Description |
|---------|-------------|
| Per-user settings | `~/.claude/settings.yml` overrides |
| Team mode | Shared context across sessions |
| Code review routing | Assign reviews to team members |
| Conflict detection | Warn about concurrent edits |

## Migration Path

**Solo → Team:**
1. Audit `.claude/` for personal preferences
2. Move personal settings to environment variables
3. Commit shared configuration
4. Document setup in project README
5. Add to onboarding docs

**Team → Enterprise:**
1. Centralize skill management
2. Add audit logging
3. Integrate with SSO
4. Custom compliance skills

## Questions?

Open an issue or use `/feedback [your question]`.
