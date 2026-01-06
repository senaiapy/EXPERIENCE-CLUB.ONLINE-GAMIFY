#!/bin/bash

echo "🚀 Deploy to Remote Server - Club de Ofertas"
echo "============================================="
echo ""

# Remote server configuration
REMOTE_HOST="217.79.189.223"
REMOTE_USER="root"
REMOTE_DIR="/www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "This script will help you deploy to the remote server."
echo ""
echo "Remote Server: ${REMOTE_HOST}"
echo "Remote Directory: ${REMOTE_DIR}"
echo ""
echo "You will need to manually connect via SSH to complete the deployment."
echo ""

print_step "Creating archive of production files..."

# Create temporary directory
mkdir -p /tmp/clubdeofertas-deploy

# Copy production configuration files
cp docker-compose.prod.yml /tmp/clubdeofertas-deploy/
cp setup-prod.sh /tmp/clubdeofertas-deploy/
cp .env.prod /tmp/clubdeofertas-deploy/
cp backend/.env.prod /tmp/clubdeofertas-deploy/backend.env.prod
cp frontend/.env.prod /tmp/clubdeofertas-deploy/frontend.env.prod
cp admin/.env.prod /tmp/clubdeofertas-deploy/admin.env.prod

# Create deployment instructions
cat > /tmp/clubdeofertas-deploy/DEPLOY_INSTRUCTIONS.md << 'EOF'
# Deployment Instructions for Club de Ofertas

## Step 1: Connect to Remote Server

```bash
ssh root@217.79.189.223
# Password: @450Ab6606
```

## Step 2: Navigate to Project Directory

```bash
cd /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL
```

## Step 3: Copy Production Files

Copy these files from your local machine to the remote server:
- docker-compose.prod.yml → /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL/
- setup-prod.sh → /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL/
- .env.prod → /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL/
- backend.env.prod → /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL/backend/.env.prod
- frontend.env.prod → /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL/frontend/.env.prod
- admin.env.prod → /www/wwwroot/clubedeofertas.online/clubdeofertas.online-FULL/admin/.env.prod

## Step 4: Make Setup Script Executable

```bash
chmod +x setup-prod.sh
```

## Step 5: Run Production Setup

```bash
./setup-prod.sh
```

## Step 6: Verify Services

Check all services are running:
```bash
docker-compose -f docker-compose.prod.yml ps
```

View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

Test API:
```bash
curl http://localhost:3062/api/products?page=1&limit=5
curl http://217.79.189.223:3062/api/products?page=1&limit=5
```

Test Frontend:
```bash
curl http://localhost:3060
curl http://217.79.189.223:3060
```

## Step 7: Access Applications

- Frontend: http://217.79.189.223:3060
- Admin: http://217.79.189.223:3061
- Backend API: http://217.79.189.223:3062/api
- pgAdmin: http://217.79.189.223:5050

## Troubleshooting

If services fail to start, check logs:
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs admin
```

Restart services:
```bash
docker-compose -f docker-compose.prod.yml restart
```

Stop all services:
```bash
docker-compose -f docker-compose.prod.yml down
```

## Important Configuration

All environment files (.env.prod) are configured with:
- SERVER_IP=217.79.189.223
- NEXT_PUBLIC_API_URL=http://217.79.189.223:3062/api
- CORS_ORIGINS includes the server IP

This ensures the frontend/admin in the browser can connect to the backend API correctly.
EOF

print_success "Production files prepared in /tmp/clubdeofertas-deploy/"
echo ""
print_step "Files ready for deployment:"
ls -lah /tmp/clubdeofertas-deploy/
echo ""

print_warning "MANUAL DEPLOYMENT REQUIRED"
echo ""
echo "Due to SSH password authentication, please follow these steps:"
echo ""
echo "1. Open a new terminal window"
echo "2. Run: ssh root@217.79.189.223"
echo "3. Enter password: @450Ab6606"
echo "4. Navigate to: cd ${REMOTE_DIR}"
echo "5. Upload the files from /tmp/clubdeofertas-deploy/ to the remote server"
echo ""
echo "Option A - Using SCP (from your local machine):"
echo "  scp /tmp/clubdeofertas-deploy/docker-compose.prod.yml root@${REMOTE_HOST}:${REMOTE_DIR}/"
echo "  scp /tmp/clubdeofertas-deploy/setup-prod.sh root@${REMOTE_HOST}:${REMOTE_DIR}/"
echo "  scp /tmp/clubdeofertas-deploy/.env.prod root@${REMOTE_HOST}:${REMOTE_DIR}/"
echo "  scp /tmp/clubdeofertas-deploy/backend.env.prod root@${REMOTE_HOST}:${REMOTE_DIR}/backend/.env.prod"
echo "  scp /tmp/clubdeofertas-deploy/frontend.env.prod root@${REMOTE_HOST}:${REMOTE_DIR}/frontend/.env.prod"
echo "  scp /tmp/clubdeofertas-deploy/admin.env.prod root@${REMOTE_HOST}:${REMOTE_DIR}/admin/.env.prod"
echo ""
echo "Option B - Manual copy via SSH session:"
echo "  1. SSH into the server"
echo "  2. Create the files manually or use a file transfer tool"
echo ""
echo "6. Then run on the remote server:"
echo "  chmod +x setup-prod.sh"
echo "  ./setup-prod.sh"
echo ""
print_success "Deployment files are ready!"
echo ""
echo "📚 See /tmp/clubdeofertas-deploy/DEPLOY_INSTRUCTIONS.md for detailed instructions"
