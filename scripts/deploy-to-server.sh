#!/bin/bash

echo "🚀 Club de Ofertas - Remote Server Deployment"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}[STEP $1]${NC} $2"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE} $1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Server configuration
SERVER_IP="217.79.189.223"
SERVER_USER="root"
SERVER_PASSWORD="@450ab6606"
REMOTE_DIR="/opt/clubdeofertas"
PROJECT_NAME="CLUBOFERTAS-FULL"

print_header "DEPLOYMENT CONFIGURATION"
echo "Server IP: $SERVER_IP"
echo "Server User: $SERVER_USER"
echo "Remote Directory: $REMOTE_DIR"
echo ""

# Check prerequisites
print_header "PREREQUISITE CHECKS"

print_step "1.1" "Checking SSH connectivity..."
if command -v sshpass &> /dev/null; then
    print_success "sshpass is installed"
else
    print_warning "sshpass not found. Installing sshpass..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sshpass
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    else
        print_error "Please install sshpass manually"
        exit 1
    fi
fi

print_step "1.2" "Testing server connection..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'Connection successful'" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Server connection successful"
else
    print_error "Cannot connect to server. Please check credentials."
    exit 1
fi

print_header "PREPARING LOCAL FILES"

print_step "2.1" "Creating deployment package..."
# Create a temporary directory for deployment files
TEMP_DIR=$(mktemp -d)
print_info "Temporary directory: $TEMP_DIR"

# Copy necessary files
print_step "2.2" "Copying project files..."
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
    --exclude '.git' \
    --exclude 'postgres' \
    --exclude 'php' \
    --exclude 'uploads' \
    ./ $TEMP_DIR/ > /dev/null 2>&1

print_success "Project files copied to temporary directory"

print_header "SERVER PREPARATION"

print_step "3.1" "Installing required packages on server..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
    # Update package list
    apt-get update > /dev/null 2>&1

    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl start docker
        systemctl enable docker
        rm get-docker.sh
    fi

    # Install Docker Compose if not present
    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    # Install Node.js if not present (for npm commands)
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi

    echo "All required packages installed"
ENDSSH

print_success "Server packages installed"

print_step "3.2" "Creating remote directory..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"
print_success "Remote directory created"

print_header "FILE TRANSFER"

print_step "4.1" "Transferring files to server..."
sshpass -p "$SERVER_PASSWORD" rsync -avz --progress \
    -e "ssh -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude 'dist' \
    --exclude '.git' \
    --exclude 'postgres' \
    --exclude 'php' \
    $TEMP_DIR/ $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

if [ $? -eq 0 ]; then
    print_success "Files transferred successfully"
else
    print_error "File transfer failed"
    rm -rf $TEMP_DIR
    exit 1
fi

# Cleanup temp directory
rm -rf $TEMP_DIR

print_header "REMOTE DEPLOYMENT"

print_step "5.1" "Running production setup on server..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
    cd $REMOTE_DIR

    # Make setup script executable
    chmod +x setup-prod.sh

    # Stop any existing containers
    echo "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

    # Run production setup
    echo "Running production setup..."
    ./setup-prod.sh

    echo ""
    echo "Deployment completed on server!"
ENDSSH

if [ $? -eq 0 ]; then
    print_success "Production setup completed on server"
else
    print_error "Production setup failed on server"
    exit 1
fi

print_header "DEPLOYMENT VERIFICATION"

print_step "6.1" "Checking service status..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
    cd $REMOTE_DIR
    echo ""
    echo "Container Status:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "Resource Usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" \$(docker-compose -f docker-compose.prod.yml ps -q)
ENDSSH

print_header "DEPLOYMENT COMPLETE"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your applications are now accessible at:"
echo "┌──────────────────────────────────────────────────────────────────┐"
echo "│  Service         │  URL                                        │"
echo "│──────────────────┼─────────────────────────────────────────────│"
echo "│  Frontend Store  │  http://${SERVER_IP}:3060                   │"
echo "│  Admin Panel     │  http://${SERVER_IP}:3061                   │"
echo "│  Backend API     │  http://${SERVER_IP}:3062/api               │"
echo "│  pgAdmin         │  http://${SERVER_IP}:5050                   │"
echo "│  Swagger Docs    │  http://${SERVER_IP}:3062/api/docs          │"
echo "└──────────────────────────────────────────────────────────────────┘"
echo ""
echo "🔐 Default admin credentials:"
echo "• Email: admin@clubdeofertas.com"
echo "• Password: admin123456"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Test all URLs above to ensure services are running"
echo "2. Change default admin password immediately"
echo "3. Configure SSL/TLS certificates for HTTPS"
echo "4. Set up regular database backups"
echo "5. Configure domain names (optional)"
echo ""
echo "📊 Useful SSH commands:"
echo "• ssh $SERVER_USER@$SERVER_IP"
echo "• cd $REMOTE_DIR && docker-compose -f docker-compose.prod.yml logs -f"
echo "• cd $REMOTE_DIR && docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "🚀 Production deployment complete!"
