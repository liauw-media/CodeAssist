# Backup

Create a database backup.

## Execute

Run the backup script:

```bash
./scripts/backup-database.sh
```

If the script doesn't exist, show how to create it:

```
The backup script doesn't exist yet.

To create it, copy from CodeAssist:
curl -fsSL https://raw.githubusercontent.com/liauw-media/CodeAssist/main/scripts/backup-database.sh -o scripts/backup-database.sh
chmod +x scripts/backup-database.sh

Or create manually - see: https://github.com/liauw-media/CodeAssist/blob/main/scripts/README.md
```

## Output Format

```
## Database Backup

**Status:** [Success / Failed]
**File:** [backup file path]
**Size:** [file size]
**Database:** [database name]

[If failed, show error and suggest fix]
```

Run the backup now.
