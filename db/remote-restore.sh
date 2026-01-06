#!/bin/bash

###############################################################################
# PostgreSQL Remote Restore Script for Club de Ofertas
#
# This script downloads and restores a backup from a remote server
#
# Features:
# - Lists available remote backups
# - Downloads selected backup
# - Restores to local database
# - Safety confirmations
# - Integrity verification
# - Detailed logging
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
LOCAL_BACKUP_DIR="${BACKUP_DIR:-$SCRIPT_DIR/backups}"
TEMP_DIR="$LOCAL_BACKUP_DIR/remote-restore-temp"
REMOTE_USER="${REMOTE_BACKUP_USER}"
REMOTE_HOST="${REMOTE_BACKUP_HOST}"
REMOTE_PORT="${REMOTE_BACKUP_PORT:-22}"
REMOTE_PATH="${REMOTE_BACKUP_PATH}"
SSH_KEY="${REMOTE_BACKUP_SSH_KEY:-$HOME/.ssh/id_rsa}"
LOG_FILE="$LOCAL_BACKUP_DIR/remote-restore.log"

# Create directories if they don't exist
mkdir -p "$LOCAL_BACKUP_DIR"
mkdir -p "$TEMP_DIR"

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
        log "Please verify remote server configuration"
        return 1
    fi
}

