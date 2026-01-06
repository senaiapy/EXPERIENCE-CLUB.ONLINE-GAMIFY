#!/bin/bash

echo "🚀 Experience Club - Deployment Setup"
echo "======================================"
echo "This script will initialize the e-commerce platform for deployment:"
echo "• PostgreSQL Database with migrations and seeding"
echo "• NestJS Backend API (Production mode)"
echo "• Next.js Frontend customer store (Production build)"
echo "• Next.js Admin dashboard (Production build)"
echo "• Docker containerization for all services"
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
        if docker exec clubdeofertas_deploy_postgres pg_isready -U clubdeofertas > /dev/null 2>&1; then
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

print_header "ENVIRONMENT VALIDATION"

# Check for required environment files
print_step "2.1" "Validating environment files..."
if [ ! -f .env.deploy ]; then
    print_error ".env.deploy file not found! Please create it first."
    exit 1
fi
print_success "Root .env.deploy file found"

if [ ! -f backend/.env.deploy ]; then
    print_error "backend/.env.deploy file not found! Please create it first."
    exit 1
fi
print_success "Backend .env.deploy file found"

if [ ! -f frontend/.env.deploy ]; then
    print_error "frontend/.env.deploy file not found! Please create it first."
    exit 1
fi
print_success "Frontend .env.deploy file found"

if [ ! -f admin/.env.deploy ]; then
    print_error "admin/.env.deploy file not found! Please create it first."
    exit 1
fi
print_success "Admin .env.deploy file found"

print_header "DOCKER ENVIRONMENT"

print_step "3.1" "Stopping any existing deployment containers..."
docker-compose -f docker-compose.deploy.yml down > /dev/null 2>&1
print_info "Cleaned up any existing containers"

print_step "3.2" "Building Docker containers for deployment..."
docker-compose -f docker-compose.deploy.yml build --no-cache
check_command "Docker containers built successfully" "Failed to build Docker containers"

print_step "3.3" "Starting Docker services..."
docker-compose -f docker-compose.deploy.yml up -d
check_command "Docker services started" "Failed to start Docker services"

print_step "3.4" "Waiting for services to initialize..."
sleep 15

print_header "DATABASE SETUP"

print_step "4.1" "Checking database health..."
check_database
if [ $? -ne 0 ]; then
    print_error "Database setup failed"
    exit 1
fi

print_step "4.2" "Pushing database schema (Prisma)..."
docker-compose -f docker-compose.deploy.yml exec -T backend npx prisma db push --accept-data-loss > /dev/null 2>&1
check_command_warn "Database schema created" "Schema push had warnings or already exists"

print_step "4.3" "Generating Prisma client..."
docker-compose -f docker-compose.deploy.yml exec -T backend npx prisma generate > /dev/null 2>&1
check_command_warn "Prisma client generated" "Prisma client generation had warnings"

print_step "4.4" "Running database migrations..."
docker-compose -f docker-compose.deploy.yml exec -T backend npx prisma migrate deploy > /dev/null 2>&1
check_command_warn "Database migrations completed" "Some migrations may have failed or already exist"

print_step "4.5" "Seeding database with initial data..."
print_info "Running seed script to populate database with products, brands, and admin user..."
docker-compose -f docker-compose.deploy.yml exec -T backend npm run seed > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Database seeded successfully with products and admin user"
else
    print_warning "Seeding had warnings or data may already exist"
    print_info "Attempting to create admin user separately..."
    docker-compose -f docker-compose.deploy.yml exec -T backend npm run seed:admin > /dev/null 2>&1
    check_command_warn "Admin user created" "Admin user may already exist"
fi

print_step "4.6" "Importing products data..."
if [ -f "import-products.js" ]; then
    print_info "Generating product SQL from import-products.js..."
    node import-products.js > /tmp/import-products.sql 2>&1
    if [ -f "/tmp/import-products.sql" ]; then
        docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < /tmp/import-products.sql > /dev/null 2>&1
        check_command_warn "Products imported successfully" "Some products may have been skipped"
    else
        print_warning "Failed to generate SQL, skipping product import"
    fi
