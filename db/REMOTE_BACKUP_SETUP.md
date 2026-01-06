# Remote Backup Setup Guide

Complete guide to configure weekly remote backups to an external server via SSH.

---

## Table of Contents

1. [Overview](#overview)
2. [Remote Server Setup](#remote-server-setup)
3. [Local Server Configuration](#local-server-configuration)
4. [Testing the Setup](#testing-the-setup)
5. [Weekly Automated Backups](#weekly-automated-backups)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The `remote-backup.sh` script automatically:

✅ Creates a local database backup
✅ Transfers it to a remote server via SSH/rsync
✅ Maintains remote retention policy (60 days default)
✅ Verifies transfer integrity
✅ Optional email notifications
✅ Designed for weekly cron execution

**Security:** Uses SSH key authentication (no passwords stored)

---

## Remote Server Setup

### Step 1: Access Your Remote Server

```bash
ssh your-user@your-remote-server.com
```

Replace `your-user` and `your-remote-server.com` with your actual credentials.

### Step 2: Create Backup User (Recommended)

```bash
# Create dedicated backup user (more secure)
sudo useradd -m -s /bin/bash backupuser

# Set password (you'll change to key-only authentication later)
sudo passwd backupuser

# Add to sudo group (optional, only if needed)
# sudo usermod -aG sudo backupuser
```

**Or use existing user:**
```bash
# If you prefer to use an existing user, skip user creation
# and use that username in the configuration below
```

### Step 3: Create Backup Directory

```bash
# As root or with sudo
sudo mkdir -p /var/backups/clubdeofertas

# Change ownership to backup user
sudo chown backupuser:backupuser /var/backups/clubdeofertas

# Set permissions
sudo chmod 700 /var/backups/clubdeofertas
```

**Alternative location:**
```bash
# Home directory (if no sudo access)
mkdir -p ~/backups/clubdeofertas
chmod 700 ~/backups/clubdeofertas
```

### Step 4: Configure SSH Key Authentication

**On your LOCAL server (where Experience Club runs):**

```bash
# Navigate to project directory
cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1

# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "clubdeofertas-backup" -f ~/.ssh/clubdeofertas_backup_rsa

# Press Enter for no passphrase (required for automated backups)
# Or set passphrase and use ssh-agent (advanced)
```

**Copy public key to remote server:**

```bash
# Method 1: Using ssh-copy-id (easiest)
ssh-copy-id -i ~/.ssh/clubdeofertas_backup_rsa.pub backupuser@your-remote-server.com

# Method 2: Manual copy
cat ~/.ssh/clubdeofertas_backup_rsa.pub
# Copy the output, then on remote server:
# mkdir -p ~/.ssh
# echo "paste-public-key-here" >> ~/.ssh/authorized_keys
# chmod 600 ~/.ssh/authorized_keys
# chmod 700 ~/.ssh
```

### Step 5: Test SSH Connection

**From local server:**

```bash
# Test connection with key
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com

# Should connect without password prompt
# Exit after successful test
exit
```

### Step 6: Secure Remote Server (Recommended)

**On remote server:**

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# PasswordAuthentication no          # Disable password login (key-only)
# PermitRootLogin no                 # Disable root login
# PubkeyAuthentication yes           # Enable key authentication
# Port 2222                          # Optional: Change SSH port

# Restart SSH service
sudo systemctl restart sshd
# or
sudo service ssh restart
```

### Step 7: Install Required Tools (if needed)

```bash
# Most systems already have these, but verify:
which rsync  # Should output: /usr/bin/rsync

# If not installed:
# Ubuntu/Debian
sudo apt update && sudo apt install rsync

# CentOS/RHEL
sudo yum install rsync

# Verify
rsync --version
```

### Step 8: Configure Firewall (if active)

```bash
# Check if firewall is active
sudo ufw status
# or
sudo firewall-cmd --state

# Allow SSH port
sudo ufw allow 22/tcp
# or for custom port
sudo ufw allow 2222/tcp

# Reload firewall
sudo ufw reload
```

---

## Local Server Configuration

### Step 1: Navigate to Project

```bash
cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1
```

### Step 2: Make Script Executable

```bash
chmod +x remote-backup.sh
```

### Step 3: Configure .env File

Add these variables to your `.env` file:

```bash
# Open .env for editing
nano .env
```

**Add at the end:**

```bash
#########################################
# Remote Backup Configuration
#########################################

# Remote server connection
REMOTE_BACKUP_USER=backupuser
REMOTE_BACKUP_HOST=your-remote-server.com
REMOTE_BACKUP_PORT=22                                    # Default SSH port (change if needed)
REMOTE_BACKUP_PATH=/var/backups/clubdeofertas          # Remote backup directory

# SSH key location
REMOTE_BACKUP_SSH_KEY=/home/yourusername/.ssh/clubdeofertas_backup_rsa

# Retention policy (days to keep backups on remote server)
REMOTE_RETENTION_DAYS=60                                 # Keep 60 days on remote

# Email notifications (optional)
REMOTE_BACKUP_EMAIL_SUCCESS=false                        # Send email on success
REMOTE_BACKUP_EMAIL_FAILURE=true                         # Send email on failure
REMOTE_BACKUP_EMAIL_TO=admin@clubdeofertas.com          # Email recipient

# Optional: Remove local backup after successful transfer
REMOVE_LOCAL_AFTER_TRANSFER=false                        # Keep local backup by default
```

**Replace these values:**
- `backupuser` → Your remote server username
- `your-remote-server.com` → Your remote server hostname or IP
- `/var/backups/clubdeofertas` → Your remote backup directory path
- `/home/yourusername/.ssh/clubdeofertas_backup_rsa` → Path to your SSH private key
- `admin@clubdeofertas.com` → Your email address

**Example with real values:**

```bash
REMOTE_BACKUP_USER=galo
REMOTE_BACKUP_HOST=217.79.189.223
REMOTE_BACKUP_PORT=22
REMOTE_BACKUP_PATH=/home/galo/backups/clubdeofertas
REMOTE_BACKUP_SSH_KEY=/home/galo/.ssh/clubdeofertas_backup_rsa
REMOTE_RETENTION_DAYS=60
REMOTE_BACKUP_EMAIL_FAILURE=true
REMOTE_BACKUP_EMAIL_TO=admin@clubdeofertas.com
```

### Step 4: Install mail Utility (Optional, for email notifications)

```bash
# Ubuntu/Debian
sudo apt install mailutils

# CentOS/RHEL
sudo yum install mailx

# Test email
echo "Test email" | mail -s "Test Subject" admin@clubdeofertas.com
```

---

## Testing the Setup

### Test 1: SSH Connection Test

```bash
# The script includes a connection test, but you can verify manually
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com "echo 'Connection successful'"

# Should output: Connection successful
```

### Test 2: Run Manual Remote Backup

```bash
./remote-backup.sh
```

**Expected output:**

```
===============================================
Starting Remote Backup Process
===============================================
[2025-10-16 12:30:00] Testing SSH connection to backupuser@your-remote-server.com...
[2025-10-16 12:30:01] SUCCESS: SSH connection test passed
[2025-10-16 12:30:01] Creating local backup...
[2025-10-16 12:30:03] SUCCESS: Local backup created successfully!
[2025-10-16 12:30:03] Backup size: 196K
[2025-10-16 12:30:03] Transferring backup to remote server...
[2025-10-16 12:30:05] SUCCESS: Backup transferred successfully!
[2025-10-16 12:30:05] Remote file size: 196K
[2025-10-16 12:30:05] Cleaning up remote backups older than 60 days...
[2025-10-16 12:30:06] Deleted 0 old remote backup(s)
[2025-10-16 12:30:06] Total remote backups retained: 1
===============================================
[2025-10-16 12:30:06] SUCCESS: Remote backup completed successfully!
===============================================
```

### Test 3: Verify Remote Backup File

```bash
# Check remote server
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "ls -lh /var/backups/clubdeofertas/"

# Should list the backup file with size
```

### Test 4: Check Logs

```bash
# View local log
cat backups/remote-backup.log

# View last 20 lines
tail -20 backups/remote-backup.log
```

---

## Weekly Automated Backups

### Setup Cron Job (Runs Every Sunday at 2 AM)

```bash
# Open crontab editor
crontab -e

# Add this line:
0 2 * * 0 cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1 && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1
```

### Cron Schedule Examples

```bash
# Every Sunday at 2 AM
0 2 * * 0 cd /path/to/project && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1

# Every Monday at 3 AM
0 3 * * 1 cd /path/to/project && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1

# Every Saturday at midnight
0 0 * * 6 cd /path/to/project && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1

# First day of every month at 4 AM
0 4 1 * * cd /path/to/project && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1

# Every 7 days (alternative weekly schedule)
0 2 */7 * * cd /path/to/project && ./remote-backup.sh >> backups/remote-backup-cron.log 2>&1
```

### Cron Schedule Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, Sunday=0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

### Verify Cron Job

```bash
# List cron jobs
crontab -l

# Check cron service
sudo systemctl status cron

# Monitor cron execution
tail -f backups/remote-backup-cron.log
```

---

## Monitoring & Maintenance

### Check Backup Status

```bash
# View local logs
tail -50 backups/remote-backup.log

# View cron logs
tail -50 backups/remote-backup-cron.log

# List local backups
ls -lh backups/*.sql.gz

# List remote backups
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "ls -lh /var/backups/clubdeofertas/"
```

### Check Disk Space

**Local server:**
```bash
df -h /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133754/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1/backups/
```

**Remote server:**
```bash
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "df -h /var/backups/clubdeofertas"
```

### Calculate Total Backup Size

**Local:**
```bash
du -sh backups/
```

**Remote:**
```bash
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "du -sh /var/backups/clubdeofertas"
```

### Manual Cleanup

**Remove old remote backups manually:**
```bash
# Remove backups older than 90 days
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "find /var/backups/clubdeofertas -name 'clubdeofertas_backup_*.sql.gz' -mtime +90 -delete"
```

---

## Troubleshooting

### Issue: "SSH connection test failed"

**Possible causes:**

1. **SSH key not configured:**
   ```bash
   # Verify key exists
   ls -l ~/.ssh/clubdeofertas_backup_rsa

   # Copy to remote server
   ssh-copy-id -i ~/.ssh/clubdeofertas_backup_rsa.pub backupuser@your-remote-server.com
   ```

2. **Wrong remote host/user:**
   ```bash
   # Check .env configuration
   grep REMOTE_BACKUP .env

   # Test manually
   ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com
   ```

3. **Firewall blocking:**
   ```bash
   # On remote server, allow SSH port
   sudo ufw allow 22/tcp
   sudo ufw reload
   ```

4. **SSH key permissions:**
   ```bash
   # Fix permissions
   chmod 600 ~/.ssh/clubdeofertas_backup_rsa
   chmod 644 ~/.ssh/clubdeofertas_backup_rsa.pub
   chmod 700 ~/.ssh
   ```

### Issue: "Permission denied (publickey)"

**Solution:**

```bash
# On remote server, check authorized_keys
cat ~/.ssh/authorized_keys

# Should contain your public key (from local server):
# cat ~/.ssh/clubdeofertas_backup_rsa.pub

# Fix permissions on remote server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Verify SSH service allows key authentication
# On remote server:
grep PubkeyAuthentication /etc/ssh/sshd_config
# Should show: PubkeyAuthentication yes
```

### Issue: "rsync: command not found"

**Solution:**

```bash
# On remote server, install rsync
sudo apt update && sudo apt install rsync
# or
sudo yum install rsync
```

### Issue: "No space left on device"

**Solution:**

```bash
# Check disk space on remote server
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com "df -h"

# Remove old backups
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "find /var/backups/clubdeofertas -name '*.sql.gz' -mtime +30 -delete"

# Or reduce retention days in .env:
REMOTE_RETENTION_DAYS=30
```

### Issue: Cron job not running

**Solution:**

```bash
# Check cron service
sudo systemctl status cron

# Start if stopped
sudo systemctl start cron

# Check cron logs
grep CRON /var/log/syslog

# Verify crontab entry
crontab -l

# Test script manually first
./remote-backup.sh
```

### Issue: Email notifications not working

**Solution:**

```bash
# Install mail utility
sudo apt install mailutils

# Test email
echo "Test" | mail -s "Test" admin@clubdeofertas.com

# Configure SMTP (if needed)
sudo dpkg-reconfigure postfix
```

### Issue: "Host key verification failed"

**Solution:**

```bash
# Add remote host to known_hosts
ssh-keyscan -H your-remote-server.com >> ~/.ssh/known_hosts

# Or connect manually once
ssh backupuser@your-remote-server.com
# Type "yes" to add to known hosts
```

---

## Security Best Practices

1. **Use dedicated backup user** with minimal permissions
2. **Disable password authentication** on remote server (key-only)
3. **Use restrictive permissions** on backup directories (700)
4. **Rotate SSH keys** periodically (every 6-12 months)
5. **Monitor backup logs** for unauthorized access attempts
6. **Use non-standard SSH port** (optional security through obscurity)
7. **Enable SSH rate limiting** on remote server
8. **Keep remote server updated** with security patches
9. **Use firewall** to restrict SSH access to known IPs (if possible)
10. **Test restore regularly** to ensure backups are valid

---

## Advanced Configuration

### Use Custom SSH Port

**In .env:**
```bash
REMOTE_BACKUP_PORT=2222
```

**On remote server:**
```bash
sudo nano /etc/ssh/sshd_config
# Change: Port 2222
sudo systemctl restart sshd

# Update firewall
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

### Encrypt Backups Before Transfer

**Add to remote-backup.sh (after backup creation):**

```bash
# Encrypt backup
gpg --symmetric --cipher-algo AES256 "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gpg"

# Transfer encrypted file...
# (rest of script continues)
```

### Multiple Remote Destinations

**Create multiple configuration sets in .env:**

```bash
# Primary remote
REMOTE_BACKUP_USER_PRIMARY=user1
REMOTE_BACKUP_HOST_PRIMARY=server1.com
REMOTE_BACKUP_PATH_PRIMARY=/backups

# Secondary remote
REMOTE_BACKUP_USER_SECONDARY=user2
REMOTE_BACKUP_HOST_SECONDARY=server2.com
REMOTE_BACKUP_PATH_SECONDARY=/backups
```

**Modify remote-backup.sh to loop through destinations.**

---

## Quick Reference

```bash
# Run manual remote backup
./remote-backup.sh

# View logs
tail -f backups/remote-backup.log

# Test SSH connection
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com

# List remote backups
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "ls -lh /var/backups/clubdeofertas/"

# Check cron schedule
crontab -l

# Edit cron schedule
crontab -e

# View cron execution logs
tail -f backups/remote-backup-cron.log

# Calculate remote backup size
ssh -i ~/.ssh/clubdeofertas_backup_rsa backupuser@your-remote-server.com \
  "du -sh /var/backups/clubdeofertas"
```

---

**Last Updated:** 2025-10-16
**Version:** 1.0.0
**Project:** Experience Club - Remote Backup Solution

Summary
Status: ✅ Crontab hardlock removed The crontab file at /var/spool/cron/crontabs/root no longer has the immutable (i) attribute and is fully editable. Commands used to remove hardlock:
# Remove immutable flag
chattr -i /var/spool/cron/crontabs/root

# Verify removal
lsattr /var/spool/cron/crontabs/root
Current attributes: --------------e------- (normal, no restrictions) You can now edit your crontab normally using:
crontab -e (command line)
aaPanel cron management interface
Direct file editing
If you need to prevent the hardlock from being reapplied, check for any security scripts or malware that might be setting the immutable flag automatically.