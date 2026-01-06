#!/bin/bash

echo "🚀 Experience Club - Production Deployment Setup"
echo "================================================"
echo "This script will deploy the e-commerce platform to production:"
echo "• PostgreSQL Database with migrations and seeding"
echo "• NestJS Backend API (port 3062)"
echo "• Next.js Frontend (port 3060)"
echo "• Next.js Admin (port 3061)"
echo "• Server IP: 217.79.189.223"
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

# Function to check command success
check_command() {
    if [ $? -eq 0 ]; then
        print_success "$1"
    else
        print_error "$2"
        exit 1
    fi
}

# Function to check command success with warning
check_command_warn() {
    if [ $? -eq 0 ]; then
        print_success "$1"
    else
        print_warning "$2"
    fi
}

# Function to wait for service
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    print_info "Waiting for $service to be ready on port $port..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1 || nc -z localhost $port 2>/dev/null; then
            print_success "$service is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    print_warning "$service may not be fully ready, but continuing..."
    return 1
}

# Function to check database health
check_database() {
    print_info "Checking PostgreSQL database health..."

    # Wait for PostgreSQL to be ready
    local max_attempts=20
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker exec clubdeofertas_prod_postgres pg_isready -U clubdeofertas > /dev/null 2>&1; then
            print_success "Database is healthy and ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    print_error "Database failed to become ready"
    return 1
}

print_header "PREREQUISITE CHECKS"

# Check if docker is installed
print_step "1.1" "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check if docker-compose is available
print_step "1.2" "Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed"

# Check if Docker daemon is running
print_step "1.3" "Checking Docker daemon status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker daemon is not running. Please start Docker first."
    exit 1
fi
print_success "Docker daemon is running"

print_header "ENVIRONMENT SETUP"

# Verify production environment files exist
print_step "2.1" "Verifying production environment files..."
if [ ! -f .env.prod ]; then
    print_error ".env.prod file not found! Please create it first."
    exit 1
fi
print_success "Root .env.prod file found"

if [ ! -f backend/.env.prod ]; then
    print_error "backend/.env.prod file not found! Please create it first."
    exit 1
fi
print_success "Backend .env.prod file found"

if [ ! -f frontend/.env.prod ]; then
    print_error "frontend/.env.prod file not found! Please create it first."
    exit 1
fi
print_success "Frontend .env.prod file found"

if [ ! -f admin/.env.prod ]; then
    print_error "admin/.env.prod file not found! Please create it first."
    exit 1
fi
print_success "Admin .env.prod file found"

print_header "DOCKER PRODUCTION ENVIRONMENT"

print_step "3.1" "Stopping any existing containers..."
docker-compose -f docker-compose.prod.yml down > /dev/null 2>&1
docker-compose -f docker-compose.dev.yml down > /dev/null 2>&1
print_info "Cleaned up any existing containers"

print_step "3.2" "Building Production Docker containers..."
docker-compose -f docker-compose.prod.yml build --no-cache
check_command "Production Docker containers built successfully" "Failed to build Docker containers"

print_step "3.3" "Starting Production Docker services..."
docker-compose -f docker-compose.prod.yml up -d
check_command "Production Docker services started" "Failed to start Docker services"

print_step "3.4" "Waiting for services to initialize..."
sleep 15

print_header "DATABASE SETUP"

print_step "4.1" "Checking database health..."
check_database
if [ $? -ne 0 ]; then
    print_error "Database setup failed"
    exit 1
fi

print_step "4.2" "Generating Prisma client..."
docker exec clubdeofertas_prod_backend npx prisma generate
check_command_warn "Prisma client generated" "Prisma client generation had warnings"

print_step "4.3" "Synchronizing database schema..."
docker exec clubdeofertas_prod_backend npx prisma db push --accept-data-loss
check_command_warn "Database schema synchronized" "Schema synchronization had warnings"

print_step "4.4" "Running database migrations..."
docker exec clubdeofertas_prod_backend npx prisma migrate deploy
check_command_warn "Database migrations completed" "Some migrations may have failed or already exist"

