# Docker Security Audit Commands

Reference commands for security auditing Docker environments.

## Container Exposure

```bash
# List all exposed ports
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Find containers binding to 0.0.0.0
docker ps --format '{{.Names}} {{.Ports}}' | grep '0.0.0.0'

# Inspect specific container ports
docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{$p}} -> {{(index $conf 0).HostIp}}:{{(index $conf 0).HostPort}}{{"\n"}}{{end}}' CONTAINER_NAME
```

## Privileged Containers

```bash
# Find privileged containers
docker ps -q | xargs docker inspect --format '{{.Name}}: Privileged={{.HostConfig.Privileged}}' | grep "true"

# Check for dangerous capabilities
docker ps -q | xargs docker inspect --format '{{.Name}}: {{.HostConfig.CapAdd}}'

# Find containers running as root
docker ps -q | xargs docker inspect --format '{{.Name}}: User={{.Config.User}}' | grep -E ": User=$|: User=root"
```

## Image Security

```bash
# List images with no tag (dangling)
docker images -f "dangling=true"

# Check image history for secrets
docker history --no-trunc IMAGE_NAME

# Scan image for vulnerabilities (using Trivy)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image IMAGE_NAME
```

## Secrets and Environment

```bash
# Check for secrets in environment variables
docker ps -q | xargs -I {} docker inspect {} --format '{{.Name}}:{{range .Config.Env}}{{println .}}{{end}}' | grep -iE "password|secret|key|token"

# Check for mounted sensitive paths
docker ps -q | xargs docker inspect --format '{{.Name}}: {{range .Mounts}}{{.Source}}->{{.Destination}} {{end}}'
```

## Network Security

```bash
# List Docker networks
docker network ls

# Inspect network for exposed containers
docker network inspect bridge --format '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'

# Find containers with host networking
docker ps -q | xargs docker inspect --format '{{.Name}}: NetworkMode={{.HostConfig.NetworkMode}}' | grep "host"
```

## Docker Compose

```bash
# Check compose file for security issues
grep -E "privileged:|ports:|0\.0\.0\.0" docker-compose.yml

# Validate compose file
docker-compose config
```

## Common Fixes

### Bind to Localhost Only

```yaml
# docker-compose.yml
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"  # Good
      # NOT: "5432:5432" or "0.0.0.0:5432:5432"
```

### Remove Privileged Mode

```yaml
# docker-compose.yml
services:
  app:
    # Remove this:
    # privileged: true

    # Use specific capabilities instead:
    cap_add:
      - NET_ADMIN  # Only what's needed
```

### Run as Non-Root

```dockerfile
# Dockerfile
FROM node:20
RUN useradd -m appuser
USER appuser
WORKDIR /app
```

### Use Read-Only Filesystem

```yaml
# docker-compose.yml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

### Limit Resources

```yaml
# docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### No New Privileges

```yaml
# docker-compose.yml
services:
  app:
    security_opt:
      - no-new-privileges:true
```

## Docker Daemon Security

```bash
# Check Docker daemon configuration
cat /etc/docker/daemon.json

# Recommended daemon.json settings:
# {
#   "userns-remap": "default",
#   "no-new-privileges": true,
#   "live-restore": true,
#   "userland-proxy": false
# }
```

## Quick Audit Checklist

```bash
# Run this audit one-liner
echo "=== Exposed Ports ===" && docker ps --format "{{.Names}}: {{.Ports}}" | grep 0.0.0.0 && \
echo "=== Privileged ===" && docker ps -q | xargs docker inspect --format '{{.Name}}: {{.HostConfig.Privileged}}' | grep true && \
echo "=== Root Users ===" && docker ps -q | xargs docker inspect --format '{{.Name}}: {{.Config.User}}' | grep -E ": $" && \
echo "=== Host Network ===" && docker ps -q | xargs docker inspect --format '{{.Name}}: {{.HostConfig.NetworkMode}}' | grep host
```
