#!/bin/bash

###############################################################################
# PostgreSQL Database Restore Script for Club de Ofertas
#
# This script restores a PostgreSQL database backup to the Docker container
# running in Docker (docker-compose.db.yml)
#
# Features:
# - Interactive backup file selection
# - Safety confirmation before restore
# - Automatic decompression of gzipped backups
# - Connection verification
# - Error handling and logging
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
LOG_FILE="$BACKUP_DIR/restore.log"

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

# Function to list available backups
list_backups() {
    echo -e "\n${BLUE}Available backup files:${NC}\n"

    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR/${DB_NAME}_backup_*.sql.gz 2>/dev/null)" ]; then
        echo -e "${YELLOW}No backup files found in $BACKUP_DIR${NC}"
        return 1
    fi

    # List backups with numbers
    local i=1
    for backup in $(ls -t $BACKUP_DIR/${DB_NAME}_backup_*.sql.gz); do
        local size=$(du -h "$backup" | cut -f1)
        local date=$(stat -c %y "$backup" | cut -d' ' -f1,2 | cut -d'.' -f1)
        echo -e "${GREEN}[$i]${NC} $(basename $backup) - ${size} - ${date}"
        i=$((i + 1))
    done

    return 0
}

# Main restore process
echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Club de Ofertas - Database Restore Utility${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

# Check for backup file argument
if [ -n "$1" ]; then
    BACKUP_FILE="$1"

    if [ ! -f "$BACKUP_FILE" ]; then
        log_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
else
    # Interactive mode - list and select backup
    if ! list_backups; then
        echo -e "\n${YELLOW}No backups available. Please run backup.sh first.${NC}"
        exit 1
    fi

    echo -e "\n${BLUE}Enter the number of the backup to restore (or 'q' to quit):${NC} "
    read -r selection

    if [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
        echo "Restore cancelled."
        exit 0
    fi

    # Validate selection
    if ! [[ "$selection" =~ ^[0-9]+$ ]]; then
        log_error "Invalid selection. Please enter a number."
        exit 1
    fi

    # Get the selected backup file
    BACKUP_FILE=$(ls -t $BACKUP_DIR/${DB_NAME}_backup_*.sql.gz | sed -n "${selection}p")

    if [ -z "$BACKUP_FILE" ]; then
        log_error "Invalid selection number."
        exit 1
    fi
fi

# Display selected backup info
echo -e "\n${BLUE}Selected backup:${NC}"
echo -e "  File: $(basename $BACKUP_FILE)"
echo -e "  Size: $(du -h $BACKUP_FILE | cut -f1)"
echo -e "  Date: $(stat -c %y $BACKUP_FILE | cut -d'.' -f1)"

# Safety confirmation
echo -e "\n${YELLOW}⚠️  WARNING: This will replace ALL data in the '$DB_NAME' database!${NC}"
echo -e "${YELLOW}   All current data will be lost!${NC}\n"
echo -e "${BLUE}Are you sure you want to continue? (yes/no):${NC} "
read -r confirmation

if [ "$confirmation" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

log "Starting restore process..."
log "Database: $DB_NAME"
log "Container: $CONTAINER_NAME"
log "Backup file: $BACKUP_FILE"

# Perform restore
if gunzip -c "$BACKUP_FILE" | docker exec -i -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
    psql -U "$DB_USER" -d "$DB_NAME"; then

    log_success "Database restored successfully!"
    log "Restored from: $BACKUP_FILE"

    # Verify connection
    echo -e "\n${BLUE}Verifying database connection...${NC}"
    if docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
        psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';" > /dev/null 2>&1; then

        log_success "Database connection verified successfully!"

        # Get table count
        TABLE_COUNT=$(docker exec -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
            psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

        log "Total tables in database: $(echo $TABLE_COUNT | xargs)"
    else
        log_warning "Could not verify database connection. Please check manually."
    fi

    exit 0
else
    log_error "Restore failed!"
    log_error "Please check the backup file and database connection."
    exit 1
fi
