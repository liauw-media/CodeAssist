# Ollama Setup

Configure Ollama as a local/remote LLM backend for CodeAssist autonomous development.

## Context
$ARGUMENTS

## Overview

Ollama v0.14.0+ supports the Anthropic Messages API, enabling:
- Run autonomous development with local models
- Hybrid mode: Claude for critical tasks, Ollama for others
- Per-gate model selection for optimized performance
- Remote GPU server via Tailscale (zero-config VPN)
- Cost optimization: ~60-100% reduction in API calls

## Quick Start

```bash
# 1. Test your provider configuration
npx tsx scripts/ralph-runner.ts --test-provider

# 2. Run autonomous with Ollama
/autonomous --issue 123 --preset ollama_hybrid
```

## Architecture Options

### Option 1: Local GPU (Same Machine)

```
┌─────────────────────────────────────┐
│  Your Machine                       │
│  ┌─────────┐    ┌────────────────┐  │
│  │ Claude  │───▶│ Ollama Server  │  │
│  │  Code   │    │ localhost:11434│  │
│  └─────────┘    └────────────────┘  │
│                        │            │
│                 ┌──────▼──────┐     │
│                 │  GPU (RTX)  │     │
│                 └─────────────┘     │
└─────────────────────────────────────┘
```

### Option 2: Remote GPU via Tailscale (Recommended)

```
┌──────────────────┐     Tailscale      ┌──────────────────────┐
│  Your Machine    │    (encrypted)     │  GPU Server          │
│  ┌─────────┐     │◀──────────────────▶│  ┌────────────────┐  │
│  │ Claude  │─────┼────────────────────┼─▶│ Ollama Server  │  │
│  │  Code   │     │ ollama.server.ts   │  │ 0.0.0.0:11434  │  │
│  └─────────┘     │       .net:11434   │  └───────┬────────┘  │
└──────────────────┘                    │    ┌────▼─────┐      │
                                        │    │ RTX 3090 │      │
                                        │    │  24GB    │      │
                                        │    └──────────┘      │
                                        └──────────────────────┘
```

## Server Setup (Remote GPU)

### Step 1: Install Tailscale on Both Machines

```bash
# Linux server
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Note your Tailscale hostname (e.g., gpu-server.tailnet-name.ts.net)
tailscale status
```

### Step 2: Install Ollama on GPU Server

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation (requires v0.14.0+)
ollama --version
```

### Step 3: Configure Ollama for Network Access

```bash
# Create systemd override for network binding
sudo mkdir -p /etc/systemd/system/ollama.service.d

sudo tee /etc/systemd/system/ollama.service.d/override.conf << 'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
EOF

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart ollama

# Verify it's listening on all interfaces
ss -tlnp | grep 11434
```

### Step 4: Pull Recommended Models

```bash
# RTX 3090 (24GB VRAM) - Recommended Stack
ollama pull qwen3-coder          # 18GB - agentic coding, 256K context
ollama pull qwen2.5-coder:32b    # 18GB - fast code completion
ollama pull qwq:32b              # 20GB - reasoning + coding
ollama pull deepseek-coder-v2:16b # 10GB - GPT-4 level coding
ollama pull codestral:22b        # 13GB - IDE/FIM, 80+ languages

# Verify models
ollama list
```

### Step 5: Test from Client Machine

```bash
# Test connectivity via Tailscale
curl http://ollama.your-server.ts.net:11434/api/tags

# Should return JSON with your models
```

## Client Configuration

### autonomous.yml

Create `.claude/autonomous.yml`:

```yaml
target_score: 95
max_iterations: 15
iteration_delay: 5

providers:
  default: claude

  ollama:
    enabled: true
    base_url: http://ollama.your-server.ts.net:11434  # Tailscale hostname
    model: qwen3-coder  # Default model

  # Hybrid mode with per-gate model optimization
  gate_providers:
    # Critical gates - use Claude for accuracy
    test: claude
    security: claude
    mentor: claude

    # Build gate - fast compilation checks
    build:
      provider: ollama
      model: qwen2.5-coder:32b

    # Review gate - deep code analysis
    review:
      provider: ollama
      model: qwen3-coder

    # Architect gate - strong reasoning
    architect:
      provider: ollama
      model: qwq:32b

    # DevOps gate - CI/CD analysis
    devops:
      provider: ollama
      model: qwen2.5-coder:32b

    # UX gate - accessibility review
    ux:
      provider: ollama
      model: qwen3-coder
