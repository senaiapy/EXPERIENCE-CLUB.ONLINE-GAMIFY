#!/bin/bash

###############################################################################
# PostgreSQL Remote Backup Script for Club de Ofertas
#
# This script sends backups to a remote server via SSH/rsync
# Designed to run weekly via cron
#
# Features:
# - Creates local backup first
# - Transfers to remote server via rsync over SSH
# - Verifies transfer integrity
# - Maintains remote retention policy
# - Email notifications (optional)
# - Connection testing
###############################################################################

# Exit on error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables from .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
else
    echo -e "${RED}Error: .env file not found in $SCRIPT_DIR${NC}"
    exit 1
fi

# Configuration
CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-clubdeofertas_postgres}"
DB_NAME="${POSTGRES_DB:-clubdeofertas}"
DB_USER="${POSTGRES_USER:-clubdeofertas}"
DB_PASSWORD="${POSTGRES_PASSWORD}"
BACKUP_DIR="${BACKUP_DIR:-$SCRIPT_DIR/backups}"
REMOTE_USER="${REMOTE_BACKUP_USER}"
REMOTE_HOST="${REMOTE_BACKUP_HOST}"
REMOTE_PORT="${REMOTE_BACKUP_PORT:-22}"
REMOTE_PATH="${REMOTE_BACKUP_PATH}"
REMOTE_RETENTION_DAYS="${REMOTE_RETENTION_DAYS:-60}"
SSH_KEY="${REMOTE_BACKUP_SSH_KEY:-$HOME/.ssh/id_rsa}"
EMAIL_ON_SUCCESS="${REMOTE_BACKUP_EMAIL_SUCCESS:-false}"
EMAIL_ON_FAILURE="${REMOTE_BACKUP_EMAIL_FAILURE:-true}"
EMAIL_TO="${REMOTE_BACKUP_EMAIL_TO}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"
LOG_FILE="$BACKUP_DIR/remote-backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Function to log errors
log_error() {
    echo -e "${RED}[$(date +"%Y-%m-%d %H:%M:%S")] ERROR: $1${NC}" | tee -a "$LOG_FILE"
}

# Function to log success
log_success() {
    echo -e "${GREEN}[$(date +"%Y-%m-%d %H:%M:%S")] SUCCESS: $1${NC}" | tee -a "$LOG_FILE"
}

