# Experience Club - Full Stack E-commerce Platform

## Project Overview

Experience Club is a comprehensive e-commerce platform representing a complete migration from a legacy PHP system to a modern TypeScript stack. The project consists of a monorepo architecture with:

- **Backend**: NestJS API with PostgreSQL database and Prisma ORM
- **Frontend Store**: Next.js application for customers
- **Admin Panel**: Next.js application for managing products, orders, and users
- **Legacy System Migration**: Tools to import existing PHP data and images

## Architecture

### Backend (NestJS)
- RESTful API with JWT authentication
- PostgreSQL database with Prisma ORM
- File management for product images with multiple sizes
- Core features: Products, Brands, Categories, Users, Orders

### Frontend Applications
- **Customer Store**: Next.js application (port 3000) - Main customer-facing e-commerce site
- **Admin Panel**: Next.js application (port 3001) - Administrative interface for managing the store

### Legacy System
- Original PHP e-commerce application
- Static product images in multiple sizes (home, large, medium, small)

## Building and Running

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional but recommended)

### Development Setup (Docker - Recommended)

```bash
# Start all services with Docker
docker-compose up --build

# Access applications:
# - Backend API: http://localhost:3002/api
# - Admin Panel: http://localhost:3001
# - Frontend Store: http://localhost:3000
# - PostgreSQL: localhost:5432
```

### Local Development

```bash
# Install dependencies
npm install

# Start PostgreSQL locally
# Update DATABASE_URL in typescript/backend/.env

# Backend setup
cd typescript/backend
npm install
npx prisma migrate dev --name initial-setup
npx prisma generate

# Run image migration (imports from PHP)
npm run migrate:images

# Start backend
npm run start:dev

# Admin panel (new terminal)
cd typescript/admin
npm install
npm run dev

# Frontend store (new terminal)
cd typescript/frontend
npm install
npm run dev
```

## Development Commands

### Backend (NestJS)
```bash
cd typescript/backend

# Database
npx prisma migrate dev          # Run migrations
npx prisma generate            # Generate Prisma client
npx prisma studio             # Database GUI
npm run migrate:images        # Import PHP images

# Development
npm run start:dev             # Start with hot reload
npm run build                 # Build for production
npm run start:prod            # Run production build
```

### Frontend Applications
```bash
# Admin Panel
cd typescript/admin
npm run dev                   # Development server
npm run build                 # Build for production

# Customer Store
cd typescript/frontend
npm run dev                   # Development server
npm run build                 # Build for production
```

### Root Monorepo Commands
```bash
# Build all applications
npm run build

# Run all services in development
npm run dev

# Run tests
npm run test
npm run test:frontend
npm run test:admin
npm run test:all

# Docker operations
npm run docker:up             # Start containers (detached)
npm run docker:down           # Stop all containers
npm run docker:logs           # View all logs
npm run docker:build          # Build containers

# Database operations in Docker
npm run docker:migrate:dev    # Apply dev migrations
npm run docker:migrate:reset  # Reset DB in Docker
npm run docker:generate       # Generate client in Docker
npm run docker:seed           # Seed database in Docker
npm run docker:migrate:images # Migrate images in Docker

# Seeding and setup
npm run seed                  # Seed database with admin user
npm run populate:with-images  # Migrate images and populate DB
npm run setup                 # Complete automated setup
```

## Database Schema

### Core Models
- **User**: Authentication and user management
- **Product**: Product catalog with pricing and inventory
- **ProductImage**: Multiple image sizes per product
- **Brand**: Product brands and manufacturers
- **Category**: Product categorization
- **Order & OrderItem**: Order management

### Image Management
The system supports four image sizes per product:
- HOME: Homepage thumbnails
- SMALL: List view thumbnails
- MEDIUM: Product detail images
- LARGE: High-resolution images

## Authentication

### Default Admin User
After running the migration script:
- Email: admin@clubdeofertas.com
- Password: admin123456

### API Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

## API Documentation

### Products API
- GET /api/products - List products (with pagination, filtering)
- GET /api/products/:id - Get product by ID
- GET /api/products/slug/:slug - Get product by slug
- POST /api/products - Create product (admin)
- PATCH /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)
- POST /api/products/:id/images/:size - Upload product image (admin)

### Brands API
- GET /api/brands - List all brands
- GET /api/brands/:id - Get brand details
- POST /api/brands - Create brand (admin)
- PATCH /api/brands/:id - Update brand (admin)
- DELETE /api/brands/:id - Delete brand (admin)

## Environment Variables

