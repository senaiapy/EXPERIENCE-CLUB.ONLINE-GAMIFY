# 🔧 Setup Scripts Comparison
## Development vs Production Setup

---

## 📋 Overview

This document compares the two setup scripts for Experience Club:
- **`setup.sh`** - For development environment
- **`setup-prod.sh`** - For production deployment

---

## 🎯 Quick Reference

| Feature | `setup.sh` (Dev) | `setup-prod.sh` (Prod) |
|---------|------------------|------------------------|
| **Command** | `npm run setup` | `npm run setup:prod` |
| **Docker Compose** | `docker-compose.dev.yml` | `docker-compose.prod.yml` |
| **Environment** | `.env`, `.env.dev` | `.env.prod` |
| **Build Type** | Development | Production (optimized) |
| **Confirmation** | No | Yes (safety prompt) |
| **Wait Times** | 15-30 seconds | 60-90 seconds |
| **Validation** | Basic | Comprehensive |
| **Security Checks** | None | Secret validation |

---

## 📊 Detailed Comparison

### 1. Environment Files

#### Development (`setup.sh`)
```bash
# Uses or creates:
- .env (created from .env.example if missing)
- .env.dev (auto-created with DEBUG=true)
- backend/.env (uses existing or defaults)
- frontend/.env (uses existing)
- admin/.env (uses existing)
```

#### Production (`setup-prod.sh`)
```bash
# Requires all files to exist:
- .env.prod (MUST exist)
- backend/.env.prod (MUST exist)
- frontend/.env.prod (MUST exist)
- admin/.env.prod (MUST exist)

# Validates security:
- Checks for default secrets
- Ensures passwords are changed
- Fails if insecure configuration detected
```

---

### 2. Docker Configuration

#### Development
```bash
# Docker Compose file
docker-compose.dev.yml

# Build target
development (includes dev dependencies)

# Restart policy
unless-stopped

# Volumes
- Full source code mounted
- Hot reload enabled
- Node modules isolated

# Services
- postgres (port 15432)
- backend (port 3062)
- frontend (port 3060)
- admin (port 3061)
- pgadmin (port 5050)
```

#### Production
```bash
# Docker Compose file
docker-compose.prod.yml

# Build target
production (optimized builds)

# Restart policy
always

# Volumes
- Only uploads and logs mounted
- No source code mounting
- Optimized for performance

# Services
- postgres (internal 5432)
- backend (internal 3002)
- frontend (internal 3000)
- admin (internal 3001)
```

---

### 3. Safety and Validation

#### Development (`setup.sh`)
- ✅ Checks Docker/npm installation
- ✅ Basic dependency validation
- ✅ Service health checks
- ❌ No confirmation prompt
- ❌ No security validation
- ❌ No secret checking

#### Production (`setup-prod.sh`)
- ✅ Checks Docker/npm installation
- ✅ Disk space validation (10GB minimum)
- ✅ Comprehensive service health checks
- ✅ **Confirmation prompt** ("yes" required)
- ✅ **Security validation** (checks for default secrets)
- ✅ **Environment file validation** (all must exist)
- ✅ **Extended wait times** for production builds

---

### 4. Database Setup

#### Development
```bash
# Schema management
1. Prisma generate
2. prisma db push --accept-data-loss (quick)
3. prisma migrate deploy
4. Full database seed (11,361 products)

# Approach: Fast setup with sample data
```

#### Production
```bash
# Schema management
1. Prisma generate
2. prisma migrate deploy ONLY (safe)
3. Admin user seed only

# Approach: Safe migrations, minimal data
# Note: NO "db push" to prevent data loss
```

---

### 5. Service Validation

#### Development
```bash
# Wait times
- Initial: 15 seconds
- Per service: 30 attempts × 2 seconds = 60s max

# Tests
- Basic port checks
- API endpoint availability
- Authentication test (optional)

# Failure handling
- Warnings only
- Continues even if some checks fail
```

#### Production
```bash
# Wait times
- Initial: 60 seconds
- Per service: 60 attempts × 3 seconds = 180s max

# Tests
- Extended health checks
- API health endpoint validation
- Authentication system test
- Database connectivity

# Failure handling
- HARD STOPS on critical failures
- Provides diagnostic commands
- Requires manual intervention
```

---

### 6. Output Information

#### Development
```bash
# Shows:
- Local development URLs
- Default admin credentials
- Development commands
- Database stats
- Service status

# Emphasis: Quick start, developer-friendly
```

