# Obsidian + AI: Self-Hosted Knowledge Base

Complete guide to setting up a self-hosted Obsidian instance with Docker, cross-device sync, and AI integration via QMD.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Server / NAS                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   Obsidian   │  │   CouchDB    │  │        QMD            │ │
│  │   (Docker)   │  │   (Docker)   │  │  (search engine)      │ │
│  │  Web UI :3001│  │  Sync :5984  │  │  MCP server for AI    │ │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘ │
│         │                 │                       │             │
│         └────────┬────────┘                       │             │
│                  │                                │             │
│         ┌────────▼────────┐              ┌────────▼──────────┐  │
│         │  Vault Storage  │──────────────│  Embeddings DB    │  │
│         │  /data/obsidian │  indexes     │  (SQLite+vectors) │  │
│         └─────────────────┘              └───────────────────┘  │
│                  │                                              │
│         ┌────────▼────────┐                                     │
│         │     Caddy       │                                     │
│         │ Reverse Proxy   │                                     │
│         │ Auto-SSL (443)  │                                     │
│         └────────┬────────┘                                     │
│                  │                                              │
└──────────────────┼──────────────────────────────────────────────┘
                   │ HTTPS (Tailscale / Cloudflare Tunnel)
        ┌──────────┼──────────────┐
        │          │              │
   ┌────▼───┐ ┌───▼────┐  ┌─────▼─────┐
   │ Laptop │ │ Mobile │  │  Claude   │
   │Obsidian│ │Obsidian│  │   Code    │
   │  App   │ │  App   │  │  via QMD  │
   └────────┘ └────────┘  └───────────┘
```

**Components:**
- **Obsidian Docker** — Web-based Obsidian for browser access from anywhere
- **CouchDB** — Real-time sync engine (LiveSync plugin)
- **Caddy** — Reverse proxy with automatic HTTPS
- **QMD** — Local AI search engine indexing your vault
- **Tailscale** — Zero-config encrypted network between all devices

## Prerequisites

- Docker & Docker Compose on your server/NAS
- A domain (optional, for public access) or Tailscale (recommended)
- Obsidian app on each client device
- Node.js 22+ on the machine running QMD

## Step 1: Docker Compose Stack

Create a directory for the stack:

```bash
mkdir -p /opt/obsidian-stack && cd /opt/obsidian-stack
mkdir -p data/obsidian data/couchdb config
```

Create `docker-compose.yml`:

```yaml
services:
  # ── Obsidian Web UI ──────────────────────────────────────────
  # Browser-based Obsidian for remote access
  obsidian:
    image: lscr.io/linuxserver/obsidian:latest
    container_name: obsidian
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TZ:-Etc/UTC}
      - CUSTOM_USER=${OBSIDIAN_USER:-admin}
      - PASSWORD=${OBSIDIAN_PASSWORD:?Set OBSIDIAN_PASSWORD in .env}
    volumes:
      - ./data/obsidian:/config
    ports:
      - "127.0.0.1:3000:3000"   # HTTP  (behind reverse proxy)
      - "127.0.0.1:3001:3001"   # HTTPS (behind reverse proxy)
    shm_size: "1gb"
    restart: unless-stopped
    networks:
      - obsidian-net

  # ── CouchDB Sync Engine ─────────────────────────────────────
  # Powers LiveSync across all devices
  couchdb:
    image: couchdb:3
    container_name: obsidian-couchdb
    environment:
      - COUCHDB_USER=${COUCHDB_USER:?Set COUCHDB_USER in .env}
      - COUCHDB_PASSWORD=${COUCHDB_PASSWORD:?Set COUCHDB_PASSWORD in .env}
    volumes:
      - ./data/couchdb:/opt/couchdb/data
      - ./config/couchdb-local.ini:/opt/couchdb/etc/local.ini
    ports:
      - "127.0.0.1:5984:5984"   # Behind reverse proxy only
    restart: unless-stopped
    networks:
      - obsidian-net

  # ── Caddy Reverse Proxy ─────────────────────────────────────
  # Automatic HTTPS for both services
  caddy:
    image: caddy:2-alpine
    container_name: obsidian-caddy
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./config/Caddyfile:/etc/caddy/Caddyfile
      - ./data/caddy:/data
      - ./data/caddy-config:/config
    restart: unless-stopped
    networks:
      - obsidian-net

