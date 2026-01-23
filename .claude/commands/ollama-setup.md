# Ollama Setup

Configure Ollama as a local LLM backend for CodeAssist autonomous development.

## Context
$ARGUMENTS

## Overview

Ollama v0.14.0+ supports the Anthropic Messages API, enabling:
- Run autonomous development with local models (qwen3-coder, codellama)
- Hybrid mode: Claude for critical tasks, Ollama for simpler ones
- Fully offline/private mode with no cloud API calls
- Cost optimization by offloading tasks to self-hosted LLMs

## Prerequisites

### Step 1: Install Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download

# Verify installation (requires v0.14.0+)
ollama --version
```

### Step 2: Pull Recommended Models

```bash
# Best for coding tasks
ollama pull qwen3-coder

# Alternatives
ollama pull codellama:34b
ollama pull deepseek-coder:33b
ollama pull glm-4.7:cloud      # Cloud model via Ollama
ollama pull minimax-m2.1:cloud  # Cloud model via Ollama
```

### Step 3: Start Ollama Server

```bash
# Start server (default: http://localhost:11434)
ollama serve

# Or with custom host (for remote access)
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

## Configuration

### Configuration Hierarchy

Ralph Runner uses a layered configuration system (highest to lowest priority):

1. **CLI flags**: `--provider=ollama --model=qwen3-coder`
2. **Environment variables**: `CODEASSIST_PROVIDER=ollama`
3. **Project config**: `.claude/autonomous.yml`
4. **User config**: `~/.claude/codeassist.yml`
5. **Built-in defaults**: Claude API

### User Configuration (Recommended)

Create `~/.claude/codeassist.yml` for user-level settings that apply across all projects:

```yaml
# ~/.claude/codeassist.yml
providers:
  default: claude  # or ollama

  claude:
    model: claude-sonnet-4-20250514

  ollama:
    base_url: http://localhost:11434
    model: qwen3-coder

defaults:
  target_score: 95
  preset: default  # or ollama_hybrid, ollama_only
```

You can copy the template from `templates/codeassist.yml`.

### Environment Variables

```bash
# Override provider via environment
export CODEASSIST_PROVIDER=ollama
export OLLAMA_BASE_URL=http://localhost:11434

# For Claude Code direct usage (not ralph-runner)
export ANTHROPIC_BASE_URL=http://localhost:11434
export ANTHROPIC_API_KEY=ollama  # Required but not validated
```

### Project Configuration

Add to `.claude/autonomous.yml` for project-specific overrides:

```yaml
providers:
  default: ollama  # or claude

  ollama:
    enabled: true
    base_url: http://localhost:11434  # or your server
    model: qwen3-coder

  # Per-gate overrides (hybrid mode)
  gate_providers:
    test: claude      # Critical - use Claude
    security: claude  # Critical - use Claude
    build: ollama     # Simple - use Ollama
    review: ollama    # Can work locally
    mentor: claude    # Needs reasoning
    ux: ollama
    architect: ollama
    devops: ollama
```

## Usage Modes

### Mode 1: Hybrid (Recommended)

Use Claude for critical gates, Ollama for others:

```bash
/autonomous --issue 123 --preset ollama_hybrid
```

**Cost savings:** ~60% reduction in API calls
**Accuracy:** High (critical tasks still use Claude)

### Mode 2: Fully Local

No cloud API calls - complete privacy:

```bash
/autonomous --issue 123 --preset ollama_only
```

**Cost savings:** 100% (no API costs)
**Accuracy:** Good for simpler tasks, may need lower thresholds

### Mode 3: Claude Default with Ollama Fallback

Use Claude normally, fall back to Ollama on rate limits:

```yaml
providers:
  default: claude
  fallback: ollama
  fallback_on:
    - rate_limit
    - api_error
```

## Remote Ollama Server

### On Your Server (e.g., Tailscale network)

```bash
# Start Ollama with network access
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# With GPU support
OLLAMA_HOST=0.0.0.0:11434 CUDA_VISIBLE_DEVICES=0 ollama serve
```

### In Your Config

```yaml
providers:
  ollama:
    enabled: true
    base_url: http://ollama.your-server.ts.net:11434
    model: qwen3-coder
```

## Model Recommendations

| Model | Size | Best For | Speed |
|-------|------|----------|-------|
| `qwen3-coder` | 32B | General coding | Fast |
| `codellama:34b` | 34B | Code completion | Medium |
| `deepseek-coder:33b` | 33B | Complex reasoning | Slow |
| `glm-4.7:cloud` | Cloud | High quality | Fast |

## Verification

```bash
# Test Ollama is running
curl http://localhost:11434/api/tags

# Test Anthropic API compatibility
curl http://localhost:11434/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: ollama" \
  -d '{
    "model": "qwen3-coder",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Output Format

```
## Ollama Setup Complete

### Installation
| Component | Status |
|-----------|--------|
| Ollama CLI | [version] |
| Server | Running on [url] |
| Models | [list of pulled models] |

### Configuration
- Base URL: http://localhost:11434
- Default model: qwen3-coder
- Mode: [hybrid/ollama_only/fallback]

### Test Results
| Test | Status |
|------|--------|
| Server connection | [pass/fail] |
| API compatibility | [pass/fail] |
| Model response | [pass/fail] |

### Next Steps

**Use Ollama for autonomous development:**
```bash
# Hybrid mode (recommended)
/autonomous --issue 123 --preset ollama_hybrid

# Fully local
/autonomous --issue 123 --preset ollama_only
```

**Configure in autonomous.yml:**
```yaml
providers:
  default: ollama
  ollama:
    enabled: true
    base_url: http://localhost:11434
    model: qwen3-coder
```
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Start server: `ollama serve` |
| "Model not found" | Pull model: `ollama pull qwen3-coder` |
| Slow responses | Use smaller model or add GPU |
| Poor code quality | Use hybrid mode for critical gates |
| Out of memory | Use quantized model: `qwen3-coder:q4_0` |

## References

- [Ollama Anthropic Compatibility](https://docs.ollama.com/api/anthropic-compatibility)
- [Ollama v0.14.0 Release](https://github.com/ollama/ollama/releases/tag/v0.14.0)
- [Claude Code with Ollama](https://ollama.com/blog/claude)

Start Ollama setup now.
