#!/bin/bash

# Database Backup Script
# Creates a timestamped backup of your database
#
# Usage: ./scripts/backup-database.sh
#
# Supports: MySQL, PostgreSQL, SQLite
# Reads database config from .env file

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Load environment variables
if [ -f .env.testing ]; then
    source .env.testing 2>/dev/null || export $(grep -v '^#' .env.testing | xargs)
elif [ -f .env ]; then
    source .env 2>/dev/null || export $(grep -v '^#' .env | xargs)
else
    echo "No .env file found"
    exit 1
fi

# Detect database type and create backup
if [ -n "$DATABASE_URL" ]; then
    # Parse DATABASE_URL (common in Node.js, Python)
    if [[ "$DATABASE_URL" == postgres* ]]; then
        DB_TYPE="postgresql"
    elif [[ "$DATABASE_URL" == mysql* ]]; then
        DB_TYPE="mysql"
    elif [[ "$DATABASE_URL" == sqlite* ]]; then
        DB_TYPE="sqlite"
    fi
elif [ -n "$DB_CONNECTION" ]; then
    # Laravel style
    DB_TYPE="$DB_CONNECTION"
elif [ -n "$DB_HOST" ]; then
    # Try to detect from other variables
    if [ -n "$PGDATABASE" ]; then
        DB_TYPE="pgsql"
    else
        DB_TYPE="mysql"
    fi
fi

BACKUP_FILE="${BACKUP_DIR}/database_${TIMESTAMP}.sql"

echo "Creating database backup..."
echo "  Type: ${DB_TYPE:-unknown}"
echo "  Database: ${DB_DATABASE:-$PGDATABASE}"
echo "  Output: $BACKUP_FILE"

case "$DB_TYPE" in
    mysql|mariadb)
        if [ -z "$DB_DATABASE" ]; then
            echo "Error: DB_DATABASE not set"
            exit 1
        fi
        mysqldump \
            -h "${DB_HOST:-localhost}" \
            -P "${DB_PORT:-3306}" \
            -u "${DB_USERNAME:-root}" \
            ${DB_PASSWORD:+-p"$DB_PASSWORD"} \
            "$DB_DATABASE" > "$BACKUP_FILE"
        ;;

    pgsql|postgresql|postgres)
        DB_NAME="${DB_DATABASE:-$PGDATABASE}"
        if [ -z "$DB_NAME" ]; then
            echo "Error: DB_DATABASE or PGDATABASE not set"
            exit 1
        fi
        PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" pg_dump \
            -h "${DB_HOST:-localhost}" \
            -p "${DB_PORT:-5432}" \
            -U "${DB_USERNAME:-postgres}" \
            "$DB_NAME" > "$BACKUP_FILE"
        ;;

    sqlite|sqlite3)
        SQLITE_PATH="${DB_DATABASE:-database/database.sqlite}"
        if [ ! -f "$SQLITE_PATH" ]; then
            echo "Error: SQLite file not found at $SQLITE_PATH"
            exit 1
        fi
        cp "$SQLITE_PATH" "$BACKUP_FILE"
        ;;

    *)
        echo "Error: Unknown database type: $DB_TYPE"
        echo "Set DB_CONNECTION in your .env file"
        exit 1
        ;;
esac

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo ""
    echo "Backup created successfully"
    echo "  File: $BACKUP_FILE"
    echo "  Size: $SIZE"
else
    echo "Error: Backup file was not created"
    exit 1
fi

# Clean up old backups (keep last 30)
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/database_*.sql 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 30 ]; then
    ls -t "$BACKUP_DIR"/database_*.sql | tail -n +31 | xargs rm -f
    echo "  Cleaned up old backups (kept last 30)"
fi