### Root `.env`
```env
POSTGRES_USER=clubdeofertas
POSTGRES_PASSWORD=clubdeofertas123
POSTGRES_DB=clubdeofertas
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

### Backend `.env`
```env
DATABASE_URL="postgresql://clubdeofertas:clubdeofertas123@localhost:5432/clubdeofertas?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRATION="24h"
PORT=3002
NODE_ENV="development"
```

## Key Features

### Backend
- ✅ JWT Authentication & Authorization
- ✅ Product Management with Images
- ✅ File Upload & Storage
- ✅ Database Relationships
- ✅ API Validation & Error Handling
- ✅ CORS Configuration
- ✅ Static File Serving

### Admin Panel
- ✅ Product Listing with Images
- ✅ Responsive Design
- ✅ API Integration
- ✅ Error Handling

### Migration System
- ✅ Automated Image Import
- ✅ Data Seeding
- ✅ File Management
- ✅ Database Population

## Docker Configuration

The project includes multiple Docker Compose files:
- `docker-compose.yml` - Main orchestration for development
- `docker-compose.prod.yml` - Production deployment
- `docker-compose.swarm.yml` - Docker Swarm deployment with Traefik reverse proxy
- `docker-compose.db.yml` - Database-only services
- `docker-compose.dev.yml` - Development services
- `docker-compose.pgadmin.yml` - PGAdmin service

Services include:
- PostgreSQL database with persistent volumes
- Backend API (NestJS)
- Frontend Store (Next.js)
- Admin Panel (Next.js)
- PGAdmin for database management

### Docker Swarm Configuration

The `docker-compose.swarm.yml` file is specifically designed for Docker Swarm deployments with Traefik reverse proxy. Key features include:

- **Traefik Reverse Proxy**: Handles SSL termination and routing to appropriate services
- **Service Domains**:
  - Frontend Store: `clubdeofertas.online`
  - Admin Panel: `admin.clubdeofertas.online`
  - Backend API: `api.clubdeofertas.online`
  - PGAdmin: `pgadmin.clubdeofertas.online`
- **Swarm-Specific Configuration**: Uses overlay networks and placement constraints for multi-node deployments
- **Scalability**: Services configured with multiple replicas for high availability
- **Security**: Includes Let's Encrypt certificate management for SSL

Note: Traefik labels are commented out in the file and can be enabled based on deployment requirements.

### Environment Variables

The project uses environment variables across different services:

#### Backend `.env` Configuration
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://clubdeofertas:Ma1x1x0x!!@localhost:5432/clubdeofertas?schema=public`)
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: Token expiration time (e.g., `24h`)
- `PORT`: Backend port (default `3002`)
- `NODE_ENV`: Environment mode (`development` or `production`)

#### PGAdmin Configuration
The project includes a pre-configured server connection for PGAdmin. When using PGAdmin to view your database:

1. The `pgadmin-servers.json` file contains a pre-configured server connection for the Experience Club database
2. Server details:
   - Name: "Experience Club DB"
   - Group: Servers
   - Host: postgres (for internal container communication) or the service name in the docker network
   - Port: 5432
   - MaintenanceDB: clubdeofertas
   - Username: clubdeofertas
   - PassFile: /tmp/pgpass (password is managed via environment variables)
3. To access PGAdmin:
   - For Docker Compose setup: http://localhost:5050
   - Login with credentials set in the .env file (PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD)
4. Once logged in, to view the products table:
   - In the left panel, expand the "Servers" group
   - Connect to "Experience Club DB"
   - Expand the connection, then "Databases", then "clubdeofertas" (or your database name)
   - Expand "Schemas", then "Tables"
   - Look for the "Product" table (might be named "products" depending on Prisma configuration)
   - Right-click on the table name and select "View Data" → "All Rows" to see the products data
5. You can also use the Query Tool (top toolbar icon) to execute custom SQL queries like:
   ```sql
   SELECT * FROM "Product" LIMIT 100;
   ```
   or
   ```sql
   SELECT COUNT(*) FROM "Product";
   ```

## Development Conventions

1. TypeScript is used throughout the project
2. Prisma ORM for database operations
3. React Context is avoided in favor of Zustand for state management in Next.js applications
4. JWT for authentication
5. Docker for containerization and deployment

## Testing

The project supports various testing approaches:
- Unit tests with Jest
- E2E tests
- Database schema validation
- API endpoint testing

## Deployment

For production deployment:
1. Update environment variables
2. Use production Docker images
3. Set up PostgreSQL database
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure backup strategies