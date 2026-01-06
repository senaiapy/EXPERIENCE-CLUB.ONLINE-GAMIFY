# Database Backup & Restore Manual

Complete guide for backing up and restoring the Experience Club PostgreSQL database.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Installation](#installation)
5. [Manual Backup](#manual-backup)
6. [Automated Backups (Cron)](#automated-backups-cron)
7. [Restore Database](#restore-database)
8. [Remote Backups](#remote-backups)
9. [Troubleshooting](#troubleshooting)
10. [Configuration](#configuration)

---

## Overview

This backup solution provides:

✅ **Automated backups** every 30 minutes via cron
✅ **Manual backup** on-demand execution
✅ **Compressed backups** using gzip (saves space)
✅ **Dual retention policy** - removes backups older than 14 days, with automatic cleanup of 1 month+ old backups
✅ **Interactive restore** with safety confirmations
✅ **Logging** of all operations
✅ **Docker-based** backup from running container

**Files:**
- `backup.sh` - Local backup script
- `restore.sh` - Local restore script
- `remote-backup.sh` - Remote backup script (weekly transfers)
- `remote-restore.sh` - Remote restore script (download & restore from remote)
- `backups/` - Directory where backups are stored (auto-created)

**Documentation:**
- `MANUAL_DB_BACKUP.md` - This file (local & remote backup guide)
- `REMOTE_BACKUP_SETUP.md` - Detailed remote server configuration guide

---

## Prerequisites

### Required Software

- Docker and Docker Compose
- Bash shell (Linux/macOS/WSL)
- PostgreSQL container running via `docker-compose.db.yml`

### Verify Setup

```bash
# Check Docker is running
docker info

# Check PostgreSQL container is running
docker ps | grep clubdeofertas_postgres

# Should show: clubdeofertas_postgres (up)
```

---

## Quick Start

### 1. Make Scripts Executable

```bash
chmod +x backup.sh restore.sh
```

### 2. Run Manual Backup

```bash
./backup.sh
```

### 3. Setup Automated Backups (Every 30 Minutes)

```bash
# Open crontab editor
crontab -e

# Add this line (replace /path/to/project with actual path):
*/30 * * * * cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1 && ./backup.sh >> backups/cron.log 2>&1

# Save and exit (Ctrl+X, Y, Enter in nano)
```

### 4. Verify Cron Job

```bash
# List active cron jobs
crontab -l

# Check logs after 30 minutes
tail -f backups/cron.log
```

---

## Installation

### Step 1: Navigate to Project Directory

```bash
cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1
```

### Step 2: Verify .env File

Ensure `.env` contains these variables:

```bash
POSTGRES_DB=clubdeofertas
POSTGRES_USER=clubdeofertas
POSTGRES_PASSWORD=Ma1x1x0x!!Ma1x1x0x!!
POSTGRES_PORT=15432
```

### Step 3: Make Scripts Executable

```bash
chmod +x backup.sh restore.sh
```

### Step 4: Test Backup

```bash
./backup.sh
```

**Expected output:**
```
[2025-10-16 10:30:00] Starting backup process...
[2025-10-16 10:30:00] Database: clubdeofertas
[2025-10-16 10:30:00] Container: clubdeofertas_postgres
[2025-10-16 10:30:02] SUCCESS: Backup completed successfully!
[2025-10-16 10:30:02] Backup size: 2.3M
[2025-10-16 10:30:02] Location: backups/clubdeofertas_backup_20251016_103000.sql.gz
```

### Step 5: Verify Backup File

```bash
ls -lh backups/
```

You should see a `.sql.gz` file with today's timestamp.

---

## Manual Backup

### Run Backup Manually

```bash
./backup.sh
```

### Backup File Location

Backups are stored in:
```
./backups/clubdeofertas_backup_YYYYMMDD_HHMMSS.sql.gz
```

**Example:**
```
backups/clubdeofertas_backup_20251016_143000.sql.gz
```

### View Backup Logs

```bash
cat backups/backup.log
```

### List All Backups

```bash
ls -lh backups/*.sql.gz
```

---

## Automated Backups (Cron & Anacron)

### Option A: Cron (For Always-On Servers) - Every 30 Minutes

#### Setup Method 1: Using crontab -e (Recommended)

```bash
# Open crontab editor
crontab -e

# Add this line at the end (replace path with your actual path):
*/30 * * * * cd /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1 && ./backup.sh >> backups/cron.log 2>&1

# Save and exit (Ctrl+X, Y, Enter in nano)
```

#### Setup Method 2: Direct Command (Alternative)

```bash
# For production server path:
(crontab -l 2>/dev/null; echo "*/30 * * * * cd /www/wwwroot/CLUBDEOFERTAS.OM.PY/db && ./backup-nodocker.sh >> backups/cron.log 2>&1") | sudo crontab -

# For development path:
(crontab -l 2>/dev/null; echo "*/30 * * * * cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1/db && ./backup.sh >> backups/cron.log 2>&1") | crontab -
```

#### Fix Crontab Permission Issues

If you get "Operation not permitted" error:

```bash
# Option 1: Use sudo to edit root's crontab
sudo crontab -e
# Then add: */30 * * * * cd /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1/db && ./backup.sh >> backups/cron.log 2>&1

# Option 2: Fix crontab directory permissions (advanced)
sudo chmod 1730 /var/spool/cron/crontabs/
sudo chown root:crontab /var/spool/cron/crontabs/

# Option 3: Check if you're in allowed users
sudo cat /etc/cron.allow /etc/cron.deny
```

### Option B: Anacron (For Systems That Power Off) - Daily at 2 AM

**When to use Anacron:**
- Desktop/laptop systems that power off regularly
- Virtual machines with scheduled shutdowns
- Development environments with irregular uptime
- Ensures backups run even if system was off at scheduled time

#### Step 1: Install Anacron

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install anacron

# CentOS/RHEL
sudo yum install cronie-anacron

# Verify installation
anacron -V
```

#### Step 2: Create Anacron Job

```bash
# Edit anacrontab
sudo nano /etc/anacrontab

# Add this line at the end (format: period delay job-id command):
1  5  clubdeofertas-backup  cd /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1/db && ./backup.sh >> backups/anacron.log 2>&1

# Explanation:
# 1      = Run every 1 day (daily)
# 5      = Delay 5 minutes after boot before running
# clubdeofertas-backup = Job identifier (unique name)
# command = Full command to execute

# Save and exit (Ctrl+X, Y, Enter)
```

#### Step 3: Configure Anacron Schedule in Cron

Anacron needs to be triggered by cron. Add to crontab:

```bash
# Edit crontab
sudo crontab -e

# Add these lines for anacron integration:
# Run anacron at 2 AM daily (if system is on)
0 2 * * * /usr/sbin/anacron -s

# Alternative: Run anacron every hour (catches missed backups faster)
0 * * * * /usr/sbin/anacron -s

# Save and exit
```

#### Step 4: Test Anacron Job

```bash
# Run anacron manually (as root)
sudo anacron -f

# Check logs
tail -f /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1/db/backups/anacron.log

# Check anacron status
cat /var/spool/anacron/clubdeofertas-backup
```

### Option C: Hybrid Setup (Cron + Anacron) - Best of Both Worlds

For maximum reliability, use both:

**Cron:** Runs every 30 minutes when system is on
**Anacron:** Catches missed backups when system was off

```bash
# 1. Setup cron for frequent backups (when system is running)
crontab -e
# Add: */30 * * * * cd /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1/db && ./backup.sh >> backups/cron.log 2>&1

# 2. Setup anacron for daily backup guarantee (runs if missed)
sudo nano /etc/anacrontab
# Add: 1  5  clubdeofertas-backup  cd /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1/db && ./backup.sh >> backups/anacron.log 2>&1

# 3. Enable anacron in cron
sudo crontab -e
# Add: 0 2 * * * /usr/sbin/anacron -s

# Result: Backups every 30 min when running + daily guarantee via anacron
```

### Cron Schedule Explained

```
*/30 * * * *
│    │ │ │ │
│    │ │ │ └─── Day of week (0-7, Sunday=0 or 7)
│    │ │ └───── Month (1-12)
│    │ └─────── Day of month (1-31)
│    └───────── Hour (0-23)
└────────────── Minute (0-59)

*/30 = Every 30 minutes
```

### Other Useful Schedules

```bash
# Every hour at minute 0
0 * * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1

# Every 6 hours
0 */6 * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1

# Daily at 2:00 AM
0 2 * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1

# Every Sunday at 3:00 AM
0 3 * * 0 cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1
```

### Verify Cron is Running

```bash
# List cron jobs
crontab -l

# Check cron service status (Linux)
sudo systemctl status cron

# View cron logs
tail -f backups/cron.log
```

### Disable Automated Backups

```bash
# Open crontab
crontab -e

# Comment out or delete the backup line:
# */30 * * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1

# Or remove all cron jobs:
crontab -r
```

---

## Restore Database

### Interactive Restore (Recommended)

```bash
./restore.sh
```

**Interactive steps:**

1. Script lists all available backups:
   ```
   Available backup files:

   [1] clubdeofertas_backup_20251016_143000.sql.gz - 2.3M - 2025-10-16 14:30:00
   [2] clubdeofertas_backup_20251016_133000.sql.gz - 2.3M - 2025-10-16 13:30:00
   [3] clubdeofertas_backup_20251016_123000.sql.gz - 2.2M - 2025-10-16 12:30:00
   ```

2. Enter backup number to restore:
   ```
   Enter the number of the backup to restore (or 'q' to quit): 1
   ```

3. Confirm restore:
   ```
   ⚠️  WARNING: This will replace ALL data in the 'clubdeofertas' database!
      All current data will be lost!

   Are you sure you want to continue? (yes/no): yes
   ```

4. Restore executes and verifies connection

### Restore Specific Backup File

```bash
./restore.sh backups/clubdeofertas_backup_20251016_143000.sql.gz
```

### Restore Latest Backup

```bash
LATEST_BACKUP=$(ls -t backups/clubdeofertas_backup_*.sql.gz | head -1)
./restore.sh "$LATEST_BACKUP"
```

### View Restore Logs

```bash
cat backups/restore.log
```

---

## Troubleshooting

### Issue: "Docker is not running"

**Solution:**
```bash
# Start Docker
sudo systemctl start docker

# Verify
docker info
```

### Issue: "Container 'clubdeofertas_postgres' is not running"

**Solution:**
```bash
# Start database container
docker-compose -f docker-compose.db.yml up -d

# Verify
docker ps | grep clubdeofertas_postgres
```

### Issue: "Permission denied: ./backup.sh"

**Solution:**
```bash
chmod +x backup.sh restore.sh
```

### Issue: ".env file not found"

**Solution:**
```bash
# Verify .env exists in project root
ls -la .env

# If missing, create from .env.example or check path
```

### Issue: Cron job not running

**Solution:**
```bash
# Check cron service is running
sudo systemctl status cron

# Start cron if stopped
sudo systemctl start cron

# Check cron logs
grep CRON /var/log/syslog

# Verify crontab entry
crontab -l
```

### Issue: Anacron job not running

**Solution:**
```bash
# Check if anacron is installed
which anacron

# Install if missing
sudo apt install anacron  # Ubuntu/Debian
sudo yum install cronie-anacron  # CentOS/RHEL

# Check anacron configuration
cat /etc/anacrontab | grep clubdeofertas

# View anacron job timestamp (when last ran)
cat /var/spool/anacron/clubdeofertas-backup

# Run anacron manually to test
sudo anacron -f -d  # -d for debug mode

# Check if anacron is enabled in cron
sudo crontab -l | grep anacron

# View anacron logs
tail -f /www/wwwroot/experience-club.online/CLUBOFERTAS-V1.0.1/db/backups/anacron.log
```

### Issue: "No space left on device"

**Solution:**
```bash
# Check disk space
df -h

# Remove old backups manually
rm backups/clubdeofertas_backup_YYYYMMDD_*.sql.gz

# Or adjust retention policy (see Configuration)
```

### Issue: Backup file is corrupted

**Solution:**
```bash
# Test backup file integrity
gunzip -t backups/clubdeofertas_backup_20251016_143000.sql.gz

# If corrupted, use a different backup
./restore.sh
```

### Issue: Restore shows errors but completes

**Explanation:** PostgreSQL may show warnings for existing objects (tables, indexes) during `--clean` operation. These are usually harmless if restore completes successfully.

**Verify restore:**
```bash
# Connect to database
docker exec -it clubdeofertas_postgres psql -U clubdeofertas -d clubdeofertas

# Check table count
\dt

# Check specific table
SELECT COUNT(*) FROM "Product";

# Exit
\q
```

---

## Remote Backups

For offsite disaster recovery, use the remote backup solution to transfer backups to an external server.

### Quick Start - Remote Backups

1. **Configure remote server** (see [REMOTE_BACKUP_SETUP.md](REMOTE_BACKUP_SETUP.md) for complete guide)
2. **Update .env** with remote server credentials
3. **Test connection**: `./remote-backup.sh` (manual run)
4. **Setup weekly cron**: Automatic transfers every Sunday at 2 AM

### Remote Backup Features

✅ Automatic SSH/rsync transfer
✅ Remote retention policy (60 days default)
✅ Integrity verification
✅ Email notifications (optional)
✅ Weekly automated execution
✅ Remote restore capability

### Configuration (.env)

```bash
# Remote server connection
REMOTE_BACKUP_USER=backupuser
REMOTE_BACKUP_HOST=your-remote-server.com
REMOTE_BACKUP_PORT=22
REMOTE_BACKUP_PATH=/var/backups/clubdeofertas

# SSH key location
REMOTE_BACKUP_SSH_KEY=/home/galo/.ssh/clubdeofertas_backup_rsa

# Retention (days)
REMOTE_RETENTION_DAYS=60

# Email notifications
REMOTE_BACKUP_EMAIL_FAILURE=true
REMOTE_BACKUP_EMAIL_TO=admin@clubdeofertas.com
```

### Manual Remote Backup

```bash
./remote-backup.sh
```

**What it does:**
1. Creates local backup
2. Transfers to remote server via SSH
3. Verifies transfer integrity
4. Cleans up old remote backups (60+ days)
5. Logs all operations

### Remote Restore

Download and restore from remote server:

```bash
./remote-restore.sh
```

**Interactive process:**
1. Lists available remote backups
2. Select backup to restore
3. Downloads to local temp directory
4. Verifies file integrity
5. Restores to local database
6. Option to keep downloaded file

### Weekly Automated Remote Backups

```bash
# Edit crontab
crontab -e

# Add line (runs every Sunday at 2 AM):
0 2 * * 0 cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1 && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1
```

### Remote Server Setup Summary

**On remote server:**
```bash
# 1. Create backup user
sudo useradd -m -s /bin/bash backupuser

# 2. Create backup directory
sudo mkdir -p /var/backups/clubdeofertas
sudo chown backupuser:backupuser /var/backups/clubdeofertas
sudo chmod 700 /var/backups/clubdeofertas

# 3. Add your SSH public key to authorized_keys
# (Use ssh-copy-id from local server)
```

**On local server:**
```bash
# 1. Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "clubdeofertas-backup" -f ~/.ssh/clubdeofertas_backup_rsa

# 2. Copy public key to remote server
ssh-copy-id -i ~/.ssh/clubdeofertas_backup_rsa.pub backupuser@your-remote-server.com

# 3. Test connection
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com

# 4. Update .env with remote credentials
nano .env

# 5. Test remote backup
./remote-backup.sh
```

### View Remote Backups

```bash
# List remote backups
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "ls -lh /var/backups/clubdeofertas/"

# Check remote disk space
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "df -h /var/backups"
```

### Monitor Remote Backups

```bash
# View remote backup logs
tail -f backups/remote-backup.log

# View remote backup cron logs
tail -f backups/remote-backup-cron.log

# View remote restore logs
tail -f backups/remote-restore.log
```

**For complete remote setup instructions, see:** [REMOTE_BACKUP_SETUP.md](REMOTE_BACKUP_SETUP.md)

---

## Configuration

### Environment Variables

Edit `.env` in project root to customize:

```bash
# Database Configuration
POSTGRES_DB=clubdeofertas
POSTGRES_USER=clubdeofertas
POSTGRES_PASSWORD=Ma1x1x0x!!Ma1x1x0x!!
POSTGRES_PORT=15432

# Optional: Override defaults
POSTGRES_CONTAINER_NAME=clubdeofertas_postgres  # Default container name
BACKUP_DIR=./backups                            # Default backup directory
BACKUP_RETENTION_DAYS=14                        # Default retention (14 days)
```

### Change Backup Location

```bash
# In .env file, add:
BACKUP_DIR=/path/to/custom/backup/location

# Create directory
mkdir -p /path/to/custom/backup/location
```

### Change Retention Policy

The backup script uses a **dual retention policy**:
1. **14-day retention** (configurable via BACKUP_RETENTION_DAYS)
2. **30-day (1 month) automatic cleanup** - removes all backups older than 1 month

```bash
# In .env file, adjust 14-day retention:
BACKUP_RETENTION_DAYS=30  # Keep 30 days instead of 14

# The 1-month cleanup is automatic and removes ALL backups older than 30 days
# This ensures backups never exceed 1 month, regardless of BACKUP_RETENTION_DAYS setting
```

**How it works:**
- First pass: Deletes backups older than `BACKUP_RETENTION_DAYS` (default 14 days)
- Second pass: Deletes ALL backups older than 30 days (1 month)
- This guarantees no backup is older than 1 month

### Change Backup Frequency

Edit crontab schedule:

```bash
crontab -e

# Every 15 minutes:
*/15 * * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1

# Every hour:
0 * * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1

# Daily at 2 AM:
0 2 * * * cd /path/to/project && ./backup.sh >> backups/cron.log 2>&1
```

---

## Advanced Usage

### Backup to External Storage

#### Option 1: Sync to Cloud (rsync + S3)

```bash
# Install AWS CLI
sudo apt install awscli

# Configure AWS credentials
aws configure

# Add to backup.sh (after backup completes):
aws s3 sync "$BACKUP_DIR" s3://your-bucket/clubdeofertas-backups/
```

#### Option 2: Copy to Network Storage

```bash
# Mount network drive
sudo mount -t cifs //server/backups /mnt/backups -o username=user,password=pass

# Add to .env:
BACKUP_DIR=/mnt/backups/clubdeofertas

# Run backup
./backup.sh
```

### Encrypt Backups

```bash
# Install GPG
sudo apt install gnupg

# Generate key
gpg --gen-key

# Encrypt backup
gpg --encrypt --recipient your-email@example.com backups/clubdeofertas_backup_20251016_143000.sql.gz

# Decrypt for restore
gpg --decrypt backups/clubdeofertas_backup_20251016_143000.sql.gz.gpg | gunzip | docker exec -i clubdeofertas_postgres psql -U clubdeofertas -d clubdeofertas
```

### Monitor Backup Size

```bash
# Add to cron for daily email report
0 8 * * * du -sh /path/to/project/backups/ | mail -s "Daily Backup Report" admin@clubdeofertas.com
```

### Backup Specific Tables Only

Edit `backup.sh` and change `pg_dump` command:

```bash
# Backup only Product and Order tables
docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
    pg_dump -U "$DB_USER" -d "$DB_NAME" -t Product -t Order --clean --if-exists \
    | gzip > "$BACKUP_FILE"
```

---

## Best Practices

1. **Test restores regularly** - Verify backups work every month
2. **Monitor disk space** - Ensure backup directory has sufficient space (automatic 1-month cleanup helps)
3. **Keep offsite backups** - Copy critical backups to external storage
4. **Check logs** - Review `backups/backup.log` and `backups/cron.log` weekly
5. **Document procedures** - Keep this manual updated with any customizations
6. **Rotate backup locations** - Consider multiple backup destinations
7. **Alert on failures** - Setup email notifications for backup failures
8. **Understand retention** - Script automatically removes backups older than 1 month (30 days)

---

## Quick Reference Commands

### Local Backups

```bash
# Manual backup
./backup.sh

# Interactive restore
./restore.sh

# Restore specific file
./restore.sh backups/clubdeofertas_backup_20251016_143000.sql.gz

# List backups
ls -lh backups/*.sql.gz

# View backup logs
tail -f backups/backup.log

# View restore logs
tail -f backups/restore.log

# View cron logs
tail -f backups/cron.log

# View anacron logs
tail -f backups/anacron.log

# Check cron jobs
crontab -l

# Edit cron jobs
crontab -e

# Check anacron configuration
cat /etc/anacrontab | grep clubdeofertas

# Edit anacron configuration
sudo nano /etc/anacrontab

# Run anacron manually
sudo anacron -f

# Check when anacron job last ran
cat /var/spool/anacron/clubdeofertas-backup

# Test anacron with debug mode
sudo anacron -f -d

# Test backup file integrity
gunzip -t backups/clubdeofertas_backup_20251016_143000.sql.gz

# Calculate total backup size
du -sh backups/

# Count backups
ls -1 backups/*.sql.gz | wc -l

# Remove backups older than 30 days
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

### Remote Backups

```bash
# Manual remote backup (creates local + transfers to remote)
./remote-backup.sh

# Interactive remote restore (download + restore from remote)
./remote-restore.sh

# List remote backups
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "ls -lh /var/backups/clubdeofertas/"

# View remote backup logs
tail -f backups/remote-backup.log

# View remote restore logs
tail -f backups/remote-restore.log

# View remote backup cron logs
tail -f backups/remote-backup-cron.log

# Test SSH connection
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com "echo 'Success'"

# Check remote disk space
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com "df -h /var/backups"

# Calculate remote backup size
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "du -sh /var/backups/clubdeofertas"

# Manual remote cleanup (remove backups older than 90 days)
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "find /var/backups/clubdeofertas -name '*.sql.gz' -mtime +90 -delete"
```

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review logs: `backups/backup.log` and `backups/restore.log`
3. Verify Docker container: `docker ps | grep clubdeofertas_postgres`
4. Test database connection: `docker exec -it clubdeofertas_postgres psql -U clubdeofertas -d clubdeofertas`

---

**Last Updated:** 2025-10-16
**Version:** 1.0.0
**Project:** Experience Club - PostgreSQL Backup Solution
