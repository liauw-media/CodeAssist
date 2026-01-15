# Plugin Setup

Install recommended Claude Code plugins to extend functionality.

## Task
$ARGUMENTS

## Plugin Setup Protocol

**Plugins add agents, commands, and capabilities to Claude Code.**

### Step 1: Update Marketplaces

```bash
claude plugin marketplace update
```

### Step 2: Check Installed Plugins

```bash
claude plugin list
```

### Step 3: Choose Plugins by Category

Present these options to the user:

---

## Official Anthropic Plugins (claude-plugins-official)

| Plugin | Description | Install |
|--------|-------------|---------|
| **code-simplifier** | Simplify code after work sessions (Opus) | `claude plugin install code-simplifier` |
| **security-guidance** | Security warnings and best practices | `claude plugin install security-guidance` |
| **code-review** | Multi-agent review with confidence scoring | `claude plugin install code-review` |
| **pr-review-toolkit** | Six-pass PR analysis | `claude plugin install pr-review-toolkit` |
| **feature-dev** | Structured feature development workflow | `claude plugin install feature-dev` |
| **frontend-design** | UI/UX specialist activation | `claude plugin install frontend-design` |

---

## LSP Plugins (Language Server Protocol)

Real-time type checking and error detection:

| Plugin | Language | Install |
|--------|----------|---------|
| **typescript-lsp** | TypeScript/JavaScript | `claude plugin install typescript-lsp@claude-code-lsps` |
| **pyright-lsp** | Python | `claude plugin install pyright-lsp@claude-code-lsps` |
| **rust-analyzer-lsp** | Rust | `claude plugin install rust-analyzer-lsp@claude-code-lsps` |
| **gopls-lsp** | Go | `claude plugin install gopls-lsp@claude-code-lsps` |
| **php-lsp** | PHP | `claude plugin install php-lsp@claude-code-lsps` |
| **jdtls-lsp** | Java | `claude plugin install jdtls-lsp@claude-code-lsps` |
| **csharp-lsp** | C# | `claude plugin install csharp-lsp@claude-code-lsps` |
| **swift-lsp** | Swift | `claude plugin install swift-lsp@claude-code-lsps` |
| **clangd-lsp** | C/C++ | `claude plugin install clangd-lsp@claude-code-lsps` |

---

## Framework Plugins

| Plugin | Framework | Install |
|--------|-----------|---------|
| **laravel-simplifier** | Laravel/PHP | `claude plugin install laravel-simplifier@laravel` |

---

## Recommended Bundles

### Minimal (All Projects)
```bash
claude plugin install code-simplifier
claude plugin install security-guidance
```

### TypeScript/JavaScript
```bash
claude plugin install code-simplifier
claude plugin install typescript-lsp@claude-code-lsps
claude plugin install security-guidance
```

### Python
```bash
claude plugin install code-simplifier
claude plugin install pyright-lsp@claude-code-lsps
claude plugin install security-guidance
```

### Laravel/PHP
```bash
claude plugin install laravel-simplifier@laravel
claude plugin install php-lsp@claude-code-lsps
claude plugin install security-guidance
```

### Full Stack (TypeScript + Python)
```bash
claude plugin install code-simplifier
claude plugin install typescript-lsp@claude-code-lsps
claude plugin install pyright-lsp@claude-code-lsps
claude plugin install pr-review-toolkit
claude plugin install security-guidance
```

---

### Step 4: Install Selected Plugins

Run the install commands for chosen plugins. Each install requires restart.

### Step 5: Verify Installation

```bash
claude plugin list
```

### Step 6: Restart Claude Code

Plugins require restart to activate:
```
Exit Claude Code and restart your session
```

---

## Boris Cherny's Recommended Plugins

Based on how the Claude Code creator uses it:

1. **code-simplifier** - Run after long coding sessions
2. **security-guidance** - Always-on security reminders
3. **pr-review-toolkit** - Before merging PRs

His workflow:
> "After a long coding session where Claude has been implementing features, run the code-simplifier to clean everything up in one pass."

---

## Plugin Sources

| Marketplace | Content |
|-------------|---------|
| `claude-plugins-official` | Anthropic's official plugins |
| `claude-code-lsps` | Language server integrations |
| `laravel` | Laravel-specific tools |

To add a marketplace:
```bash
claude plugin marketplace add owner/repo
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Plugin not found | `claude plugin marketplace update` first |
| Not loading after install | Restart Claude Code |
| LSP errors | Ensure language toolchain is installed |
| Permission denied | Check plugin scope (user vs project) |

---

## Output Format

```
## Plugin Setup Complete

**Installed Plugins:**
- [x] code-simplifier - Code cleanup after sessions
- [x] typescript-lsp - TypeScript type checking
- [x] security-guidance - Security warnings

**Marketplaces:**
- claude-plugins-official (default)
- claude-code-lsps

**Next Steps:**
1. Restart Claude Code
2. Test code-simplifier: "Simplify the code in src/"
3. Test LSP: Make a type error and see real-time feedback

**Quick Test:**
"Use the code-simplifier agent to clean up recent changes"
```

---

## Resources

- [Official Plugins](https://github.com/anthropics/claude-plugins-official)
- [Plugin Documentation](https://code.claude.com/docs/en/plugins)
- [Plugin Guide](https://www.petegypps.uk/blog/claude-code-official-plugin-marketplace-complete-guide-36-plugins-december-2025)

**Execute interactively. Ask the user their tech stack, then install matching plugins.**
