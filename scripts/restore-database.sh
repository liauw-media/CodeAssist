#!/bin/bash

# Database Restore Script
# Restores a database from a backup file
#
# Usage: ./scripts/restore-database.sh [backup-file]
#        ./scripts/restore-database.sh --latest
#
# Supports: MySQL, PostgreSQL, SQLite

set -e

BACKUP_DIR="backups"

# Show usage if no argument
if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-database.sh [backup-file]"
    echo "       ./scripts/restore-database.sh --latest"
    echo ""
    echo "Available backups:"
    if [ -d "$BACKUP_DIR" ]; then
        ls -lh "$BACKUP_DIR"/database_*.sql 2>/dev/null | tail -10 || echo "  No backups found"
    else
        echo "  No backups directory"
    fi
    exit 1
fi

# Handle --latest flag
if [ "$1" == "--latest" ]; then
    BACKUP_FILE=$(ls -t "$BACKUP_DIR"/database_*.sql 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        echo "Error: No backups found in $BACKUP_DIR"
        exit 1
    fi
else
    BACKUP_FILE="$1"
fi

# Check file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Load environment variables
if [ -f .env.testing ]; then
    source .env.testing 2>/dev/null || export $(grep -v '^#' .env.testing | xargs)
elif [ -f .env ]; then
    source .env 2>/dev/null || export $(grep -v '^#' .env | xargs)
else
    echo "No .env file found"
    exit 1
fi

# Detect database type
if [ -n "$DB_CONNECTION" ]; then
    DB_TYPE="$DB_CONNECTION"
elif [ -n "$PGDATABASE" ]; then
    DB_TYPE="pgsql"
else
    DB_TYPE="mysql"
fi

echo "Restore database from backup"
echo "  File: $BACKUP_FILE"
echo "  Type: $DB_TYPE"
echo "  Database: ${DB_DATABASE:-$PGDATABASE}"
echo ""
echo "This will OVERWRITE the current database."
read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted"
    exit 0
fi

case "$DB_TYPE" in
    mysql|mariadb)
        mysql \
            -h "${DB_HOST:-localhost}" \
            -P "${DB_PORT:-3306}" \
            -u "${DB_USERNAME:-root}" \
            ${DB_PASSWORD:+-p"$DB_PASSWORD"} \
            "$DB_DATABASE" < "$BACKUP_FILE"
        ;;

    pgsql|postgresql|postgres)
        DB_NAME="${DB_DATABASE:-$PGDATABASE}"
        PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" psql \
            -h "${DB_HOST:-localhost}" \
            -p "${DB_PORT:-5432}" \
            -U "${DB_USERNAME:-postgres}" \
            "$DB_NAME" < "$BACKUP_FILE"
        ;;

    sqlite|sqlite3)
        SQLITE_PATH="${DB_DATABASE:-database/database.sqlite}"
        cp "$BACKUP_FILE" "$SQLITE_PATH"
        ;;

    *)
        echo "Error: Unknown database type: $DB_TYPE"
        exit 1
        ;;
esac

echo ""
echo "Database restored successfully"