# Function to log warnings
log_warning() {
    echo -e "${YELLOW}[$(date +"%Y-%m-%d %H:%M:%S")] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

# Function to send email notification
send_email() {
    local subject="$1"
    local body="$2"

    if [ -n "$EMAIL_TO" ] && command -v mail &> /dev/null; then
        echo "$body" | mail -s "$subject" "$EMAIL_TO"
        log "Email notification sent to $EMAIL_TO"
    fi
}

# Function to validate configuration
validate_config() {
    local errors=0

    if [ -z "$REMOTE_USER" ]; then
        log_error "REMOTE_BACKUP_USER not set in .env"
        errors=$((errors + 1))
    fi

    if [ -z "$REMOTE_HOST" ]; then
        log_error "REMOTE_BACKUP_HOST not set in .env"
        errors=$((errors + 1))
    fi

    if [ -z "$REMOTE_PATH" ]; then
        log_error "REMOTE_BACKUP_PATH not set in .env"
        errors=$((errors + 1))
    fi

    if [ ! -f "$SSH_KEY" ]; then
        log_error "SSH key not found at $SSH_KEY"
        errors=$((errors + 1))
    fi

    if [ $errors -gt 0 ]; then
        log_error "Configuration validation failed. Please check your .env file."
        return 1
    fi

    return 0
}

# Function to test SSH connection
test_ssh_connection() {
    log "Testing SSH connection to $REMOTE_USER@$REMOTE_HOST..."

    if ssh -i "$SSH_KEY" -p "$REMOTE_PORT" -o ConnectTimeout=10 -o BatchMode=yes \
        "$REMOTE_USER@$REMOTE_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
        log_success "SSH connection test passed"
        return 0
    else
        log_error "SSH connection test failed"
        log "Please verify:"
        log "  1. Remote server is accessible"
        log "  2. SSH key is configured correctly"
        log "  3. User $REMOTE_USER exists on remote server"
        log "  4. SSH key is added to remote server's authorized_keys"
        return 1
    fi
}

# Function to create backup
create_backup() {
    log "Creating local backup..."

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        return 1
    fi

    # Check if container exists and is running
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_error "Container '$CONTAINER_NAME' is not running."
        return 1
    fi

    # Create backup using pg_dump through Docker exec
    if docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
        pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --no-acl \
        | gzip > "$BACKUP_FILE"; then

        # Get backup file size
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

        log_success "Local backup created successfully!"
        log "Backup size: $BACKUP_SIZE"
        log "Location: $BACKUP_FILE"
        return 0
    else
        log_error "Backup creation failed!"

        # Remove incomplete backup file if it exists
        if [ -f "$BACKUP_FILE" ]; then
            rm "$BACKUP_FILE"
        fi

        return 1
    fi
}

# Function to transfer backup to remote server
transfer_backup() {
    log "Transferring backup to remote server..."

    local filename=$(basename "$BACKUP_FILE")
    local remote_full_path="$REMOTE_PATH/$filename"

    # Create remote directory if it doesn't exist
    ssh -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
        "mkdir -p $REMOTE_PATH" 2>&1 | tee -a "$LOG_FILE"

    # Transfer file using rsync
    if rsync -avz -e "ssh -i $SSH_KEY -p $REMOTE_PORT" \
        "$BACKUP_FILE" "$REMOTE_USER@$REMOTE_HOST:$remote_full_path" 2>&1 | tee -a "$LOG_FILE"; then

        log_success "Backup transferred successfully!"
        log "Remote location: $REMOTE_USER@$REMOTE_HOST:$remote_full_path"

        # Verify remote file exists and get size
        local remote_size=$(ssh -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
            "du -h $remote_full_path | cut -f1" 2>&1)

        log "Remote file size: $remote_size"

        return 0
    else
        log_error "Backup transfer failed!"
        return 1
    fi
}

# Function to clean up old remote backups
cleanup_remote_backups() {
    log "Cleaning up remote backups older than $REMOTE_RETENTION_DAYS days..."

    local deleted_count=$(ssh -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
        "find $REMOTE_PATH -name '${DB_NAME}_backup_*.sql.gz' -type f -mtime +$REMOTE_RETENTION_DAYS -delete -print | wc -l" 2>&1)

    if [ $? -eq 0 ]; then
        log "Deleted $deleted_count old remote backup(s)"

        # Get remaining backup count
        local remaining_count=$(ssh -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
            "find $REMOTE_PATH -name '${DB_NAME}_backup_*.sql.gz' -type f | wc -l" 2>&1)

        log "Total remote backups retained: $remaining_count"
    else
        log_warning "Could not clean up remote backups"
    fi
}

# Function to list remote backups
list_remote_backups() {
    log "Listing remote backups..."

    ssh -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
        "ls -lh $REMOTE_PATH/${DB_NAME}_backup_*.sql.gz 2>/dev/null" 2>&1 | tee -a "$LOG_FILE" || \
        log_warning "No remote backups found or could not list them"
}

# Main execution
main() {
    log "==============================================="
    log "Starting Remote Backup Process"
    log "==============================================="

    # Validate configuration
    if ! validate_config; then
        send_email "⚠️ Remote Backup Failed - Configuration Error" \
            "Remote backup failed due to configuration errors. Please check the logs at $LOG_FILE"
        exit 1
    fi

    # Test SSH connection
    if ! test_ssh_connection; then
        send_email "⚠️ Remote Backup Failed - SSH Connection Error" \
            "Could not connect to remote server $REMOTE_HOST. Please check SSH configuration."
        exit 1
    fi

    # Create local backup
    if ! create_backup; then
        send_email "⚠️ Remote Backup Failed - Backup Creation Error" \
            "Failed to create local backup. Please check Docker and database status."
        exit 1
    fi

    # Transfer backup to remote server
    if ! transfer_backup; then
        send_email "⚠️ Remote Backup Failed - Transfer Error" \
            "Failed to transfer backup to remote server. Please check network connectivity."
        exit 1
    fi

    # Clean up old remote backups
    cleanup_remote_backups

    # List remote backups
    list_remote_backups

    # Calculate transfer time
    log "==============================================="
    log_success "Remote backup completed successfully!"
    log "==============================================="

    # Send success email if configured
    if [ "$EMAIL_ON_SUCCESS" = "true" ]; then
        send_email "✅ Remote Backup Successful" \
            "Remote backup completed successfully at $(date +"%Y-%m-%d %H:%M:%S")

Backup file: $(basename $BACKUP_FILE)
Backup size: $(du -h $BACKUP_FILE | cut -f1)
Remote location: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH

Check logs at: $LOG_FILE"
    fi

    # Optionally remove local backup after successful transfer
    if [ "${REMOVE_LOCAL_AFTER_TRANSFER:-false}" = "true" ]; then
        log "Removing local backup file after successful transfer..."
        rm "$BACKUP_FILE"
        log "Local backup file removed"
    fi
}

# Run main function
main

exit 0
