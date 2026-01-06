# Experience Club - Docker Deployment Manual

Complete guide to deploy and manage the Experience Club e-commerce platform using Docker.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Manual Setup](#manual-setup)
4. [Database Management](#database-management)
5. [Service Management](#service-management)
6. [Troubleshooting](#troubleshooting)
7. [Access URLs](#access-urls)
8. [Default Credentials](#default-credentials)

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Node.js**: Version 18 or higher (for import scripts)
- **Git**: For cloning the repository

### Installation Check

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Node.js
node --version

# Check if Docker daemon is running
docker info
```

---

## Quick Start

### Automated Deployment (Recommended)

The fastest way to get the entire system running:

```bash
# 1. Navigate to project directory
cd /path/to/CLUBDEOFERTAS.COM.PY

# 2. Make setup script executable
chmod +x setup-deploy.sh

# 3. Run automated setup
./setup-deploy.sh
```

This script will:
- ✅ Validate prerequisites (Docker, Docker Compose, Node.js)
- ✅ Check environment files (.env.deploy)
- ✅ Build Docker images (backend, frontend, admin)
- ✅ Start all services (PostgreSQL, Backend, Frontend, Admin, pgAdmin)
- ✅ Run database migrations
- ✅ Create admin user
- ✅ Import 1076 products with images
- ✅ Verify all services are healthy

**Total setup time**: ~5-10 minutes

---

## Manual Setup

If you prefer to set up step by step:

### Step 1: Environment Configuration

Ensure all `.env.deploy` files exist:

```bash
# Root .env.deploy
ls -la .env.deploy

# Backend .env.deploy
ls -la backend/.env.deploy

# Frontend .env.deploy
ls -la frontend/.env.deploy

# Admin .env.deploy
ls -la admin/.env.deploy
```

### Step 2: Build Docker Images

```bash
# Build all images (backend, frontend, admin)
docker-compose -f docker-compose.deploy.yml build --no-cache
```

This will:
- Build NestJS backend (production mode)
- Build Next.js frontend (optimized production build)
- Build Next.js admin panel (optimized production build)

**Build time**: ~5-8 minutes

### Step 3: Start Services

```bash
# Start all containers in detached mode
docker-compose -f docker-compose.deploy.yml up -d
```

Services started:
- `clubdeofertas_deploy_postgres` - PostgreSQL database
- `clubdeofertas_deploy_backend` - NestJS API
- `clubdeofertas_deploy_frontend` - Next.js customer store
- `clubdeofertas_deploy_admin` - Next.js admin dashboard
- `clubdeofertas_deploy_pgadmin` - Database management UI

### Step 4: Database Initialization

#### 4.1 Run Migrations

```bash
docker-compose -f docker-compose.deploy.yml exec -T backend npx prisma migrate deploy
```

#### 4.2 Generate Prisma Client

```bash
docker-compose -f docker-compose.deploy.yml exec -T backend npx prisma generate
```

#### 4.3 Create Admin User

```bash
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < db-init.sql
```

This creates:
- Email: `admin@clubdeofertas.com`
- Password: `admin123456`

#### 4.4 Import Products

```bash
# Generate SQL from JSON
node import-products.js > /tmp/import-products.sql

# Import into database
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < /tmp/import-products.sql
```

This imports:
- 1076 products
- 1075 product images
- 909 brands
- 11 categories

---

## Database Management

### View Database Statistics

```bash
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas -c "
SELECT 'Products: ' || COUNT(*) FROM \"Product\"
UNION ALL SELECT 'Images: ' || COUNT(*) FROM \"ProductImage\"
UNION ALL SELECT 'Brands: ' || COUNT(*) FROM \"Brand\"
UNION ALL SELECT 'Categories: ' || COUNT(*) FROM \"Category\"
UNION ALL SELECT 'Users: ' || COUNT(*) FROM \"User\";
"
```

### Reset Database

**⚠️ WARNING: This will delete ALL data!**

```bash
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas << 'EOF'
TRUNCATE "ProductImage" CASCADE;
TRUNCATE "Product" CASCADE;
TRUNCATE "Brand" CASCADE;
TRUNCATE "Category" CASCADE;
TRUNCATE "User" CASCADE;
EOF
```

### Backup Database

```bash
# Create backup
docker-compose -f docker-compose.deploy.yml exec -T postgres pg_dump -U clubdeofertas clubdeofertas > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < backup_20250127_120000.sql
```

### Access PostgreSQL Shell

```bash
docker-compose -f docker-compose.deploy.yml exec postgres psql -U clubdeofertas -d clubdeofertas
```

Common queries:

```sql
-- List all tables
\dt

-- Count products
SELECT COUNT(*) FROM "Product";

-- View recent products
SELECT id, name, price FROM "Product" ORDER BY "createdAt" DESC LIMIT 10;

-- Exit
\q
```

---

## Service Management

### Check Service Status

```bash
# View all containers
docker-compose -f docker-compose.deploy.yml ps

# Check logs
docker-compose -f docker-compose.deploy.yml logs -f

# Check specific service logs
docker-compose -f docker-compose.deploy.yml logs -f backend
docker-compose -f docker-compose.deploy.yml logs -f frontend
docker-compose -f docker-compose.deploy.yml logs -f admin
```

### Start/Stop Services

```bash
# Start all services
docker-compose -f docker-compose.deploy.yml up -d

# Stop all services
docker-compose -f docker-compose.deploy.yml down

# Restart all services
docker-compose -f docker-compose.deploy.yml restart

# Restart specific service
docker-compose -f docker-compose.deploy.yml restart backend
```

### Rebuild After Code Changes

```bash
# Stop services
docker-compose -f docker-compose.deploy.yml down

# Rebuild images
docker-compose -f docker-compose.deploy.yml build --no-cache

# Start services
docker-compose -f docker-compose.deploy.yml up -d
```

---

## Troubleshooting

### Issue: Containers Not Starting

**Check logs:**
```bash
docker-compose -f docker-compose.deploy.yml logs -f
```

**Common causes:**
- Port already in use
- Missing environment files
- Docker daemon not running

**Solution:**
```bash
# Stop all containers
docker-compose -f docker-compose.deploy.yml down

# Remove volumes (⚠️ deletes data)
docker-compose -f docker-compose.deploy.yml down -v

# Start fresh
docker-compose -f docker-compose.deploy.yml up -d
```

### Issue: Database Connection Failed

**Check database health:**
```bash
docker-compose -f docker-compose.deploy.yml exec postgres pg_isready -U clubdeofertas
```

**Restart database:**
```bash
docker-compose -f docker-compose.deploy.yml restart postgres
```

### Issue: Frontend/Admin Shows 502 Error

**Backend might not be ready:**
```bash
# Check backend logs
docker-compose -f docker-compose.deploy.yml logs backend

# Restart backend
docker-compose -f docker-compose.deploy.yml restart backend

# Wait 30 seconds for backend to initialize
sleep 30
```

### Issue: Images Not Displaying

**Verify image URLs:**
```bash
# Check sample product
curl http://localhost:3062/api/products/product-1 | grep "url"
```

**Image URLs should have `/` prefix:**
- ✅ Correct: `"/lattafa-eclaire-pistache-edp-100ml.jpg"`
- ❌ Wrong: `"https://www.experience-club.online/admin/images/products/..."`

**Reimport products with correct images:**
```bash
node import-products.js > /tmp/import-products.sql
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < /tmp/import-products.sql
```

### Issue: Prices in USD Instead of Guaraníes

**Check product price:**
```bash
curl http://localhost:3062/api/products/product-1 | grep "price"
```

**Price should be in Guaraníes:**
- ✅ Correct: `"price": 265000`
- ❌ Wrong: `"price": 36.3`

**Reimport with correct prices:**
```bash
# Verify import-products.js uses Guaraníes (not USD conversion)
# Then reimport
node import-products.js > /tmp/import-products.sql
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < /tmp/import-products.sql
```

### Issue: Port Already in Use

**Find what's using the port:**
```bash
# Check port 3060 (frontend)
sudo lsof -i :3060

# Check port 3061 (admin)
sudo lsof -i :3061

# Check port 3062 (backend)
sudo lsof -i :3062
```

**Kill the process or change ports in .env.deploy**

### Clean Installation

**Remove everything and start fresh:**

```bash
# Stop and remove containers
docker-compose -f docker-compose.deploy.yml down -v

# Remove images
docker rmi clubdeofertascompy_backend clubdeofertascompy_frontend clubdeofertascompy_admin

# Clean Docker system
docker system prune -a

# Run setup again
./setup-deploy.sh
```

---

## Access URLs

Once deployment is complete, access the following URLs:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3060 | Customer e-commerce store |
| **Admin Panel** | http://localhost:3061 | Admin dashboard |
| **Backend API** | http://localhost:3062/api | REST API endpoints |
| **API Docs** | http://localhost:3062/api/docs | Swagger documentation |
| **pgAdmin** | http://localhost:5050 | Database management UI |
| **PostgreSQL** | localhost:15432 | Database (external port) |

---

## Default Credentials

### Admin User (Frontend/Admin)

- **Email**: `admin@clubdeofertas.com`
- **Password**: `admin123456`

### pgAdmin

- **Email**: `admin@clubdeofertas.com`
- **Password**: Set in `.env.deploy` file (`PGADMIN_DEFAULT_PASSWORD`)

### PostgreSQL Database

- **Host**: `localhost` (external) or `postgres` (internal)
- **Port**: `15432` (external) or `5432` (internal)
- **Database**: `clubdeofertas`
- **User**: `clubdeofertas`
- **Password**: Set in `.env.deploy` file (`POSTGRES_PASSWORD`)

---

## Testing the Deployment

### 1. Test Backend API

```bash
# Health check
curl http://localhost:3062/api

# Get products
curl http://localhost:3062/api/products?page=1&limit=5

# Test authentication
curl -X POST http://localhost:3062/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@clubdeofertas.com", "password": "admin123456"}'
```

### 2. Test Frontend

```bash
# Check frontend is responding
curl -I http://localhost:3060

# Should return HTTP/1.1 200 OK
```

### 3. Test Admin

```bash
# Check admin is responding
curl -I http://localhost:3061

# Should return HTTP/1.1 200 OK
```

### 4. Verify Database

```bash
# Check products count
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas -c "SELECT COUNT(*) FROM \"Product\";"

# Should return 1076
```

---

## Database Schema

### Core Tables

- **User** - Authentication and user management
- **Product** - Product catalog (1076 products)
- **ProductImage** - Product images with URLs
- **Brand** - Product brands (909 brands)
- **Category** - Product categories (11 categories)
- **Cart** / **CartItem** - Shopping cart
- **Wishlist** - Saved products
- **Order** / **OrderItem** - Order management

### Key Fields

**Product:**
- `price` - In Guaraníes (e.g., 265000)
- `price_sale` - Sale price in Guaraníes
- `stock` - Stock quantity (integer)
- `stockStatus` - "En stock" or "Agotado"

**ProductImage:**
- `url` - Image URL with `/` prefix (e.g., `/product-image.jpg`)
- `filename` - Image filename
- `size` - Image size (SMALL, MEDIUM, LARGE, HOME)

---

## Maintenance

### Daily Checks

```bash
# Check service status
docker-compose -f docker-compose.deploy.yml ps

# Check disk usage
docker system df

# View recent logs
docker-compose -f docker-compose.deploy.yml logs --tail=100
```

### Weekly Tasks

```bash
# Backup database
docker-compose -f docker-compose.deploy.yml exec -T postgres pg_dump -U clubdeofertas clubdeofertas > backup_$(date +%Y%m%d).sql

# Clean unused Docker resources
docker system prune -a --volumes
```

### Update Products

```bash
# 1. Update frontend/db/products.json with new products
# 2. Clear old products
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas -c "TRUNCATE \"ProductImage\" CASCADE; TRUNCATE \"Product\" CASCADE; TRUNCATE \"Brand\" CASCADE; TRUNCATE \"Category\" CASCADE;"

# 3. Reimport
node import-products.js > /tmp/import-products.sql
docker-compose -f docker-compose.deploy.yml exec -T postgres psql -U clubdeofertas -d clubdeofertas < /tmp/import-products.sql
```

---

## Performance Optimization

### Monitor Resources

```bash
# Check container resource usage
docker stats

# Check specific container
docker stats clubdeofertas_deploy_backend
```

### Scale Services

```bash
# Scale backend (run multiple instances)
docker-compose -f docker-compose.deploy.yml up -d --scale backend=3
```

---

## Security Recommendations

1. **Change default passwords** in production:
   - Admin user password
   - PostgreSQL password
   - JWT secret

2. **Use environment-specific .env files**:
   - Don't commit `.env.deploy` to version control
   - Use different secrets for production

3. **Enable HTTPS** in production:
   - Use reverse proxy (Nginx, Caddy)
   - Configure SSL certificates

4. **Restrict database access**:
   - Only allow localhost connections
   - Use strong passwords

---

## Support

For issues or questions:

1. Check logs: `docker-compose -f docker-compose.deploy.yml logs -f`
2. Review this manual's troubleshooting section
3. Consult CLAUDE.md for project architecture
4. Check GitHub issues: https://github.com/anthropics/claude-code/issues

---

## Quick Reference

### Essential Commands

```bash
# Start
./setup-deploy.sh

# Stop
docker-compose -f docker-compose.deploy.yml down

# Restart
docker-compose -f docker-compose.deploy.yml restart

# Logs
docker-compose -f docker-compose.deploy.yml logs -f

# Status
docker-compose -f docker-compose.deploy.yml ps

# Database shell
docker-compose -f docker-compose.deploy.yml exec postgres psql -U clubdeofertas -d clubdeofertas

# Rebuild
docker-compose -f docker-compose.deploy.yml build --no-cache && docker-compose -f docker-compose.deploy.yml up -d
```

---

**Last Updated**: 2025-10-27
**Version**: 1.0.0
**Platform**: Experience Club E-commerce
