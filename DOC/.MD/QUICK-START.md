# 🚀 Quick Start Guide

## One-Command Deployment

For a complete reset and fresh deployment:

```bash
# Test first (safe, no changes)
./test-deploy-reset.sh

# Full reset and deploy
./deploy-reset.sh
```

## What You Get

After running `./deploy-reset.sh`:

- ✅ **Backend API**: http://localhost:3062/api
- ✅ **Frontend Store**: http://localhost:3060  
- ✅ **Admin Panel**: http://localhost:3061
- ✅ **Database**: PostgreSQL on port 15432
- ✅ **49 Products** with images migrated
- ✅ **Admin User**: admin@clubdeofertas.com / admin123456

## Alternative Commands

```bash
# Individual services
npm run dev:backend   # Backend only
npm run dev:frontend  # Frontend only  
npm run dev:admin     # Admin only

# Docker commands
docker-compose up -d  # Start all services
docker-compose down   # Stop all services
docker-compose ps     # Check status
docker-compose logs -f # View logs
```

## Files Created

- `deploy-reset.sh` - Main deployment script
- `test-deploy-reset.sh` - Safe testing script  
- `DEPLOY-RESET-GUIDE.md` - Complete documentation
- `QUICK-START.md` - This file

---

⚡ **TL;DR**: Run `./deploy-reset.sh` for instant full setup!