networks:
  obsidian-net:
    driver: bridge
```

## Step 2: Environment File

Create `.env`:

```bash
# ── Obsidian Web UI ──
OBSIDIAN_USER=admin
OBSIDIAN_PASSWORD=CHANGE_ME_strong_password_here

# ── CouchDB Sync ──
COUCHDB_USER=obsidian_admin
COUCHDB_PASSWORD=CHANGE_ME_another_strong_password

# ── General ──
TZ=Europe/Amsterdam
DOMAIN=obsidian.yourdomain.com
```

**Security:** Never commit `.env` to git. Add it to `.gitignore`.

## Step 3: CouchDB Configuration

Create `config/couchdb-local.ini`:

```ini
[couchdb]
single_node = true
max_document_size = 50000000

[chttpd]
require_valid_user = true
max_http_request_size = 4294967296
bind_address = 0.0.0.0
port = 5984

[chttpd_auth]
require_valid_user = true
authentication_redirect = /_utils/session.html

[httpd]
enable_cors = true
WWW-Authenticate = Basic realm="CouchDB"
bind_address = 0.0.0.0

[cors]
origins = app://obsidian.md,capacitor://localhost,http://localhost
credentials = true
methods = GET, PUT, POST, HEAD, DELETE
headers = accept, authorization, content-type, origin, referer, x-csrf-token
max_age = 3600
```

## Step 4: Caddy Reverse Proxy

### Option A: With a Domain (Public Access)

Create `config/Caddyfile`:

```
# Obsidian Web UI
obsidian.yourdomain.com {
    reverse_proxy obsidian:3000

    # Rate limiting
    @ratelimit {
        path /
    }
}