```

### Test Configuration

```bash
# Validate providers and models
npx tsx scripts/ralph-runner.ts --test-provider

# Expected output:
# ✓ Server reachable
# ✓ Available models: 5
# ✓ Configured model: qwen3-coder
#   Matched: qwen3-coder:latest (30.5B)
#   Capability: coding | Tier: large
```

## Model Recommendations by GPU

### RTX 3090 / RTX 4090 (24GB)

| Model | VRAM | Use Case | Pull Command |
|-------|------|----------|--------------|
| qwen3-coder | 18GB | Agentic coding, 256K context | `ollama pull qwen3-coder` |
| qwen2.5-coder:32b | 18GB | Fast code completion | `ollama pull qwen2.5-coder:32b` |
| qwq:32b | 20GB | Reasoning + coding | `ollama pull qwq:32b` |
| deepseek-coder-v2:16b | 10GB | GPT-4 level coding | `ollama pull deepseek-coder-v2:16b` |
| codestral:22b | 13GB | IDE/FIM, 80+ langs | `ollama pull codestral:22b` |

### RTX 3080 / RTX 4080 (10-16GB)

| Model | VRAM | Pull Command |
|-------|------|--------------|
| deepseek-coder-v2:16b | 10GB | `ollama pull deepseek-coder-v2:16b` |
| codestral:22b | 13GB | `ollama pull codestral:22b` |
| qwen2.5-coder:14b | 9GB | `ollama pull qwen2.5-coder:14b` |

### RTX 3070 / Consumer (8GB)

| Model | VRAM | Pull Command |
|-------|------|--------------|
| qwen2.5-coder:7b | 5GB | `ollama pull qwen2.5-coder:7b` |
| deepseek-coder:6.7b | 4GB | `ollama pull deepseek-coder:6.7b` |
| codellama:7b | 4GB | `ollama pull codellama:7b` |

## Usage Modes

### Hybrid Mode (Recommended)

Claude for critical gates, Ollama for others:

```bash
/autonomous --issue 123 --preset ollama_hybrid
```

- **Cost savings:** ~60% reduction in API calls
- **Accuracy:** High (critical tasks still use Claude)

### Fully Local Mode

No cloud API calls - complete privacy:

```bash
/autonomous --issue 123 --preset ollama_only
```

- **Cost savings:** 100% (no API costs)
- **Accuracy:** Good for simpler tasks

## Per-Gate Model Selection

The new per-gate model feature allows different models for different tasks:

```yaml
gate_providers:
  # Simple format (uses default model)
  test: claude

  # Extended format (specific model)
  build:
    provider: ollama
    model: qwen2.5-coder:32b
```

### Recommended Gate-Model Mapping

| Gate | Model | Why |
|------|-------|-----|
| build | qwen2.5-coder:32b | Fast, good at detecting compilation issues |
| review | qwen3-coder | Deep analysis, agentic workflows |
| architect | qwq:32b | Strong reasoning for design decisions |
| devops | qwen2.5-coder:32b | Fast CI/CD analysis |
| ux | qwen3-coder | Good at accessibility review |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Check Ollama is running: `systemctl status ollama` |
| "Connection timeout" | Check Tailscale: `tailscale ping ollama.server.ts.net` |
| "Model not found" | Pull model: `ollama pull <model-name>` |
| Model validation fails | Run `--test-provider` to see available models |
| Out of memory | Use smaller model or check `nvidia-smi` |
| Slow responses | Model may be loading; first request is slower |

### Debug Commands

```bash
# Check Ollama status
systemctl status ollama

# Check GPU memory
nvidia-smi

# Check Tailscale connectivity
tailscale ping ollama.your-server.ts.net

# Test Ollama API directly
curl http://ollama.your-server.ts.net:11434/api/tags

# Check available models
ollama list
```

## Security Notes

- Tailscale provides end-to-end encryption between machines
- Ollama binds to 0.0.0.0 but is only accessible via Tailscale network
- No ports exposed to public internet
- API key is placeholder ("ollama") - authentication via Tailscale

## References

- [Ollama Documentation](https://ollama.com)
- [Ollama Anthropic Compatibility](https://docs.ollama.com/api/anthropic-compatibility)
- [Tailscale Documentation](https://tailscale.com/kb)
- [VRAM Requirements Calculator](https://huggingface.co/spaces/Vokturz/can-it-run-llm)

Start Ollama setup now.
