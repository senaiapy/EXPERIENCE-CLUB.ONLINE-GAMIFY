# 🚀 Setup Scripts Guide

Quick reference for setting up Experience Club in different environments.

---

## 📋 Available Scripts

### 1. Development Setup
```bash
npm run setup
```
- **File**: `setup.sh`
- **Purpose**: Local development environment
- **Time**: ~5 minutes
- **Data**: Full database (11,361 products)
- **Safety**: Auto-creates missing files

### 2. Production Setup
```bash
npm run setup:prod
```
- **File**: `setup-prod.sh`
- **Purpose**: Production deployment
- **Time**: ~10 minutes
- **Data**: Admin user only
- **Safety**: Validates everything, requires confirmation

---

## 🔧 Development Setup (`npm run setup`)

### What It Does
1. ✅ Checks prerequisites (Docker, npm)
2. ✅ Creates `.env` files if missing
3. ✅ Installs all dependencies
4. ✅ Builds development Docker images
5. ✅ Starts all services (backend, frontend, admin, database)
6. ✅ Runs database migrations
7. ✅ Seeds full database with 11,361 products
8. ✅ Validates all services are running

### After Setup
Your apps will be available at:
- **Frontend**: http://localhost:3060
- **Admin**: http://localhost:3061
- **Backend API**: http://localhost:3062/api
- **Database**: localhost:15432
- **pgAdmin**: http://localhost:5050

### Default Credentials
- Admin: `admin@clubdeofertas.com` / `admin123456`
- pgAdmin: `admin@clubdeofertas.com` / `admin`

---

## 🚀 Production Setup (`npm run setup:prod`)

### Prerequisites
**BEFORE running this script, you MUST:**

1. Create production environment files:
```bash
cp .env.example.prod .env.prod
cp backend/.env.example.prod backend/.env.prod
cp frontend/.env.example.prod frontend/.env.prod
cp admin/.env.example.prod admin/.env.prod
```

2. Edit each `.env.prod` file and update:
   - Database passwords
   - JWT secrets (generate with `openssl rand -base64 32`)
   - Domain names
   - CORS origins

3. Ensure your server has:
   - Docker and Docker Compose installed
   - At least 10GB free disk space
   - Ports 80, 443, 3000, 3001, 3002 available

### What It Does
1. ✅ Confirms you want to deploy to production
2. ✅ Validates all environment files exist
3. ✅ Checks for secure secrets (fails if defaults found)
4. ✅ Checks disk space (minimum 10GB)
5. ✅ Builds production-optimized Docker images
6. ✅ Starts all services with production config
7. ✅ Runs database migrations (safe mode)
8. ✅ Seeds admin user only
9. ✅ Validates all services with extended health checks
10. ✅ Provides next steps for Nginx and SSL

### After Setup
Your services will be running on **INTERNAL** ports:
- Backend: port 3002 (needs Nginx proxy)
- Frontend: port 3000 (needs Nginx proxy)
- Admin: port 3001 (needs Nginx proxy)

### Required Next Steps
1. **Configure Nginx** (see PRODUCTION_DEPLOYMENT.md)
2. **Install SSL certificates** with Let's Encrypt
3. **Configure firewall** (UFW)
4. **Setup database backups**
5. **Change admin password**

---

## 🔐 Security Notes

### Development
- ⚠️ Uses default passwords (OK for local dev)
- ⚠️ Exposes services on localhost
- ⚠️ Full database with sample data
- ✅ Isolated Docker network

### Production
- ✅ Requires strong passwords
- ✅ Validates all secrets
- ✅ Internal ports only (requires Nginx)
- ✅ Production-optimized builds
- ✅ Minimal data (admin only)
- ✅ Health checks and monitoring

---

## 📊 Comparison

| Feature | Development | Production |
|---------|-------------|------------|
| Command | `npm run setup` | `npm run setup:prod` |
| Confirmation | No | Yes |
| Time | ~5 min | ~10 min |
| Products | 11,361 | 0 (admin only) |
| Port exposure | Localhost | Internal (Nginx needed) |
| Secret validation | No | Yes |
| Build optimization | Dev mode | Production mode |

---

## 🛠️ Troubleshooting

### Development Setup Fails

**Issue**: Docker daemon not running
```bash
# Start Docker Desktop (Mac/Windows)
# Or start Docker service (Linux)
sudo systemctl start docker
```

**Issue**: Port already in use
```bash
# Stop existing containers
npm run dev:stop

# Check what's using the port
lsof -i :3060
lsof -i :3061
lsof -i :3062
```

**Issue**: Database won't connect
```bash
# Check database logs
docker-compose -f docker-compose.dev.yml logs postgres

# Restart database
docker-compose -f docker-compose.dev.yml restart postgres
```

### Production Setup Fails

**Issue**: Environment files not found
```bash
# Make sure all .env.prod files exist
ls -la .env.prod
ls -la backend/.env.prod
ls -la frontend/.env.prod
ls -la admin/.env.prod
```

**Issue**: Default secrets detected
```bash
# Generate new secrets
openssl rand -base64 32

# Update .env.prod with generated secrets
nano .env.prod
```

**Issue**: Services won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check disk space
df -h

# Check memory
free -m
```

---

## 📚 Additional Resources

- **PRODUCTION_DEPLOYMENT.md** - Complete production guide
- **QUICK_DEPLOY.md** - Quick deployment reference
- **SETUP_SCRIPTS_COMPARISON.md** - Detailed script comparison
- **CLAUDE.md** - Development guidelines

---

## 🆘 Getting Help

### Check Service Status
```bash
# Development
docker-compose -f docker-compose.dev.yml ps

# Production
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
# Development
npm run dev:logs

# Production
docker-compose -f docker-compose.prod.yml logs -f
```

### Reset Environment
```bash
# Development - safe to run
npm run reset

# Production - DON'T run without backup!
# This will delete your production data!
```

---

**Quick Start Commands:**

```bash
# Development (first time)
git clone <repo>
cd clubdeofertas.online-FULL
npm run setup

# Production (first time)
git clone <repo>
cd clubdeofertas.online-FULL
# Configure .env.prod files first!
npm run setup:prod
```