# Function to list remote backups
list_remote_backups() {
    log "Fetching list of remote backups..."

    # Get list of backups with details
    local backup_list=$(ssh -i "$SSH_KEY" -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" \
        "cd $REMOTE_PATH && ls -lt ${DB_NAME}_backup_*.sql.gz 2>/dev/null | awk '{print \$9, \$5, \$6, \$7, \$8}'" 2>&1)

    if [ -z "$backup_list" ]; then
        echo -e "\n${YELLOW}No remote backups found in $REMOTE_PATH${NC}"
        return 1
    fi

    echo -e "\n${BLUE}Available remote backups:${NC}\n"

    local i=1
    local -a backup_files
    local -a backup_info

    while IFS= read -r line; do
        if [ -n "$line" ]; then
            local filename=$(echo "$line" | awk '{print $1}')
            local size=$(echo "$line" | awk '{print $2}')
            local date=$(echo "$line" | awk '{print $3, $4, $5}')

            backup_files[$i]="$filename"
            backup_info[$i]="$size|$date"

            # Convert size to human readable
            local hr_size=$(numfmt --to=iec-i --suffix=B $size 2>/dev/null || echo "$size bytes")

            echo -e "${GREEN}[$i]${NC} $filename"
            echo -e "    Size: $hr_size | Date: $date"
            echo ""

            i=$((i + 1))
        fi
    done <<< "$backup_list"

    # Export arrays for later use
    export -a BACKUP_FILES=("${backup_files[@]}")
    export BACKUP_COUNT=$((i - 1))

    return 0
}

# Function to download backup from remote server
download_backup() {
    local remote_file="$1"
    local local_file="$TEMP_DIR/$(basename $remote_file)"

    log "Downloading backup from remote server..."
    log "Remote: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/$remote_file"
    log "Local: $local_file"

    # Download using rsync with progress
    if rsync -avz --progress -e "ssh -i $SSH_KEY -p $REMOTE_PORT" \
        "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/$remote_file" "$local_file" 2>&1 | tee -a "$LOG_FILE"; then

        # Verify file exists and is readable
        if [ -f "$local_file" ] && [ -r "$local_file" ]; then
            local size=$(du -h "$local_file" | cut -f1)
            log_success "Backup downloaded successfully!"
            log "Local file: $local_file"
            log "Size: $size"

            # Test backup file integrity
            log "Testing backup file integrity..."
            if gunzip -t "$local_file" 2>&1 | tee -a "$LOG_FILE"; then
                log_success "Backup file integrity verified"
            else
                log_error "Backup file is corrupted!"
                rm "$local_file"
                return 1
            fi

            echo "$local_file"
            return 0
        else
            log_error "Downloaded file not found or not readable"
            return 1
        fi
    else
        log_error "Backup download failed!"
        return 1
    fi
}

# Function to restore database
restore_database() {
    local backup_file="$1"

    log "Starting database restore..."
    log "Database: $DB_NAME"
    log "Container: $CONTAINER_NAME"
    log "Backup file: $backup_file"

    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        return 1
    fi

    # Check if container exists and is running
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_error "Container '$CONTAINER_NAME' is not running."
        log "Try starting it with: docker-compose -f docker-compose.db.yml up -d"
        return 1
    fi

    # Perform restore
    if gunzip -c "$backup_file" | docker exec -i -e PGPASSWORD="$DB_PASSWORD" "$CONTAINER_NAME" \
        psql -U "$DB_USER" -d "$DB_NAME" 2>&1 | tee -a "$LOG_FILE"; then

        log_success "Database restored successfully!"

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

        return 0
    else
        log_error "Database restore failed!"
        return 1
    fi
}

# Function to cleanup temporary files
cleanup_temp() {
    log "Cleaning up temporary files..."

    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"/*
        log "Temporary files removed"
    fi
}

# Main execution
main() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Club de Ofertas - Remote Restore Utility${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}\n"

    # Validate configuration
    if ! validate_config; then
        exit 1
    fi

    # Test SSH connection
    if ! test_ssh_connection; then
        exit 1
    fi

    # List remote backups
    if ! list_remote_backups; then
        echo -e "\n${YELLOW}No remote backups available.${NC}"
        exit 1
    fi

    # Interactive selection
    echo -e "${BLUE}Enter the number of the backup to restore (or 'q' to quit):${NC} "
    read -r selection

    if [ "$selection" = "q" ] || [ "$selection" = "Q" ]; then
        echo "Restore cancelled."
        cleanup_temp
        exit 0
    fi

    # Validate selection
    if ! [[ "$selection" =~ ^[0-9]+$ ]]; then
        log_error "Invalid selection. Please enter a number."
        cleanup_temp
        exit 1
    fi

    if [ "$selection" -lt 1 ] || [ "$selection" -gt "$BACKUP_COUNT" ]; then
        log_error "Invalid selection number. Must be between 1 and $BACKUP_COUNT"
        cleanup_temp
        exit 1
    fi

    # Get selected backup filename
    SELECTED_BACKUP="${BACKUP_FILES[$selection]}"

    if [ -z "$SELECTED_BACKUP" ]; then
        log_error "Could not retrieve selected backup filename"
        cleanup_temp
        exit 1
    fi

    echo -e "\n${BLUE}Selected backup: $SELECTED_BACKUP${NC}"

    # Safety confirmation
    echo -e "\n${YELLOW}⚠️  WARNING: This will replace ALL data in the '$DB_NAME' database!${NC}"
    echo -e "${YELLOW}   All current data will be lost!${NC}\n"
    echo -e "${BLUE}Are you sure you want to continue? (yes/no):${NC} "
    read -r confirmation

    if [ "$confirmation" != "yes" ]; then
        echo "Restore cancelled."
        cleanup_temp
        exit 0
    fi

    # Download backup
    log "==============================================="
    log "Starting remote restore process"
    log "==============================================="

    DOWNLOADED_FILE=$(download_backup "$SELECTED_BACKUP")

    if [ $? -ne 0 ] || [ -z "$DOWNLOADED_FILE" ]; then
        log_error "Failed to download backup"
        cleanup_temp
        exit 1
    fi

    # Restore database
    if restore_database "$DOWNLOADED_FILE"; then
        log "==============================================="
        log_success "Remote restore completed successfully!"
        log "==============================================="

        # Ask if user wants to keep downloaded file
        echo -e "\n${BLUE}Keep downloaded backup file locally? (yes/no):${NC} "
        read -r keep_file

        if [ "$keep_file" = "yes" ]; then
            # Move to backups directory
            local final_location="$LOCAL_BACKUP_DIR/$(basename $DOWNLOADED_FILE)"
            mv "$DOWNLOADED_FILE" "$final_location"
            log "Backup saved to: $final_location"
        else
            cleanup_temp
            log "Temporary files cleaned up"
        fi

        exit 0
    else
        log_error "Remote restore failed!"
        cleanup_temp
        exit 1
    fi
}

# Trap to ensure cleanup on exit
trap cleanup_temp EXIT

# Run main function
main

exit 0