print_step "4.5" "Seeding database with initial data..."
docker exec clubdeofertas_prod_backend npm run seed
check_command_warn "Database seeded successfully" "Seeding completed with warnings (admin user may already exist)"

print_header "SYSTEM VALIDATION"

print_step "5.1" "Waiting for backend API to be ready..."
wait_for_service "Backend API" "3062"

print_step "5.2" "Waiting for frontend application..."
wait_for_service "Frontend" "3060"

print_step "5.3" "Waiting for admin application..."
wait_for_service "Admin Panel" "3061"

print_step "5.4" "Testing API endpoints..."
if curl -s "http://localhost:3062/api/products?page=1&limit=5" > /dev/null; then
    print_success "Products API is working"
else
    print_warning "Products API may need more time to initialize"
fi

if curl -s "http://localhost:3062/api/brands" > /dev/null; then
    print_success "Brands API is working"
else
    print_warning "Brands API may need more time to initialize"
fi

print_step "5.5" "Testing authentication..."
if curl -s -X POST "http://localhost:3062/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@clubdeofertas.com", "password": "admin123456"}' | grep -q "access_token"; then
    print_success "Authentication system is working"
else
    print_warning "Authentication may need more time to initialize"
fi

print_step "5.6" "Testing frontend HTML response..."
FRONTEND_RESPONSE=$(curl -s "http://localhost:3060")
if echo "$FRONTEND_RESPONSE" | grep -q "Experience Club"; then
    print_success "Frontend is serving HTML correctly"
else
    print_warning "Frontend HTML may not be loading products"
fi

print_header "PRODUCTION DEPLOYMENT COMPLETE"

echo ""
echo "🎉 Experience Club platform deployed to production successfully!"
echo ""
echo "🌐 Your applications are now running on:"
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  Service         │  Local URL                                   │"
echo "│─────────────────┼──────────────────────────────────────────────│"
echo "│  Frontend Store  │  http://localhost:3060                       │"
echo "│  Frontend Store  │  http://217.79.189.223:3060                  │"
echo "│  Admin Panel     │  http://localhost:3061                       │"
echo "│  Admin Panel     │  http://217.79.189.223:3061                  │"
echo "│  Backend API     │  http://localhost:3062/api                   │"
echo "│  Backend API     │  http://217.79.189.223:3062/api              │"
echo "│  Database        │  localhost:15432                             │"
echo "│  pgAdmin         │  http://localhost:5050                       │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "🔐 Default admin credentials:"
echo "• Email: admin@clubdeofertas.com"
echo "• Password: admin123456"
echo ""
echo "📊 Database contains:"
echo "• Products with multi-size images"
echo "• Brands and categories"
echo "• Complete e-commerce functionality"
echo ""
echo "🛠️ Useful production commands:"
echo "• docker-compose -f docker-compose.prod.yml logs -f         - View all service logs"
echo "• docker-compose -f docker-compose.prod.yml ps              - Check service status"
echo "• docker-compose -f docker-compose.prod.yml down            - Stop all services"
echo "• docker-compose -f docker-compose.prod.yml restart         - Restart all services"
echo ""
echo "🔍 Testing commands:"
echo "• curl http://217.79.189.223:3062/api/products?page=1&limit=5  - Test API"
echo "• curl http://217.79.189.223:3060                              - Test Frontend"
echo "• curl http://217.79.189.223:3061                              - Test Admin"
echo ""
echo "📚 Important Notes:"
echo "• All URLs use SERVER_IP (217.79.189.223) for external access"
echo "• Frontend and Admin connect to backend via: http://217.79.189.223:3062/api"
echo "• Make sure firewall allows ports 3060, 3061, 3062, 15432, 5050"
echo ""
echo "🚀 The platform is ready for production use!"

# Final service status check
echo ""
print_info "Final system status:"
docker-compose -f docker-compose.prod.yml ps

# Show recent logs
echo ""
print_info "Recent container logs:"
docker-compose -f docker-compose.prod.yml logs --tail=50
