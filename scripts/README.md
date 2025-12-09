# Database Backup Scripts

Scripts for backing up and restoring databases before destructive operations.

## Quick Start

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Create a backup
./scripts/backup-database.sh

# Run tests with automatic backup
./scripts/safe-test.sh npm test

# Run migrations with automatic backup
./scripts/safe-migrate.sh php artisan migrate

# Restore from latest backup
./scripts/restore-database.sh --latest
```

## Available Scripts

| Script | Purpose |
|--------|---------|
| `backup-database.sh` | Create a timestamped backup |
| `restore-database.sh` | Restore from a backup file |
| `safe-test.sh` | Backup + run tests |
| `safe-migrate.sh` | Backup + run migrations |

## Supported Databases

- MySQL / MariaDB
- PostgreSQL
- SQLite

## Configuration

Scripts read database configuration from your `.env` file:

### Laravel / PHP
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=secret
```

### Node.js / Prisma
```env
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"
```

### Python / Django
```env
DB_HOST=localhost
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret
```

## Backup Location

Backups are stored in `backups/` directory:
```
backups/
  database_2025-01-06_15-30-00.sql
  database_2025-01-06_16-45-00.sql
  ...
```

The scripts keep the last 30 backups and automatically clean up older ones.

## Usage Examples

### Before running tests
```bash
# Instead of:
npm test

# Use:
./scripts/safe-test.sh npm test
```

### Before migrations
```bash
# Instead of:
php artisan migrate

# Use:
./scripts/safe-migrate.sh php artisan migrate
```

### Manual backup
```bash
./scripts/backup-database.sh
```

### Restore after a mistake
```bash
# Restore most recent backup
./scripts/restore-database.sh --latest

# Or restore specific backup
./scripts/restore-database.sh backups/database_2025-01-06_15-30-00.sql
```

## Continuous Backup Strategy

For production environments, these scripts are for development safety. For production, use:

### MySQL
```bash
# Cron job for daily backups
0 2 * * * mysqldump -u user -p'password' database > /backups/daily_$(date +\%Y\%m\%d).sql

# Or use automysqlbackup
apt install automysqlbackup
```

### PostgreSQL
```bash
# Cron job for daily backups
0 2 * * * pg_dump database > /backups/daily_$(date +\%Y\%m\%d).sql

# Or use pg_dump with compression
0 2 * * * pg_dump database | gzip > /backups/daily_$(date +\%Y\%m\%d).sql.gz
```

### Cloud Services

| Service | Backup Feature |
|---------|----------------|
| AWS RDS | Automated backups, point-in-time recovery |
| Google Cloud SQL | Automated backups |
| DigitalOcean | Managed database backups |
| PlanetScale | Automatic branching and backups |
| Supabase | Point-in-time recovery |

## Recovery Strategy

### Development
1. Run `./scripts/restore-database.sh --latest`
2. Verify data is correct
3. Continue development

### Production
1. Stop application traffic (maintenance mode)
2. Identify correct backup point
3. Restore from backup
4. Run any migrations that occurred after backup
5. Verify data integrity
6. Resume traffic

### Data Loss Prevention Checklist
- [ ] Daily automated backups enabled
- [ ] Backups stored off-site (different server/region)
- [ ] Backup restoration tested monthly
- [ ] Point-in-time recovery available for critical databases
- [ ] Retention policy defined (e.g., 30 days daily, 12 months monthly)

## Windows Users

These scripts require bash. Use:
- Git Bash (comes with Git for Windows)
- WSL (Windows Subsystem for Linux)
- MSYS2

```bash
# In Git Bash
./scripts/backup-database.sh
```
