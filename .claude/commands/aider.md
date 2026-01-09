# Aider Code Generation

Delegate code generation to Aider with Ollama to save context tokens.

## Task
$ARGUMENTS

## Aider Delegation Protocol

You are delegating a code generation task to Aider. Configuration is in `.aider.conf.yml`.

### Configuration

Aider is configured via `.aider.conf.yml` in the project root:
- **Model**: `ollama/qwen3-coder`
- **Ollama Host**: `http://ollama.cerberus-kitchen.ts.net:11434`
- **Auto-commits**: Disabled (review first)

### When to Use Aider

**Good for Aider:**
- Boilerplate generation
- Simple refactors
- Adding comments/docstrings
- Repetitive pattern application
- File scaffolding
- Single-file edits
- Mechanical transformations

**Keep in Claude Code:**
- Architecture decisions
- Complex debugging
- Multi-file coordination requiring reasoning
- Security analysis
- Code review

### Execution Steps

1. **Identify target files**: Determine which files Aider should work on
2. **Formulate task**: Create a clear, specific prompt for Aider
3. **Run Aider**: Execute with handoff mode

### Running Aider

Since config is in `.aider.conf.yml`, commands are simple:

```bash
# Basic usage - config handles model, host, and settings
aider --message "[TASK]" [FILES]
```

### Command Flags Reference

| Flag | Purpose |
|------|---------|
| `--message "..."` | The task to perform |
| `--file [path]` | Add file to context |
| `--edit-format diff` | Use diff format (more reliable) |
| `--config [path]` | Use alternate config file |

### Example Delegations

```bash
# Add docstrings to a file
aider --message "Add docstrings to all public functions" src/utils.py

# Generate boilerplate
aider --message "Create a React component called UserCard with props: name, email, avatar" \
  src/components/UserCard.tsx

# Simple refactor
aider --message "Convert this class to use arrow functions" src/handlers.js

# Multiple files
aider --message "Add error handling to all API calls" src/api/*.ts
```

### Post-Aider Steps

After Aider completes:
1. **Review changes**: `git diff` to see what changed
2. **Test**: Run relevant tests
3. **Adjust**: Make any needed fixes (Claude Code handles complex adjustments)
4. **Commit**: Use `/commit` when satisfied

### Output Format

```
## Aider Delegation: [Task Summary]

### Files
- [file1]
- [file2]

### Command Executed
[aider command]

### Result
[success/failure]

### Changes Made
[summary of what aider did]

### Review Status
- [ ] Changes reviewed
- [ ] Tests pass
- [ ] Ready to commit
```

Execute the aider delegation now. If aider is not available or fails, inform the user of the error and suggest alternatives.
