# Update Documentation

Sync documentation with code changes.

## Scope
$ARGUMENTS

## Protocol

### 1. Identify What Changed

```bash
# Recent changes
git diff --name-only HEAD~5

# Changed since last doc update
git log --oneline --since="1 week ago"
```

### 2. Documentation Types to Update

| Type | Location | When to Update |
|------|----------|----------------|
| README | `README.md` | New features, setup changes |
| API docs | `docs/api/` | Endpoint changes |
| Code comments | In source | Complex logic changes |
| CHANGELOG | `CHANGELOG.md` | Every release |
| Config docs | `docs/config/` | New options |

### 3. Update Checklist

- [ ] README reflects current features
- [ ] API documentation matches endpoints
- [ ] Installation instructions work
- [ ] Configuration options documented
- [ ] Examples are current and working
- [ ] CHANGELOG has recent changes

### 4. Documentation Standards

**Good documentation:**
- Explains WHY, not just WHAT
- Includes working examples
- Stays concise
- Uses consistent formatting

**Avoid:**
- Documenting obvious code
- Outdated examples
- Duplicating information
- Over-explaining simple concepts

### Output Format

```
## Documentation Update

### Files Updated
| File | Changes |
|------|---------|
| README.md | Added new feature section |
| docs/api.md | Updated endpoint params |

### New Documentation
- [file]: [description]

### Removed (Outdated)
- [file]: [reason]

### Verification
- [ ] Links work
- [ ] Examples run
- [ ] No stale references
```

Execute documentation sync now.
