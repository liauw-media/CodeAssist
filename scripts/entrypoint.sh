#!/bin/bash
# Ralph Wiggum - Container Entrypoint
# Handles signals gracefully for clean shutdown

set -e

# Trap signals for graceful shutdown
cleanup() {
    echo "[ENTRYPOINT] Received shutdown signal, cleaning up..."
    # Send SIGTERM to all child processes
    kill -TERM "$child" 2>/dev/null || true
    wait "$child" 2>/dev/null || true
    echo "[ENTRYPOINT] Shutdown complete"
    exit 0
}

trap cleanup SIGTERM SIGINT SIGQUIT

# Validate environment
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "[ERROR] ANTHROPIC_API_KEY is required"
    echo "Set it via: docker run -e ANTHROPIC_API_KEY=your-key ..."
    exit 1
fi

# Optional: Check for GitHub authentication
if [ -z "$GITHUB_TOKEN" ]; then
    echo "[WARN] GITHUB_TOKEN not set - will use gh CLI authentication"
fi

# Display startup info
echo "============================================"
echo "  Ralph Wiggum - Autonomous Development"
echo "============================================"
echo "  Node version: $(node --version)"
echo "  Working dir: $(pwd)"
echo "  Arguments: $*"
echo "============================================"

# Run the main application
exec node /app/dist/ralph-runner.js "$@" &
child=$!

# Wait for the child process
wait "$child"
exit_code=$?

echo "[ENTRYPOINT] Process exited with code $exit_code"
exit $exit_code