# CouchDB Sync Endpoint
sync.yourdomain.com {
    reverse_proxy couchdb:5984

    # Only allow Obsidian LiveSync operations
    @blocked {
        not path /_session
        not path /obsidian-vault*
    }
}
```

### Option B: With Tailscale (Recommended — Private Network)

Create `config/Caddyfile`:

```
# Local/Tailscale access only — auto HTTPS via Tailscale certs
:443 {
    tls /data/tailscale/cert.pem /data/tailscale/key.pem

    handle_path /sync/* {
        reverse_proxy couchdb:5984
    }

    handle {
        reverse_proxy obsidian:3000
    }
}
```

Or skip Caddy entirely with Tailscale and access services directly:

```bash
# Install Tailscale on the server
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Your server is now accessible at: server-name.tailnet.ts.net
# Obsidian: https://server-name.tailnet.ts.net:3001
# CouchDB:  http://server-name.tailnet.ts.net:5984
```

## Step 5: Launch the Stack

```bash
cd /opt/obsidian-stack

# Start all services
docker compose up -d

# Check all containers are running
docker compose ps

# Check CouchDB is accessible
curl -s http://localhost:5984/ | head -1
# Should return: {"couchdb":"Welcome"...}
```

### Create the Sync Database

```bash
# Create the vault database in CouchDB
curl -X PUT \
  http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5984/obsidian-vault
```

## Step 6: Configure LiveSync on Each Device

### Desktop (Windows/Mac/Linux)

1. Open Obsidian → Settings → Community Plugins → Browse
2. Search **"Self-hosted LiveSync"** → Install → Enable
3. Go to LiveSync settings → **Setup Wizard** → **Use the copied setup URI**
4. Or manually configure:
   - **Server URL:** `https://sync.yourdomain.com` (or Tailscale URL)
   - **Username:** Your CouchDB user
   - **Password:** Your CouchDB password
   - **Database:** `obsidian-vault`
   - **End-to-End Encryption:** Enable (set a passphrase)
5. Sync Settings → Select **LiveSync** mode
6. Hit **Test** → should show green

### Mobile (iOS/Android)

1. Install Obsidian from App Store / Play Store
2. Create or open a vault
3. Install Self-hosted LiveSync plugin
4. **Easiest:** On desktop, go to LiveSync → **Copy Setup URI** → generates a QR code
5. On mobile, scan the QR code — auto-configures everything
6. Enable LiveSync mode

### Web Browser (Docker Obsidian)

The Docker Obsidian instance at `https://obsidian.yourdomain.com` (or `:3001`) is already accessing the vault files directly via the mounted volume. Install LiveSync here too if you want it to sync with CouchDB for other devices.

### NAS (Synology/QNAP/TrueNAS)

Run the same Docker Compose stack on your NAS. Most NAS systems support Docker Compose natively or via Portainer.

For Synology:
```bash
# SSH into Synology
ssh admin@your-nas

# Create the stack directory
mkdir -p /volume1/docker/obsidian-stack
cd /volume1/docker/obsidian-stack

# Copy docker-compose.yml, .env, and config files
# Then:
docker compose up -d
```

## Step 7: QMD — AI Search Integration

This is where it gets powerful. QMD indexes your vault and gives Claude (or any AI) searchable access to your entire knowledge base.

### Install QMD on Your Server/Workstation

```bash
npm install -g @tobilu/qmd
```

### Index the Vault

Point QMD at the vault storage directory (same path Docker mounts):

```bash
# If running QMD on the same server as Docker:
qmd collection add /opt/obsidian-stack/data/obsidian/vaults/MyVault \
  --name vault --mask "**/*.md"

# If running QMD on a different machine with Tailscale:
# Mount the vault via NFS/SMB, or rsync it locally
```

### Add Context Hierarchy

```bash
qmd context add qmd://vault "Personal knowledge base — notes, projects, references"

# Add context for your actual folder structure
qmd context add qmd://vault/projects "Active project specs, architecture decisions, roadmaps"
qmd context add qmd://vault/meetings "Meeting notes, decisions, action items"
qmd context add qmd://vault/research "Research notes, articles, bookmarks"
qmd context add qmd://vault/daily "Daily notes and journal entries"
qmd context add qmd://vault/dev "Development notes, code snippets, debugging logs"
```

### Generate Embeddings

```bash
# First run downloads models (~1.7GB), then indexes all documents
qmd embed
```

### Set Up MCP for Claude Code

Add to your `~/.claude/settings.json` or project `.mcp.json`:

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"]
    }
  }
}
```

Now Claude can search your vault during any coding session.

### Auto-Reindex

Set up a cron job so QMD always has fresh embeddings:

```bash
# Reindex every 30 minutes
crontab -e
# Add:
*/30 * * * * /usr/local/bin/qmd embed --quiet 2>&1 | logger -t qmd
```

Or as a Docker sidecar (add to `docker-compose.yml`):

```yaml
  qmd-indexer:
    image: node:22-slim
    container_name: qmd-indexer
    volumes:
      - ./data/obsidian:/vault:ro
      - ./data/qmd:/root/.local/share/qmd
    entrypoint: >
      sh -c "npm install -g @tobilu/qmd &&
             qmd collection add /vault/vaults/MyVault --name vault --mask '**/*.md' ;
             while true; do qmd embed --quiet; sleep 1800; done"
    restart: unless-stopped
    networks:
      - obsidian-net
```

## Step 8: Security Hardening

### Network Security

```bash
# All services bound to 127.0.0.1 — only accessible via reverse proxy
# Use Tailscale for device-to-device encryption (recommended)
# Or Cloudflare Tunnel for public access without exposing ports
```

### Tailscale ACLs (Recommended)

In your Tailscale admin console, restrict who can access what:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["tag:obsidian:443", "tag:obsidian:5984"]
    }
  ],
  "tagOwners": {
    "tag:obsidian": ["group:admins"]
  }
}
```

### CouchDB Security

- Change default credentials immediately
- `require_valid_user = true` is set — no anonymous access
- CORS restricted to Obsidian app origins only
- Max document size capped at 50MB

### Obsidian Web UI Security

- Basic auth enabled via `CUSTOM_USER`/`PASSWORD`
- Bound to `127.0.0.1` — not directly exposed
- Access only through Caddy reverse proxy with HTTPS

### End-to-End Encryption

LiveSync supports E2E encryption — all data is encrypted before leaving your device:

1. LiveSync Settings → Encryption → Enable
2. Set a strong passphrase
3. **All devices must use the same passphrase**
4. CouchDB only stores encrypted blobs — even a DB breach reveals nothing

### Backups

```bash
# Backup vault files
tar czf /backups/obsidian-vault-$(date +%Y%m%d).tar.gz \
  /opt/obsidian-stack/data/obsidian/

