# Quick Start Guide - Experience Club

Get the entire e-commerce platform running in **5 minutes**.

---

## Prerequisites

✅ Docker installed
✅ Docker Compose installed
✅ Node.js installed

---

## One-Command Setup

```bash
./setup-deploy.sh
```

**That's it!** The script will automatically:
1. Validate prerequisites
2. Build Docker images
3. Start all services
4. Initialize database
5. Create admin user
6. Import 1076 products

---

## Access the Platform

After setup completes (~5-10 minutes):

🛍️ **Customer Store**: http://localhost:3060
🔧 **Admin Panel**: http://localhost:3061
🚀 **Backend API**: http://localhost:3062/api
📊 **Database UI**: http://localhost:5050

---

## Default Login

**Email**: admin@clubdeofertas.com
**Password**: admin123456

---

## Common Commands

```bash
# View logs
docker-compose -f docker-compose.deploy.yml logs -f

# Check status
docker-compose -f docker-compose.deploy.yml ps

# Stop all
docker-compose -f docker-compose.deploy.yml down

# Restart
docker-compose -f docker-compose.deploy.yml restart
```

---

## Database Stats

After import:
- ✅ 1,076 Products
- ✅ 1,075 Product Images
- ✅ 909 Brands
- ✅ 11 Categories

---

## Need Help?

📖 Full documentation: [DOCKER_DEPLOYMENT_MANUAL.md](DOCKER_DEPLOYMENT_MANUAL.md)
📋 Project guide: [CLAUDE.md](CLAUDE.md)

---

**Ready to start?** Run `./setup-deploy.sh`
