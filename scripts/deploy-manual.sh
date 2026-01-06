#!/bin/bash

echo "🚀 Club de Ofertas - Manual Deployment Guide"
echo "==========================================="
echo ""
echo "This script will help you deploy to your production server."
echo "Server IP: 217.79.189.223"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}STEP 1: Prepare Deployment Package${NC}"
echo "Creating deployment archive..."

# Create deployment package
tar -czf clubdeofertas-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.git' \
    --exclude='postgres' \
    --exclude='php' \
    --exclude='uploads' \
    .

echo -e "${GREEN}✓ Deployment package created: clubdeofertas-deploy.tar.gz${NC}"
echo ""

echo -e "${BLUE}STEP 2: Transfer to Server${NC}"
echo "Run this command to transfer files:"
echo ""
echo -e "${CYAN}scp clubdeofertas-deploy.tar.gz root@217.79.189.223:/opt/${NC}"
echo ""
echo "Password: @450ab6606"
echo ""
read -p "Press Enter after file transfer is complete..."

echo ""
echo -e "${BLUE}STEP 3: SSH to Server${NC}"
echo "Now SSH to your server with:"
echo ""
echo -e "${CYAN}ssh root@217.79.189.223${NC}"
echo ""
echo "Password: @450ab6606"
echo ""
echo -e "${YELLOW}Once connected, run these commands on the server:${NC}"
echo ""
echo "# Navigate to deployment directory"
echo "cd /opt"
echo ""
echo "# Extract files"
echo "tar -xzf clubdeofertas-deploy.tar.gz -C /opt/clubdeofertas/ || mkdir -p /opt/clubdeofertas && tar -xzf clubdeofertas-deploy.tar.gz -C /opt/clubdeofertas/"
echo ""
echo "# Install Docker (if not installed)"
echo "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
echo ""
echo "# Install Docker Compose (if not installed)"
echo "curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
echo "chmod +x /usr/local/bin/docker-compose"
echo ""
echo "# Go to project directory"
echo "cd /opt/clubdeofertas"
echo ""
echo "# Make setup script executable"
echo "chmod +x setup-prod.sh"
echo ""
echo "# Run production setup"
echo "./setup-prod.sh"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}After deployment completes, access your site at:${NC}"
echo -e "${GREEN}• Frontend: http://217.79.189.223:3060${NC}"
echo -e "${GREEN}• Admin: http://217.79.189.223:3061${NC}"
echo -e "${GREEN}• API: http://217.79.189.223:3062/api${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
