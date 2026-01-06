#!/bin/bash

echo "🔧 Applying Production Configuration - Quick Deploy"
echo "===================================================="

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

print_step "1. Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

print_step "2. Backing up current .env files..."
cp .env .env.backup
cp backend/.env backend/.env.backup
cp frontend/.env frontend/.env.backup
cp admin/.env admin/.env.backup

print_step "3. Applying production environment variables..."

# Update root .env
sed -i 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' .env
sed -i 's/NODE_ENV=development/NODE_ENV=production/g' .env

# Update backend/.env
sed -i 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' backend/.env
sed -i 's/NODE_ENV=development/NODE_ENV=production/g' backend/.env
sed -i 's/DB_HOST=localhost/DB_HOST=postgres/g' backend/.env
sed -i 's/POSTGRES_PORT=15432/POSTGRES_PORT=5432/g' backend/.env

# Update frontend/.env
sed -i 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' frontend/.env
sed -i 's/NODE_ENV=development/NODE_ENV=production/g' frontend/.env
sed -i 's/DB_HOST=localhost/DB_HOST=postgres/g' frontend/.env
sed -i 's/POSTGRES_PORT=15432/POSTGRES_PORT=5432/g' frontend/.env

# Update admin/.env
sed -i 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' admin/.env
sed -i 's/NODE_ENV=development/NODE_ENV=production/g' admin/.env
sed -i 's/DB_HOST=localhost/DB_HOST=postgres/g' admin/.env
sed -i 's/POSTGRES_PORT=15432/POSTGRES_PORT=5432/g' admin/.env

print_success "Environment variables updated"

print_step "4. Rebuilding containers with production config..."
docker-compose -f docker-compose.dev.yml build

print_step "5. Starting production services..."
docker-compose -f docker-compose.dev.yml up -d

print_step "6. Waiting for services to be ready..."
sleep 20

print_step "7. Checking service status..."
docker-compose -f docker-compose.dev.yml ps

print_step "8. Testing API endpoint..."
curl -s http://217.79.189.223:3062/api/products?page=1&limit=2 | head -20

print_success "Production configuration applied!"

echo ""
echo "🌐 Access your applications at:"
echo "  Frontend: http://217.79.189.223:3060"
echo "  Admin:    http://217.79.189.223:3061"
echo "  Backend:  http://217.79.189.223:3062/api"
echo ""
echo "📝 Backup files saved:"
echo "  .env.backup"
echo "  backend/.env.backup"
echo "  frontend/.env.backup"
echo "  admin/.env.backup"
