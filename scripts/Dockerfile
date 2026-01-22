# Ralph Wiggum - Autonomous Development Runner
# Multi-stage build for production deployment

# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production=false

# Copy source
COPY tsconfig.json ./
COPY ralph-runner.ts ./

# Compile TypeScript
RUN npx tsc

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled JavaScript
COPY --from=builder /app/dist ./dist

# Install Claude Code CLI (required for SDK)
RUN apk add --no-cache curl bash git && \
    curl -fsSL https://claude.ai/install.sh | bash

# Install GitHub CLI
RUN apk add --no-cache github-cli

# Create non-root user
RUN addgroup -g 1001 -S ralph && \
    adduser -S ralph -u 1001 -G ralph

# Create working directories
RUN mkdir -p /workspace && chown ralph:ralph /workspace

USER ralph

WORKDIR /workspace

# Environment
ENV NODE_ENV=production
ENV PATH="/home/ralph/.local/bin:$PATH"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('healthy')" || exit 1

# Entry point
ENTRYPOINT ["node", "/app/dist/ralph-runner.js"]
CMD ["--help"]
