# Quick Deploy Reference

## 🧪 Test Locally First (Recommended!)

### Local Production Testing (192.168.0.9)
Test production builds on your local network before deploying:

```bash
npm run prod:local:setup
# or
./setup-prod-local.sh
```

**Benefits:**
✅ Test production builds locally
✅ Access from any device on your WiFi
✅ Same environment as production
✅ No remote server needed

**Access URLs:**
- Frontend: http://192.168.0.9:3060 or http://localhost:3060
- Admin: http://192.168.0.9:3061 or http://localhost:3061
- API: http://192.168.0.9:3062/api or http://localhost:3062/api

### Local Production Commands
```bash
npm run prod:local:setup    # Full setup (first time)
npm run prod:local:start    # Start services
npm run prod:local:stop     # Stop services
npm run prod:local:logs     # View logs
npm run prod:local:ps       # Check status
npm run prod:local:restart  # Restart services
npm run prod:local:build    # Rebuild containers
```

---

## 🚀 Deploy to Production (217.79.189.223)

### Method 1: Automated (Recommended)
```bash
npm run prod:deploy
# or
./deploy-to-server.sh
```

### Method 2: Manual Guided
```bash
npm run prod:deploy:manual
# or
./deploy-manual.sh
```

### Method 3: On Server Directly
```bash
# SSH to server first
ssh root@217.79.189.223

# Then run
cd /opt/clubdeofertas
./setup-prod.sh
```

## 📋 Quick Commands

### Deploy & Setup
```bash
npm run prod:setup          # Run setup on current machine
npm run prod:deploy         # Deploy to remote server
npm run prod:deploy:manual  # Manual deployment guide
```

### Production Management
```bash
npm run prod:start          # Start all services
npm run prod:stop           # Stop all services
npm run prod:restart        # Restart all services
npm run prod:logs           # View logs
npm run prod:ps             # Check status
```

### Development (Local)
```bash
npm run dev:start           # Start dev environment
npm run dev:stop            # Stop dev environment
npm run dev:logs            # View dev logs
npm run dev:ps              # Check dev status
```

## 🌐 Production URLs

After deployment, access at:
- Frontend: http://217.79.189.223:3060
- Admin: http://217.79.189.223:3061
- API: http://217.79.189.223:3062/api
- Docs: http://217.79.189.223:3062/api/docs
- pgAdmin: http://217.79.189.223:5050

## 🔐 Default Credentials

**Admin:**
- Email: admin@clubdeofertas.com
- Password: admin123456

**pgAdmin:**
- Email: admin@clubdeofertas.com
- Password: adminMa1x1x0x!!

⚠️ **Change passwords after first login!**

## 🛠️ On-Server Commands

```bash
# SSH to server
ssh root@217.79.189.223

# Navigate to project
cd /opt/clubdeofertas

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart service
docker-compose -f docker-compose.prod.yml restart backend

# Stop all
docker-compose -f docker-compose.prod.yml down

# Start all
docker-compose -f docker-compose.prod.yml up -d

# Rebuild
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f admin
```

## 🔥 Troubleshooting

### Services not starting?
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Check what's using a port
```bash
lsof -i :3062
```

### Database issues?
```bash
docker exec clubdeofertas_prod_postgres pg_isready -U clubdeofertas
docker-compose -f docker-compose.prod.yml logs postgres
```

### Out of space?
```bash
docker system prune -a
```

## 📚 Full Documentation

- Complete guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Setup summary: [PRODUCTION-SETUP-SUMMARY.md](PRODUCTION-SETUP-SUMMARY.md)
- Project docs: [CLAUDE.md](CLAUDE.md)

---

**Server IP**: 217.79.189.223
**SSH Password**: @450ab6606
