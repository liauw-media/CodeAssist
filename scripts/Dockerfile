# Ralph Wiggum - Autonomous Development Runner
# Multi-stage build for production deployment

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY tsconfig.json ./
COPY ralph-runner.ts ./
COPY gates/ ./gates/

# Compile TypeScript
RUN npx tsc

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner

# Build arguments for version pinning
ARG CLAUDE_CLI_VERSION=latest
ARG NODE_ENV=production

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled JavaScript
COPY --from=builder /app/dist ./dist

# Copy gate definitions
COPY --from=builder /app/gates ./gates

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    git \
    github-cli \
    ca-certificates

# Install Claude Code CLI with version pinning
# Note: Replace with actual versioned install when available
RUN if [ "$CLAUDE_CLI_VERSION" = "latest" ]; then \
      curl -fsSL https://claude.ai/install.sh | bash; \
    else \
      curl -fsSL https://claude.ai/install.sh | CLAUDE_VERSION=${CLAUDE_CLI_VERSION} bash; \
    fi

# Create non-root user for security
RUN addgroup -g 1001 -S ralph && \
    adduser -S ralph -u 1001 -G ralph

# Create working directories with proper permissions
RUN mkdir -p /workspace /app/logs && \
    chown -R ralph:ralph /workspace /app/logs

# Copy entrypoint script
COPY --chown=ralph:ralph entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

USER ralph

WORKDIR /workspace

# Environment
ENV NODE_ENV=${NODE_ENV}
ENV PATH="/home/ralph/.local/bin:$PATH"

# Labels for container metadata
LABEL org.opencontainers.image.title="Ralph Wiggum"
LABEL org.opencontainers.image.description="Autonomous Development Runner powered by Claude Agent SDK"
LABEL org.opencontainers.image.vendor="CodeAssist"
LABEL org.opencontainers.image.version="1.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

# Entry point with signal handling
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["--help"]
