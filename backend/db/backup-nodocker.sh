#!/bin/bash

###############################################################################
# PostgreSQL Database Backup Script for Club de Ofertas
#
# This script creates timestamped backups of the PostgreSQL database
# running in Docker (docker-compose.db.yml)
#
# Features:
# - Automatic timestamped backups
# - Retention policy (keeps last 14 days by default)
# - Compression with gzip
# - Error handling and logging
# - Environment variable support
###############################################################################

# Exit on error
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"
LOG_FILE="$BACKUP_DIR/backup.log"

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

# Function to clean up old backups (1 month+)
cleanup_old_backups() {
    log "Cleaning up backups older than 30 days (1 month)..."

    DELETED_COUNT=0

    # Find and delete backups older than 30 days
    while IFS= read -r file; do
        if [ -n "$file" ]; then
            log "Deleting old backup: $(basename "$file")"
            rm "$file"
            DELETED_COUNT=$((DELETED_COUNT + 1))
        fi
    done < <(find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +30)

    if [ $DELETED_COUNT -gt 0 ]; then
        log_success "Deleted $DELETED_COUNT old backup(s)"
    else
        log "No old backups to delete (all are less than 30 days old)"
    fi
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if container exists and is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    log_error "Container '$CONTAINER_NAME' is not running."
    log "Try starting it with: docker-compose -f docker-compose.db.yml up -d"
    exit 1
fi

log "Starting backup process..."
log "Database: $DB_NAME"
log "Container: $CONTAINER_NAME"
log "Backup file: $BACKUP_FILE"

# Create backup using pg_dump through Docker exec
if docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
    pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --no-owner --no-acl \
    | gzip > "$BACKUP_FILE"; then

    # Get backup file size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

    log_success "Backup completed successfully!"
    log "Backup size: $BACKUP_SIZE"
    log "Location: $BACKUP_FILE"

    # Clean up old backups based on retention policy (14 days)
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

    # Clean up backups older than 1 month (30 days)
    cleanup_old_backups

    # Count remaining backups
    BACKUP_COUNT=$(find "$BACKUP_DIR" -name "${DB_NAME}_backup_*.sql.gz" -type f | wc -l)
    log "Total backups retained: $BACKUP_COUNT"

    exit 0
else
    log_error "Backup failed!"

    # Remove incomplete backup file if it exists
    if [ -f "$BACKUP_FILE" ]; then
        rm "$BACKUP_FILE"
        log "Removed incomplete backup file."
    fi

    exit 1
fi
