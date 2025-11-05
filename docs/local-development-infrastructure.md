# Local Development Infrastructure Guide

*Self-hosted tools for secure, private, and AI-enhanced development workflows*

---

## Overview

This guide covers integrating self-hosted and local tools into your CodeAssist development workflow:

- **Tailscale**: Secure private network mesh between your devices
- **Ollama/ComfyUI**: Local AI/LLM instances for private AI assistance
- **n8n**: Self-hosted workflow automation
- **Affine**: Knowledge management and documentation

**Benefits**:
- 🔒 **Privacy**: Keep code and data on your infrastructure
- 💰 **Cost**: No API fees for AI/automation
- ⚡ **Speed**: Local network latency
- 🛡️ **Security**: No public exposure of services
- 🎯 **Control**: Full control over tools and data

**Related Documents**:
- [Development Tooling Guide](./development-tooling-guide.md)
- [CI/CD Runners Guide](./cicd-runners-guide.md)
- [Integration Guides](./integration-guides.md)

---

## Table of Contents

1. [Tailscale: Secure Network Mesh](#tailscale-secure-network-mesh)
2. [Ollama/ComfyUI: Local AI](#ollamacomfyui-local-ai)
3. [n8n: Workflow Automation](#n8n-workflow-automation)
4. [Affine: Knowledge Management](#affine-knowledge-management)
5. [Integration Scenarios](#integration-scenarios)
6. [Architecture Examples](#architecture-examples)

---

## Tailscale: Secure Network Mesh

### What is Tailscale?

Tailscale creates a **secure private network** (mesh VPN) between your devices using WireGuard:
- Connect servers, workstations, mobile devices
- No port forwarding or public IP needed
- Zero-trust network access
- Magic DNS for easy service discovery

**Use Cases**:
- Access development servers from anywhere
- Connect CI/CD runners to private databases
- Share services between team members securely
- Access home lab from laptop

---

### Installation

#### On Linux (Development Server)

```bash
# Ubuntu/Debian
curl -fsSL https://tailscale.com/install.sh | sh

# Or via package manager
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list
sudo apt update
sudo apt install tailscale

# Start Tailscale
sudo tailscale up

# Check status
tailscale status
```

#### On Windows (Development Machine)

```powershell
# Download from https://tailscale.com/download/windows
# Or via winget
winget install tailscale.tailscale

# Start Tailscale from system tray
```

#### On macOS

```bash
# Via Homebrew
brew install tailscale

# Or download from https://tailscale.com/download/mac
```

---

### Configuration

#### Enable Subnet Routing (Access Entire Network)

**On server** (to share access to local network):
```bash
# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Advertise subnet routes
sudo tailscale up --advertise-routes=192.168.1.0/24
```

**In Tailscale admin console**:
- Go to Machines → Select the subnet router
- Enable "Subnet routes"

#### Enable MagicDNS

**In Tailscale admin console**:
- Go to DNS
- Enable MagicDNS
- Add custom DNS entries (optional)

Now access services via hostname:
```bash
# Instead of: http://100.x.x.x:8080
# Use: http://my-dev-server:8080
```

---

### Use Cases with CodeAssist

#### 1. Access Private Development Services

**Scenario**: Expose dev server only to Tailscale network

```bash
# Start Laravel dev server on Tailscale IP
php artisan serve --host=$(tailscale ip -4) --port=8000

# Access from any Tailscale device
curl http://my-dev-server:8000
```

#### 2. Private Database Access

**No need for public exposure**:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    # Bind to Tailscale IP only (not 0.0.0.0)
    networks:
      - tailscale
    environment:
      POSTGRES_PASSWORD: secret

# .env
DB_HOST=my-db-server  # Tailscale hostname
DB_PORT=5432
```

#### 3. CI/CD Runners with Private Access

**Self-hosted GitHub/GitLab runners** connected via Tailscale:
```bash
# Runner can access private services without VPN
./scripts/deploy.sh http://my-staging-server:8000
```

#### 4. Team Collaboration

**Share services with team**:
1. Create Tailscale network
2. Invite team members
3. Share services via Tailscale hostnames
4. No need for public deployment for testing

---

## Ollama/ComfyUI: Local AI

### What are Ollama & ComfyUI?

- **Ollama**: Run LLMs locally (Llama 3, Mistral, CodeLlama, etc.)
- **ComfyUI**: Node-based UI for Stable Diffusion and other AI models

**Benefits**:
- No API costs (OpenAI/Anthropic)
- Complete privacy (code never leaves your network)
- Offline capability
- Custom fine-tuned models

---

### Ollama Setup

#### Installation

```bash
# Linux
curl -fsSL https://ollama.com/install.sh | sh

# macOS
brew install ollama

# Windows
# Download from https://ollama.com/download/windows
```

#### Pull Models

```bash
# Code generation models
ollama pull codellama:13b
ollama pull deepseek-coder:6.7b
ollama pull starcoder2:7b

# General purpose models
ollama pull llama3:8b
ollama pull mistral:7b
ollama pull phi3:mini

# Check installed models
ollama list
```

#### Run Ollama as Service

**Linux (systemd)**:
```bash
# Ollama installs systemd service automatically
sudo systemctl enable ollama
sudo systemctl start ollama

# Check status
sudo systemctl status ollama
```

**Expose on Tailscale**:
```bash
# Edit /etc/systemd/system/ollama.service
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"  # Listen on all interfaces

sudo systemctl daemon-reload
sudo systemctl restart ollama

# Access from any Tailscale device
curl http://my-ai-server:11434/api/generate -d '{
  "model": "codellama",
  "prompt": "Write a Python function to reverse a string"
}'
```

---

### Integration with Development Workflow

#### 1. Code Assistant (Alternative to GitHub Copilot)

**VS Code Extension: Continue.dev**

**Installation**:
```bash
# Install Continue extension in VS Code
code --install-extension continue.continue
```

**Configuration** (`.continue/config.json`):
```json
{
  "models": [
    {
      "title": "Local CodeLlama",
      "provider": "ollama",
      "model": "codellama:13b",
      "apiBase": "http://my-ai-server:11434"
    },
    {
      "title": "Local DeepSeek",
      "provider": "ollama",
      "model": "deepseek-coder:6.7b",
      "apiBase": "http://my-ai-server:11434"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Starcoder2",
    "provider": "ollama",
    "model": "starcoder2:7b",
    "apiBase": "http://my-ai-server:11434"
  }
}
```

#### 2. Code Review with Local AI

**Script**: `scripts/ai-code-review.sh`

```bash
#!/bin/bash
set -e

MODEL="${1:-codellama:13b}"
FILE="${2}"

if [ -z "$FILE" ]; then
    echo "Usage: $0 [model] <file>"
    exit 1
fi

CODE=$(cat "$FILE")

curl -s http://my-ai-server:11434/api/generate -d "{
  \"model\": \"$MODEL\",
  \"prompt\": \"Review this code for bugs, security issues, and best practices:\n\n$CODE\",
  \"stream\": false
}" | jq -r '.response'
```

**Usage**:
```bash
./scripts/ai-code-review.sh codellama app/Http/Controllers/AuthController.php
```

#### 3. Commit Message Generation

**Script**: `scripts/ai-commit-msg.sh`

```bash
#!/bin/bash
set -e

DIFF=$(git diff --staged)

if [ -z "$DIFF" ]; then
    echo "No staged changes"
    exit 1
fi

curl -s http://my-ai-server:11434/api/generate -d "{
  \"model\": \"codellama:13b\",
  \"prompt\": \"Generate a conventional commit message for these changes:\n\n$DIFF\",
  \"stream\": false
}" | jq -r '.response'
```

**Usage**:
```bash
git add .
./scripts/ai-commit-msg.sh
```

#### 4. Documentation Generation

**Generate API documentation from code**:

```bash
#!/bin/bash
# scripts/ai-generate-docs.sh

curl -s http://my-ai-server:11434/api/generate -d "{
  \"model\": \"codellama:13b\",
  \"prompt\": \"Generate OpenAPI documentation for this Laravel controller:\n\n$(cat $1)\",
  \"stream\": false
}" | jq -r '.response'
```

---

### ComfyUI Setup (Optional)

**For image generation in documentation/marketing**:

```bash
# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py --listen 0.0.0.0 --port 8188

# Access via Tailscale
# http://my-ai-server:8188
```

**Use Cases**:
- Generate app icons/logos
- Create marketing images
- Generate UI mockups
- Documentation diagrams

---

## n8n: Workflow Automation

### What is n8n?

**n8n** is a self-hosted workflow automation tool (alternative to Zapier/Make):
- Visual workflow builder
- 400+ integrations
- Self-hosted (own your data)
- API-first design

**Use Cases with CodeAssist**:
- Automate GitHub/GitLab workflows
- Sync tasks between TASKS.md and GitHub Issues
- Automated testing notifications
- Deployment pipelines
- Database backups automation

---

### Installation

#### Docker Setup (Recommended)

**File**: `docker-compose-n8n.yml`

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=my-automation-server
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://my-automation-server:5678/
      - GENERIC_TIMEZONE=Europe/Berlin
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
    volumes:
      - n8n_data:/home/node/.n8n
      - ./n8n-backups:/backups

volumes:
  n8n_data:
```

**Start**:
```bash
docker-compose -f docker-compose-n8n.yml up -d

# Access via Tailscale
# http://my-automation-server:5678
```

---

### Integration Scenarios

#### 1. Sync TASKS.md with GitHub Issues

**Workflow**:
1. **Trigger**: File watcher on `TASKS.md`
2. **Parse**: Extract tasks from markdown
3. **Compare**: Check existing GitHub issues
4. **Create/Update**: Sync changes to GitHub

**n8n Workflow**:
```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "name": "Webhook (TASKS.md changed)"
    },
    {
      "type": "n8n-nodes-base.readFile",
      "name": "Read TASKS.md",
      "parameters": {
        "filePath": "/path/to/TASKS.md"
      }
    },
    {
      "type": "n8n-nodes-base.code",
      "name": "Parse Tasks",
      "parameters": {
        "jsCode": "// Parse markdown tasks"
      }
    },
    {
      "type": "n8n-nodes-base.github",
      "name": "Create/Update Issue"
    }
  ]
}
```

#### 2. Automated Database Backups

**Workflow**:
1. **Schedule**: Daily at 2 AM
2. **Backup**: Run backup script
3. **Upload**: Send to S3/Backblaze
4. **Notify**: Slack/Discord notification

**n8n Workflow**:
```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.cron",
      "name": "Schedule Daily",
      "parameters": {
        "cronExpression": "0 2 * * *"
      }
    },
    {
      "type": "n8n-nodes-base.executeCommand",
      "name": "Run Backup",
      "parameters": {
        "command": "./scripts/backup-database.sh"
      }
    },
    {
      "type": "n8n-nodes-base.s3",
      "name": "Upload to S3"
    },
    {
      "type": "n8n-nodes-base.slack",
      "name": "Notify Slack"
    }
  ]
}
```

#### 3. Test Failure Notifications

**Workflow**:
1. **Webhook**: Receive test results from CI
2. **Filter**: Only failed tests
3. **Parse**: Extract failure details
4. **Notify**: Send to Discord/Slack
5. **Create Issue**: Auto-create bug issue

#### 4. Deployment Pipeline

**Workflow**:
1. **Trigger**: New tag pushed to Git
2. **Build**: Run build command
3. **Test**: Run test suite
4. **Deploy**: Deploy to server via SSH
5. **Health Check**: Verify deployment
6. **Notify**: Send status update

---

### Script: Trigger n8n Workflows

**File**: `scripts/trigger-n8n-workflow.sh`

```bash
#!/bin/bash
set -e

WORKFLOW_ID="${1}"
PAYLOAD="${2:-{}}"

if [ -z "$WORKFLOW_ID" ]; then
    echo "Usage: $0 <workflow-id> [payload]"
    exit 1
fi

curl -X POST \
    -H "Content-Type: application/json" \
    -u admin:your-secure-password \
    -d "$PAYLOAD" \
    http://my-automation-server:5678/webhook/$WORKFLOW_ID
```

**Usage**:
```bash
# Trigger task sync
./scripts/trigger-n8n-workflow.sh sync-tasks

# Trigger backup with custom params
./scripts/trigger-n8n-workflow.sh backup '{"database":"production"}'
```

---

## Affine: Knowledge Management

### What is Affine?

**Affine** is a self-hosted knowledge base and note-taking app:
- Notion-like interface
- Markdown support
- Database/kanban views
- Self-hosted privacy
- Real-time collaboration

**Use Cases with CodeAssist**:
- Project documentation hub
- Technical decision records (TDRs)
- Architecture diagrams
- Meeting notes
- Team knowledge base

---

### Installation

#### Docker Setup

**File**: `docker-compose-affine.yml`

```yaml
version: '3.8'

services:
  affine:
    image: ghcr.io/toeverything/affine:stable
    restart: unless-stopped
    ports:
      - "3010:3010"
    environment:
      - NODE_ENV=production
      - AFFINE_ADMIN_EMAIL=admin@example.com
      - AFFINE_ADMIN_PASSWORD=your-secure-password
    volumes:
      - affine_data:/root/.affine/storage
      - affine_config:/root/.affine/config

volumes:
  affine_data:
  affine_config:
```

**Start**:
```bash
docker-compose -f docker-compose-affine.yml up -d

# Access via Tailscale
# http://my-docs-server:3010
```

---

### Integration with CodeAssist Workflow

#### 1. Project Documentation Hub

**Structure in Affine**:
```
📁 My Project
├── 📄 Project Overview
├── 📄 Architecture Decisions
├── 📄 API Documentation
├── 📄 Database Schema
├── 📄 Deployment Guide
├── 📁 Meeting Notes
│   ├── 2025-01-01 Sprint Planning
│   └── 2025-01-08 Retrospective
└── 📁 Technical Decisions
    ├── TDR-001: Database Choice
    └── TDR-002: Authentication Strategy
```

#### 2. Link from .claude/CLAUDE.md

**File**: `.claude/CLAUDE.md`

```markdown
## Project Documentation

**Central Hub**: [Affine Knowledge Base](http://my-docs-server:3010)

### Quick Links
- [Architecture Overview](http://my-docs-server:3010/workspace/architecture)
- [API Documentation](http://my-docs-server:3010/workspace/api-docs)
- [Deployment Guide](http://my-docs-server:3010/workspace/deployment)

### Recent Decisions
- [TDR-001: Why PostgreSQL](http://my-docs-server:3010/tdr/001)
- [TDR-002: API-First Architecture](http://my-docs-server:3010/tdr/002)
```

#### 3. Automated Documentation Sync

**Use n8n to sync** `.md` files to Affine:

**Workflow**:
1. Watch `docs/` folder for changes
2. Parse markdown files
3. Update Affine pages via API
4. Maintain bidirectional sync

#### 4. Technical Decision Records (TDR)

**Template in Affine**:
```markdown
# TDR-XXX: [Decision Title]

**Status**: [Proposed / Accepted / Deprecated]
**Date**: YYYY-MM-DD
**Deciders**: @person1, @person2

## Context
What is the issue we're trying to solve?

## Decision
What is the change we're making?

## Consequences
What becomes easier or harder due to this change?

## Alternatives Considered
1. Option A - Pros/Cons
2. Option B - Pros/Cons

## References
- [Related issue #123](link)
- [Documentation](link)
```

---

## Integration Scenarios

### Scenario 1: Complete Local Development Stack

**Architecture**:
```
┌─────────────────── Tailscale Network ───────────────────┐
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │  Dev Machine │      │  AI Server   │                │
│  │  (Laptop)    │──────│  - Ollama    │                │
│  │              │      │  - ComfyUI   │                │
│  └──────────────┘      └──────────────┘                │
│         │                                               │
│         │                                               │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ App Server   │      │ Automation   │                │
│  │ - Laravel    │──────│  - n8n       │                │
│  │ - PostgreSQL │      │              │                │
│  └──────────────┘      └──────────────┘                │
│         │                                               │
│         │                                               │
│  ┌──────────────┐      ┌──────────────┐                │
│  │ Docs Server  │      │  CI/CD       │                │
│  │ - Affine     │──────│  - Runners   │                │
│  └──────────────┘      └──────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘

All connected securely via Tailscale
No public exposure required
```

**Benefits**:
- All services accessible via Tailscale hostnames
- No public exposure needed
- Local AI for code assistance
- Automated workflows with n8n
- Centralized documentation in Affine

---

### Scenario 2: AI-Enhanced Development Workflow

**Workflow**:

1. **Write Code** with AI assistance (Ollama via Continue.dev)
2. **Commit** with AI-generated commit messages
3. **Push** to Git → triggers n8n workflow
4. **n8n** runs tests, lints, and creates issues if needed
5. **Document** decisions in Affine automatically
6. **Deploy** via n8n pipeline to private server
7. **Monitor** via Tailscale network

**Example**:
```bash
# 1. Get AI code suggestions in VS Code (Continue.dev + Ollama)
# 2. Stage changes
git add .

# 3. Generate commit message with AI
AI_MSG=$(./scripts/ai-commit-msg.sh)
git commit -m "$AI_MSG"

# 4. Push (triggers n8n webhook)
git push origin feature/my-feature

# 5. n8n workflow:
#    - Runs Paratest
#    - Updates Affine docs
#    - Creates GitHub PR
#    - Notifies via Slack
```

---

### Scenario 3: Team Collaboration

**Setup**:
1. **Invite team** to Tailscale network
2. **Share services**: Each team member accesses:
   - Development servers
   - Affine documentation
   - n8n for automation
   - Ollama for AI assistance
3. **Collaborate** without public exposure

**Team Member Access**:
```bash
# Team member on laptop
tailscale status

# Access services via hostname
curl http://dev-server:8000       # Laravel app
curl http://ai-server:11434        # Ollama
open http://docs-server:3010       # Affine
open http://automation-server:5678 # n8n
```

---

## Architecture Examples

### Basic Setup (Single Developer)

```yaml
Hardware:
- Desktop/Server: Run Ollama, n8n, Affine, databases
- Laptop: Development machine
- Both connected via Tailscale

Services:
- Ollama (AI): Port 11434
- n8n (Automation): Port 5678
- Affine (Docs): Port 3010
- PostgreSQL: Port 5432

Access:
- All via Tailscale hostnames
- No public exposure
- Encrypted connections
```

---

### Advanced Setup (Team)

```yaml
Infrastructure:
- Home Lab Server:
  - Ollama with multiple models
  - ComfyUI for images
  - n8n workflows
  - Affine knowledge base

- Cloud VPS:
  - Staging environment
  - Production database
  - GitLab CI runners

- Developer Machines:
  - Connected via Tailscale
  - Access all services securely

Network:
- Tailscale mesh connecting all nodes
- MagicDNS for easy service discovery
- ACLs for access control
```

---

## Configuration Files

### docker-compose-all.yml (Complete Stack)

```yaml
version: '3.8'

services:
  # Ollama (AI)
  ollama:
    image: ollama/ollama:latest
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]  # If you have GPU

  # n8n (Automation)
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n

  # Affine (Docs)
  affine:
    image: ghcr.io/toeverything/affine:stable
    restart: unless-stopped
    ports:
      - "3010:3010"
    volumes:
      - affine_data:/root/.affine/storage

  # PostgreSQL
  postgres:
    image: postgres:16
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis (Optional)
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  ollama_data:
  n8n_data:
  affine_data:
  postgres_data:
  redis_data:
```

**Start all services**:
```bash
docker-compose -f docker-compose-all.yml up -d
```

---

## Best Practices

### Security

1. **Use Tailscale ACLs** to restrict access
2. **Enable authentication** on all services
3. **Regular backups** of service data
4. **Keep services updated**
5. **Monitor access logs**

### Performance

1. **Dedicate resources** to Ollama (GPU recommended)
2. **Use SSD** for databases
3. **Separate services** across multiple machines if needed
4. **Monitor resource usage**

### Maintenance

1. **Backup service data** regularly
2. **Document service URLs** in `.claude/CLAUDE.md`
3. **Version control** n8n workflows (export to JSON)
4. **Keep Affine docs synced** with code docs

---

## Troubleshooting

### Tailscale Connection Issues

```bash
# Check status
tailscale status

# Restart Tailscale
sudo systemctl restart tailscaled

# Check logs
journalctl -u tailscaled -f
```

### Ollama Not Responding

```bash
# Check if running
curl http://localhost:11434/api/tags

# Restart service
sudo systemctl restart ollama

# Check logs
journalctl -u ollama -f
```

### n8n Workflows Failing

1. Check n8n logs: `docker logs n8n`
2. Verify webhook URLs
3. Test API connections manually
4. Check environment variables

---

## Cost Comparison

### Traditional Cloud Stack

```
OpenAI API: $20-200/month
Zapier: $20-50/month
Notion: $10-20/month
Hosted CI/CD: $10-30/month

Total: $60-300/month
```

### Self-Hosted Stack

```
Hardware: $500-2000 one-time (desktop/server)
Electricity: ~$10-20/month
Tailscale: Free for personal use ($5/user/month for teams)

Total: ~$10-25/month after initial investment
```

**ROI**: 3-6 months for single developer, faster for teams

---

## Next Steps

1. ✅ Install Tailscale on all devices
2. ✅ Set up Ollama with CodeLlama model
3. ✅ Deploy n8n for automation
4. ✅ Set up Affine for documentation
5. ✅ Configure VS Code with Continue.dev
6. ✅ Create n8n workflows for common tasks
7. ✅ Document your infrastructure in Affine
8. ✅ Update `.claude/CLAUDE.md` with service URLs

---

## Related Documentation

- [Development Tooling Guide](./development-tooling-guide.md)
- [CI/CD Runners Guide](./cicd-runners-guide.md)
- [Integration Guides](./integration-guides.md)
- [Database Backup Strategy](./database-backup-strategy.md)

---

*Build your own private development cloud with complete control and privacy!*