# Backup CouchDB
curl -X POST http://admin:pass@localhost:5984/_replicate \
  -H "Content-Type: application/json" \
  -d '{"source":"obsidian-vault","target":"obsidian-vault-backup","create_target":true}'

# Or just backup the data directory
tar czf /backups/couchdb-$(date +%Y%m%d).tar.gz \
  /opt/obsidian-stack/data/couchdb/
```

Add to cron:
```bash
# Daily backup at 3am
0 3 * * * tar czf /backups/obsidian-$(date +\%Y\%m\%d).tar.gz /opt/obsidian-stack/data/
```

## Device Sync Matrix

| Device | Obsidian App | Sync Method | AI Access |
|--------|-------------|-------------|-----------|
| **Server** | Docker (web UI) | Direct volume mount | QMD local |
| **Desktop** | Native app | LiveSync → CouchDB | QMD via MCP |
| **Laptop** | Native app | LiveSync → CouchDB | QMD via MCP |
| **NAS** | Docker (web UI) | LiveSync → CouchDB | QMD sidecar |
| **iPhone/iPad** | iOS app | LiveSync → CouchDB | Via Claude app |
| **Android** | Android app | LiveSync → CouchDB | Via Claude app |
| **Claude Code** | N/A | QMD MCP server | Full search |

## AI Workflow Integration

### With GSD (Get Shit Done)

During GSD's research and discuss phases, Claude can pull relevant context from your vault:

```
/gsd:discuss
> "Search my vault for previous architecture decisions about auth"
> Claude uses qmd_deep_search → finds your notes → informs the discussion
```

### With CodeAssist

```
/qmd query "deployment strategy for microservices"
/qmd search "meeting notes about API redesign"
/research [topic]   # Claude can reference vault via QMD MCP
```

### Daily Workflow

```
Morning:  Open Obsidian → daily note → capture thoughts
Coding:   Claude searches vault via QMD for context
Meetings: Notes sync instantly across all devices
Evening:  QMD auto-reindexes new notes (cron)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CouchDB won't start | Check permissions: `chown -R 5984:5984 data/couchdb` |
| LiveSync not connecting | Verify CORS origins in `local.ini`, check firewall |
| Mobile can't sync | SSL required for mobile — use Caddy or Tailscale HTTPS |
| Obsidian web blank screen | Increase `shm_size` to `2gb` |
| QMD no results | Run `qmd embed`, check collection path matches vault |
| Sync conflicts | LiveSync handles conflicts — check LiveSync settings for merge strategy |
| Slow sync on large vault | Initial sync is slow; subsequent syncs are incremental |

## Quick Start Checklist

```
[ ] 1. Create /opt/obsidian-stack directory
[ ] 2. Copy docker-compose.yml, .env, config files
[ ] 3. Set strong passwords in .env
[ ] 4. docker compose up -d
[ ] 5. Create CouchDB database: obsidian-vault
[ ] 6. Access web UI at :3001, verify it works
[ ] 7. Install LiveSync plugin on all devices
[ ] 8. Configure LiveSync with CouchDB URL + credentials
[ ] 9. Enable E2E encryption (same passphrase everywhere)
[ ] 10. Install QMD, index vault, set up MCP
[ ] 11. Set up cron for backups and reindexing
[ ] 12. Test: /qmd query "test search"
```

## References

- [Obsidian LiveSync](https://github.com/vrtmrz/obsidian-livesync)
- [LinuxServer Obsidian Docker](https://docs.linuxserver.io/images/docker-obsidian/)
- [CouchDB Documentation](https://docs.couchdb.org/)
- [QMD](https://github.com/tobi/qmd)
- [Tailscale](https://tailscale.com/)
- [Caddy](https://caddyserver.com/)
