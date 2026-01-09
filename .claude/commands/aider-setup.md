# Aider Setup

Configure Aider for use with Ollama.

## Arguments
$ARGUMENTS

## Setup Protocol

Help the user configure `.aider.conf.yml` for their environment.

### Current Configuration

First, read the current config:
```bash
cat .aider.conf.yml
```

### Configuration Options

Ask the user what they want to change:

1. **Ollama Host** - Where is Ollama running?
   - Local: `http://localhost:11434`
   - Remote: `http://[hostname]:11434`
   - Tailscale: `http://[machine].[tailnet]:11434`

2. **Model** - Which Ollama model to use?
   - `ollama/qwen3-coder` - Fast, good for code
   - `ollama/codellama` - Meta's code model
   - `ollama/deepseek-coder` - Strong reasoning
   - `ollama/llama3.1` - General purpose

3. **Behavior Settings**
   - `auto-commits`: Auto-commit after changes (default: false)
   - `yes-always`: Non-interactive mode (default: true)

### Config File Format

```yaml
# .aider.conf.yml

# Model (required)
model: ollama/[model-name]

# Ollama API Base URL (required for remote)
ollama-api-base: http://[host]:11434

# Behavior
auto-commits: false
yes-always: true

# Output
dark-mode: true
pretty: true
stream: true
```

### Verification

After updating config, verify connection:
```bash
# Test Ollama is reachable
curl -s http://[host]:11434/api/tags | head -20

# Test aider can connect
aider --message "Say hello" --no-git
```

### Output

After setup, show:
```
## Aider Configuration Updated

| Setting | Value |
|---------|-------|
| Model | [model] |
| Ollama Host | [host] |
| Auto-commits | [yes/no] |

Test with: /aider add a comment to [any file]
```
