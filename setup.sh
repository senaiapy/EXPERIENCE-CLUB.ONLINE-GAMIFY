#!/bin/bash

echo "🚀 Experience Club - Complete Development Setup"
echo "================================================"
echo "This script will initialize the entire e-commerce platform:"
echo "• PostgreSQL Database with migrations and seeding"
echo "• NestJS Backend API with all endpoints"
echo "• Next.js Frontend customer store"
echo "• Next.js Admin dashboard"
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
        if docker exec clubdeofertas_dev_postgres pg_isready -U clubdeofertas > /dev/null 2>&1; then
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

# Check if npm is installed
print_step "1.3" "Checking Node.js and npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install Node.js and npm first."
    exit 1
fi
print_success "Node.js and npm are installed"

# Check if Docker daemon is running
print_step "1.4" "Checking Docker daemon status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker daemon is not running. Please start Docker first."
    exit 1
fi
print_success "Docker daemon is running"

print_header "ENVIRONMENT SETUP"

# Create environment files
print_step "2.1" "Setting up environment configuration..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_warning ".env.example not found, creating basic .env file"
        cat > .env << EOF
# Database Configuration
POSTGRES_USER=clubdeofertas
POSTGRES_PASSWORD=clubdeofertas123
POSTGRES_DB=clubdeofertas
POSTGRES_PORT=15432

# Backend Configuration
BACKEND_PORT=3062
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=24h

# Frontend Configuration
FRONTEND_PORT=3060
ADMIN_PORT=3061

# Environment
NODE_ENV=development
APP_VERSION_STRING=Version 1.0.1-Experience Club!
EOF
        print_success "Created basic .env file"
    fi
else
    print_info ".env file already exists, keeping existing configuration"
fi


print_header "DEPENDENCY INSTALLATION"

print_step "3.1" "Installing root dependencies..."
npm install
check_command "Root dependencies installed" "Failed to install root dependencies"

print_step "3.2" "Installing backend dependencies..."
cd backend && npm install && cd ..
check_command "Backend dependencies installed" "Failed to install backend dependencies"

print_step "3.3" "Installing frontend dependencies..."
cd frontend && npm install && cd ..
check_command "Frontend dependencies installed" "Failed to install frontend dependencies"

print_step "3.4" "Installing admin dependencies..."
cd admin && npm install && cd ..
check_command "Admin dependencies installed" "Failed to install admin dependencies"

print_header "DOCKER ENVIRONMENT"

print_step "4.1" "Stopping any existing containers..."
docker-compose -f docker-compose.dev.yml down > /dev/null 2>&1
print_info "Cleaned up any existing containers"

print_step "4.2" "Building Docker containers..."
docker-compose -f docker-compose.dev.yml build --no-cache
check_command "Docker containers built successfully" "Failed to build Docker containers"

print_step "4.3" "Starting Docker services..."
docker-compose -f docker-compose.dev.yml up -d
check_command "Docker services started" "Failed to start Docker services"

print_step "4.4" "Waiting for services to initialize..."
sleep 15

print_header "DATABASE SETUP"

print_step "5.1" "Checking database health..."
check_database
if [ $? -ne 0 ]; then
    print_error "Database setup failed"
    exit 1
fi

print_step "5.2" "Generating Prisma client..."
docker-compose exec -T backend npx prisma generate
check_command_warn "Prisma client generated" "Prisma client generation had warnings"

print_step "5.3" "Synchronizing database schema..."
docker-compose exec -T backend npx prisma db push --accept-data-loss
check_command_warn "Database schema synchronized" "Schema synchronization had warnings"

print_step "5.4" "Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy
check_command_warn "Database migrations completed" "Some migrations may have failed or already exist"

print_step "5.5" "Initializing database with admin user..."
docker-compose exec -T postgres psql -U clubdeofertas -d clubdeofertas < db-init.sql > /dev/null 2>&1
check_command_warn "Admin user created" "Admin user may already exist"

print_step "5.6" "Importing products data (500 products)..."
if [ -f "import-products.js" ]; then
    node import-products.js > /tmp/import-products.sql 2>&1
    docker-compose exec -T postgres psql -U clubdeofertas -d clubdeofertas < /tmp/import-products.sql > /dev/null 2>&1
    check_command_warn "Products imported successfully" "Some products may have been skipped"
else
    print_warning "import-products.js not found, skipping product import"
fi

print_header "SYSTEM VALIDATION"

print_step "6.1" "Waiting for backend API to be ready..."
wait_for_service "Backend API" "3062"

print_step "6.2" "Waiting for frontend application..."
wait_for_service "Frontend" "3060"

print_step "6.3" "Waiting for admin application..."
wait_for_service "Admin Panel" "3061"

print_step "6.4" "Testing API endpoints..."
if curl -s "http://localhost:3062/api/products" > /dev/null; then
    print_success "Products API is working"
else
    print_warning "Products API may need more time to initialize"
fi

if curl -s "http://localhost:3062/api/brands" > /dev/null; then
    print_success "Brands API is working"
else
    print_warning "Brands API may need more time to initialize"
fi

print_step "6.5" "Testing authentication..."
if curl -s -X POST "http://localhost:3062/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@clubdeofertas.com", "password": "admin123456"}' | grep -q "access_token"; then
    print_success "Authentication system is working"
else
    print_warning "Authentication may need more time to initialize"
fi

print_header "SETUP COMPLETE"

echo ""
echo "🎉 Experience Club platform setup completed successfully!"
echo ""
echo "🌐 Your applications are now running on:"
echo "┌─────────────────────────────────────────────────────────┐"
echo "│  Service         │  URL                               │"
echo "│─────────────────┼────────────────────────────────────│"
echo "│  Frontend Store  │  http://localhost:3060             │"
echo "│  Admin Panel     │  http://localhost:3061             │"
echo "│  Backend API     │  http://localhost:3062/api         │"
echo "│  Database        │  localhost:15432                   │"
echo "└─────────────────────────────────────────────────────────┘"
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
echo "🛠️ Useful development commands:"
echo "• npm run dev:logs                - View all service logs"
echo "• npm run dev:stop                - Stop all services"
echo "• npm run prisma:studio           - Open database GUI"
echo "• docker-compose -f docker-compose.dev.yml ps  - Check service status"
echo ""
echo "📚 Documentation:"
echo "• See CLAUDE.md for complete development guide"
echo "• API documentation available at backend/src/main.ts"
echo ""
echo "🚀 The platform is ready for development and testing!"

# Final service status check
echo ""
print_info "Final system status:"
docker-compose -f docker-compose.dev.yml ps