#### Production
```bash
# Shows:
- Internal port mapping
- Nginx configuration needed
- SSL setup instructions
- Firewall configuration
- Security checklist
- Backup setup reminder

# Emphasis: Security, configuration, next steps
```

---

## 🚀 Usage Examples

### Development Setup

```bash
# First time setup
git clone <repo>
cd clubdeofertas.online-FULL
npm run setup

# What it does:
✓ Creates .env files automatically
✓ Installs dependencies
✓ Builds development Docker images
✓ Starts all services
✓ Runs migrations
✓ Seeds full database (11K+ products)
✓ Ready to code in ~5 minutes

# After setup:
- Frontend: http://localhost:3060
- Admin: http://localhost:3061
- API: http://localhost:3062/api
```

### Production Deployment

```bash
# On production server
git clone <repo>
cd clubdeofertas.online-FULL

# FIRST: Configure environment
cp .env.example.prod .env.prod
nano .env.prod  # Edit all secrets!
cp backend/.env.example.prod backend/.env.prod
nano backend/.env.prod
# ... (repeat for frontend and admin)

# THEN: Run production setup
npm run setup:prod

# Prompts:
⚠️  WARNING: You are about to deploy to PRODUCTION!
Are you sure you want to continue? (yes/no): yes

# What it does:
✓ Validates all environment files exist
✓ Checks for secure secrets
✓ Builds production-optimized images
✓ Starts services with health checks
✓ Runs migrations safely
✓ Seeds admin user only
✓ Provides next steps (Nginx, SSL)

# After setup:
- Configure Nginx reverse proxy
- Install SSL certificates
- Setup firewall
- Configure backups
```

---

## ⚠️ Key Differences Summary

### Development Script
- **Purpose**: Quick local development setup
- **Safety**: Permissive (overwrites data)
- **Speed**: Fast (15 seconds wait)
- **Data**: Full product catalog
- **Validation**: Basic
- **Confirmation**: None

### Production Script
- **Purpose**: Safe production deployment
- **Safety**: Strict (validates everything)
- **Speed**: Careful (60 seconds wait)
- **Data**: Admin user only
- **Validation**: Comprehensive
- **Confirmation**: Required ("yes" to proceed)

---

## 🔒 Security Comparison

| Security Feature | Development | Production |
|-----------------|-------------|------------|
| Default secrets allowed | ✅ Yes | ❌ No |
| Confirmation required | ❌ No | ✅ Yes |
| Environment validation | Basic | Strict |
| Secret checking | None | Required |
| Disk space check | No | Yes (10GB) |
| Extended health checks | No | Yes |
| Hard failure on errors | No | Yes |

---

## 📝 When to Use Each Script

### Use `setup.sh` (Development) When:
- ✅ Setting up local development environment
- ✅ Creating a new development workspace
- ✅ Resetting development database
- ✅ Testing new features locally
- ✅ Quick prototyping
- ✅ Learning the codebase

### Use `setup-prod.sh` (Production) When:
- ✅ Deploying to production server
- ✅ Setting up staging environment
- ✅ Deploying to client servers
- ✅ Creating production-like testing
- ✅ Deploying to VPS/Cloud
- ✅ Public-facing deployment

---

## 🛠️ Customization

### Extending Development Script
```bash
# Add custom development tools
# Before: Standard setup
# After: Add your steps
echo "Installing custom dev tools..."
npm install -g nodemon
```

### Extending Production Script
```bash
# Add production monitoring
# Before: Standard deployment
# After: Add monitoring setup
echo "Setting up monitoring..."
# Install DataDog, Sentry, etc.
```

---

## 📚 Related Documentation

- **PRODUCTION_DEPLOYMENT.md** - Complete production deployment guide
- **QUICK_DEPLOY.md** - Quick production deployment reference
- **CLAUDE.md** - Development guidelines
- **.env.example.prod** - Production environment template

---

## 🎯 Best Practices

### Development
1. Run `npm run setup` for first-time local setup
2. Use `npm run dev:start` for daily work
3. Use `npm run reset` to reset development database
4. Don't worry about breaking things - it's local!

### Production
1. **ALWAYS** review `.env.prod` before running
2. **NEVER** skip the confirmation prompt
3. **ALWAYS** backup before running migrations
4. **TEST** on staging before production
5. **VERIFY** all URLs and certificates after deployment
6. **MONITOR** logs during and after deployment

---

**Last Updated**: October 2025
**Version**: 1.0.3