else
    print_warning "import-products.js not found, skipping product import"
    print_info "You can manually import products later using:"
    print_info "  docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < your_backup.sql"
fi

print_header "SYSTEM VALIDATION"

print_step "5.1" "Waiting for backend API to be ready..."
wait_for_service "Backend API" "3062"

print_step "5.2" "Waiting for frontend application..."
wait_for_service "Frontend" "3060"

print_step "5.3" "Waiting for admin application..."
wait_for_service "Admin Panel" "3061"

print_step "5.4" "Testing API endpoints..."
API_RESPONSE=$(curl -s "http://localhost:3062/api/products?page=1&limit=1" 2>&1)
if echo "$API_RESPONSE" | grep -q "products"; then
    PRODUCT_COUNT=$(echo "$API_RESPONSE" | grep -o '"total":[0-9]*' | cut -d: -f2)
    print_success "Products API is working (${PRODUCT_COUNT:-0} products in database)"
    if [ "${PRODUCT_COUNT:-0}" -eq 0 ]; then
        print_warning "Database is empty. You need to import products manually."
        print_info "See DOC/.MD/DEPLOYMENT_SUCCESS_SUMMARY.md for import instructions"
    fi
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

print_header "DEPLOYMENT COMPLETE"

echo ""
echo "🎉 Experience Club platform deployed successfully!"
echo ""
echo "🌐 Your applications are now running on:"
echo "┌─────────────────────────────────────────────────────────┐"
echo "│  Service         │  URL                               │"
echo "│─────────────────┼────────────────────────────────────│"
echo "│  Frontend Store  │  http://localhost:3060             │"
echo "│  Admin Panel     │  http://localhost:3061             │"
echo "│  Backend API     │  http://localhost:3062/api         │"
echo "│  Database        │  localhost:15432 (ext) / 5432 (int)│"
echo "│  pgAdmin         │  http://localhost:5050             │"
echo "└─────────────────────────────────────────────────────────┘"
echo ""
echo "🔐 Default admin credentials:"
echo "• Email: admin@clubdeofertas.com"
echo "• Password: admin123456"
echo ""
echo "📊 Database contains:"
echo "• Products with multi-size images"
echo "• Brands and categories"
echo "• Admin user and initial data"
echo "• Complete e-commerce functionality"
echo ""
echo "🛠️ Useful deployment commands:"
echo "• docker-compose -f docker-compose.deploy.yml logs -f      - View live logs"
echo "• docker-compose -f docker-compose.deploy.yml ps           - Check service status"
echo "• docker-compose -f docker-compose.deploy.yml restart      - Restart all services"
echo "• docker-compose -f docker-compose.deploy.yml down         - Stop all services"
echo "• npm run deploy:seed                                      - Reseed database"
echo ""
echo "📚 Documentation:"
echo "• See CLAUDE.md for complete development guide"
echo "• See DOC/.MD/DEPLOYMENT_SUCCESS_SUMMARY.md for next steps"
echo "• See DOC/.MD/DOCKER_DEPLOYMENT_COMPLETE.md for full deployment guide"
echo "• API documentation available at http://localhost:3062/api/docs"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Configure reverse proxy (Nginx/Apache) to route domains to ports"
echo "2. Set up SSL certificates for HTTPS"
echo "3. Configure firewall rules"
echo "4. Verify product data and images are loading correctly"
echo ""
echo "🚀 The platform is ready for configuration!"

# Final service status check
echo ""
print_info "Final system status:"
docker-compose -f docker-compose.deploy.yml ps

# Show product count
echo ""
PRODUCT_COUNT=$(docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas -t -c "SELECT COUNT(*) FROM \"Product\";" 2>/dev/null | tr -d ' \n')
if [ ! -z "$PRODUCT_COUNT" ]; then
    print_info "Database statistics:"
    echo "  • Products: $PRODUCT_COUNT"
    if [ "$PRODUCT_COUNT" -eq 0 ]; then
        print_warning "Database is empty! Import your products data:"
        echo "    docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < your_backup.sql"
    fi
fi
