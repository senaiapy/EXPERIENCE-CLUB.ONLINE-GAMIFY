# Complete Docker Deployment Guide - Experience Club

## Overview

This guide covers deploying the Experience Club e-commerce platform to production server `217.79.189.223` with domains proxied through your web server.

**Architecture:**
- PostgreSQL: `localhost:15432` (external) / `postgres:5432` (internal)
- Backend API: Port `3062` → `https://api.clubdeofertas.online/api`
- Frontend Store: Port `3060` → `https://clubdeofertas.online`
- Admin Panel: Port `3061` → `https://admin.clubdeofertas.online`

---

## Prerequisites

### On Remote Server (217.79.189.223)

1. **Docker and Docker Compose installed**
2. **Reverse proxy configured** (Nginx/Apache/Caddy) to forward:
   - `clubdeofertas.online` → `localhost:3060`
   - `admin.clubdeofertas.online` → `localhost:3061`
   - `api.clubdeofertas.online` → `localhost:3062`
3. **SSL certificates** configured for HTTPS domains
4. **Firewall rules** allowing ports 3060, 3061, 3062, 15432

---

## Key Architectural Changes

### 1. Docker Network Communication

**CRITICAL:** Services inside Docker communicate using **service names**, not `localhost`:

```yaml
# ✅ CORRECT - Backend connects to database
DATABASE_URL=postgresql://user:pass@postgres:5432/database

# ❌ WRONG - This won't work inside Docker
DATABASE_URL=postgresql://user:pass@localhost:15432/database
```

**Network Topology:**
```
┌─────────────────────────────────────────────────────┐
│  Docker Network: clubdeofertas_deploy_network       │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│  │ postgres │◄───┤ backend  │◄───┤ frontend │     │
│  │  :5432   │    │  :3062   │    │  :3060   │     │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘     │
│       │               │               │             │
└───────┼───────────────┼───────────────┼─────────────┘
        │               │               │
    Host:15432     Host:3062      Host:3060
        │               │               │
        └───────────────┴───────────────┘
                        │
                  Reverse Proxy
                        │
        ┌───────────────┴───────────────┐
        │                               │
   Port 443 HTTPS                  Port 80 HTTP
   (SSL Termination)                (Redirect)
        │                               │
        └───────────────┬───────────────┘
                        │
                Domain Routing:
        clubdeofertas.online → :3060
        admin.clubdeofertas.online → :3061
        api.clubdeofertas.online → :3062
```

### 2. Environment Configuration Strategy

**Two-tier environment system:**

1. **Root `.env.deploy`** - Shared variables (DATABASE_URL, JWT secrets, ports)
2. **Service-specific `.env.deploy`** - Service overrides (backend/.env.deploy, frontend/.env.deploy, admin/.env.deploy)

**Environment Variable Priority:**
1. `docker-compose.yml` `environment:` section (highest)
2. Service-specific `.env.deploy` file
3. Root `.env.deploy` file (lowest)

### 3. URL Configuration Pattern

**Frontend/Admin (Browser-side):**
```bash
# These URLs are used by the browser (public-facing)
NEXT_PUBLIC_API_URL=https://api.clubdeofertas.online/api
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.clubdeofertas.online
```

**Backend (Server-side):**
```bash
# Backend uses Docker service name for internal calls
DATABASE_URL=postgresql://clubdeofertas:password@postgres:5432/clubdeofertas

# CORS must allow proxy domains
CORS_ORIGINS=https://clubdeofertas.online,https://admin.clubdeofertas.online,https://api.clubdeofertas.online
```

---

## Deployment Files Overview

### Created/Modified Files

1. **`.env.deploy`** - Root production environment variables
2. **`backend/.env.deploy`** - Backend production config
3. **`frontend/.env.deploy`** - Frontend production config
4. **`admin/.env.deploy`** - Admin production config
5. **`docker-compose.deploy.yml`** - Production Docker Compose (already exists, enhanced)
6. **`frontend/next.config.js`** - Added `output: 'standalone'`
7. **`admin/next.config.js`** - Added `output: 'standalone'`
8. **All Dockerfiles** - Added wget for healthchecks, updated for standalone builds

---

## Step-by-Step Deployment

### Step 1: Copy Files to Remote Server

From your local machine:

```bash
# Option A: Using rsync (recommended)
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'dist' \
  --exclude 'postgres_data' \
  /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133755/PROJECTS/CLUBDEOFERTAS.COM.PY/ \
  root@217.79.189.223:/root/CLUBDEOFERTAS.COM.PY/

# Option B: Using scp (alternative)
scp -r /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133755/PROJECTS/CLUBDEOFERTAS.COM.PY \
  root@217.79.189.223:/root/
```

### Step 2: SSH into Remote Server

```bash
ssh root@217.79.189.223
# Password: @ server

cd /root/CLUBDEOFERTAS.COM.PY
```

### Step 3: Verify Environment Files

```bash
# Check all .env.deploy files exist
ls -la .env.deploy backend/.env.deploy frontend/.env.deploy admin/.env.deploy

# Verify content (check DATABASE_URL uses 'postgres' not 'localhost')
grep DATABASE_URL backend/.env.deploy
# Should show: DATABASE_URL=postgresql://clubdeofertas:Ma1x1x0x!!Ma1x1x0x!!@postgres:5432/clubdeofertas?schema=public
```

### Step 4: Run Deployment Script

```bash
# Make script executable
chmod +x setup-deploy.sh

# Run deployment
./setup-deploy.sh
```

**Expected Output:**
```
🚀 Experience Club - Deployment Setup
======================================
[STEP 1.1] Checking Docker installation...
[SUCCESS] Docker is installed
[STEP 3.2] Building Docker containers for deployment...
[STEP 4.1] Checking database health...
[SUCCESS] Database is healthy and ready!
[STEP 5.1] Waiting for backend API to be ready...
[SUCCESS] Backend API is ready!
...
🎉 Experience Club platform deployed successfully!
```

### Step 5: Verify Services

```bash
# Check all containers are running
docker-compose -f docker-compose.deploy.yml ps

# Should show:
# clubdeofertas_deploy_postgres   - Up (healthy)
# clubdeofertas_deploy_backend    - Up (healthy)
# clubdeofertas_deploy_frontend   - Up (healthy)
# clubdeofertas_deploy_admin      - Up (healthy)

# Test backend API
curl http://localhost:3062/api/products?page=1&limit=5

# Test frontend
curl http://localhost:3060

# Test admin
curl http://localhost:3061
```

### Step 6: Configure Reverse Proxy

**Example Nginx Configuration** (`/etc/nginx/sites-available/clubdeofertas.online`):

```nginx
# Backend API
server {
    listen 80;
    listen 443 ssl http2;
    server_name api.clubdeofertas.online;

    ssl_certificate /etc/letsencrypt/live/api.clubdeofertas.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.clubdeofertas.online/privkey.pem;

    location / {
        proxy_pass http://localhost:3062;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static file serving for uploads
    location /uploads/ {
        proxy_pass http://localhost:3062/uploads/;
        proxy_cache_valid 200 1d;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header Cache-Control "public, max-age=86400";
    }
}

# Frontend Store
server {
    listen 80;
    listen 443 ssl http2;
    server_name clubdeofertas.online www.clubdeofertas.online;

    ssl_certificate /etc/letsencrypt/live/clubdeofertas.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/clubdeofertas.online/privkey.pem;

    location / {
        proxy_pass http://localhost:3060;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel
server {
    listen 80;
    listen 443 ssl http2;
    server_name admin.clubdeofertas.online;

    ssl_certificate /etc/letsencrypt/live/admin.clubdeofertas.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.clubdeofertas.online/privkey.pem;

    location / {
        proxy_pass http://localhost:3061;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable and restart Nginx:**

```bash
sudo ln -s /etc/nginx/sites-available/clubdeofertas.online /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### Step 7: Test Production URLs

```bash
# From your local machine or remote server:

# Test backend API
curl https://api.clubdeofertas.online/api/products?page=1&limit=5

# Test frontend (should return HTML)
curl https://clubdeofertas.online

# Test admin (should return HTML)
curl https://admin.clubdeofertas.online
```

---

## Troubleshooting

### Issue: "Backend can't connect to database"

**Symptoms:**
```
Error: P1001: Can't reach database server at `localhost:15432`
```

**Solution:**
```bash
# Check backend/.env.deploy uses Docker service name
grep DATABASE_URL backend/.env.deploy

# Should be:
DATABASE_URL=postgresql://clubdeofertas:Ma1x1x0x!!Ma1x1x0x!!@postgres:5432/clubdeofertas?schema=public

# NOT:
DATABASE_URL=postgresql://clubdeofertas:Ma1x1x0x!!Ma1x1x0x!!@localhost:15432/clubdeofertas?schema=public

# Fix and rebuild:
docker-compose -f docker-compose.deploy.yml down
docker-compose -f docker-compose.deploy.yml up -d --build backend
```

### Issue: "Frontend/Admin shows connection errors"

**Symptoms:**
- Browser console: `Failed to fetch https://api.clubdeofertas.online/api/products`
- Network errors, CORS errors

**Solution:**

1. **Check backend CORS configuration:**
```bash
docker-compose -f docker-compose.deploy.yml logs backend | grep CORS
```

2. **Verify CORS_ORIGINS in .env.deploy:**
```bash
grep CORS_ORIGINS .env.deploy

# Should include all proxy domains:
CORS_ORIGINS=https://clubdeofertas.online,https://admin.clubdeofertas.online,https://api.clubdeofertas.online
```

3. **Check reverse proxy is forwarding correctly:**
```bash
# Test backend through proxy
curl -v https://api.clubdeofertas.online/api/products

# Check for correct headers
curl -I https://api.clubdeofertas.online/api/products
```

### Issue: "502 Bad Gateway from Nginx"

**Symptoms:**
- Nginx returns 502 error
- `docker ps` shows containers as "unhealthy"

**Solution:**

1. **Check container health:**
```bash
docker-compose -f docker-compose.deploy.yml ps

# If unhealthy, check logs:
docker-compose -f docker-compose.deploy.yml logs backend
docker-compose -f docker-compose.deploy.yml logs frontend
```

2. **Common causes:**
   - Application crashed during startup
   - Port already in use
   - Database connection failed

3. **Restart specific service:**
```bash
docker-compose -f docker-compose.deploy.yml restart backend
docker-compose -f docker-compose.deploy.yml logs -f backend
```

### Issue: "Images not loading"

**Symptoms:**
- Products display but images show broken
- Browser console: 404 errors for image URLs

**Solution:**

1. **Check image base URL:**
```bash
grep NEXT_PUBLIC_IMAGE_BASE_URL frontend/.env.deploy

# Should be:
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.clubdeofertas.online
```

2. **Verify uploads volume:**
```bash
docker-compose -f docker-compose.deploy.yml exec backend ls -la /app/uploads
```

3. **Check Nginx proxy for /uploads path:**
```nginx
# Add to api.clubdeofertas.online server block:
location /uploads/ {
    proxy_pass http://localhost:3062/uploads/;
}
```

### Issue: "Database migrations fail"

**Symptoms:**
```
Error: Migration `20231115123456_init` failed
```

**Solution:**

```bash
# Drop into backend container
docker-compose -f docker-compose.deploy.yml exec backend sh

# Check database connection
npx prisma db pull

# Reset migrations (⚠️ DESTRUCTIVE - only if needed)
npx prisma migrate reset --force

# Or apply migrations manually
npx prisma migrate deploy

# Exit container
exit
```

---

## Maintenance Commands

### View Logs

```bash
# All services
docker-compose -f docker-compose.deploy.yml logs -f

# Specific service
docker-compose -f docker-compose.deploy.yml logs -f backend
docker-compose -f docker-compose.deploy.yml logs -f frontend

# Last 100 lines
docker-compose -f docker-compose.deploy.yml logs --tail=100 backend
```

### Restart Services

```bash
# Restart all
docker-compose -f docker-compose.deploy.yml restart

# Restart specific service
docker-compose -f docker-compose.deploy.yml restart backend
docker-compose -f docker-compose.deploy.yml restart frontend
```

### Rebuild and Redeploy

```bash
# Stop all services
docker-compose -f docker-compose.deploy.yml down

# Rebuild specific service
docker-compose -f docker-compose.deploy.yml build --no-cache backend

# Start all services
docker-compose -f docker-compose.deploy.yml up -d
```

### Database Backup

```bash
# Create backup
docker-compose -f docker-compose.deploy.yml exec postgres pg_dump \
  -U clubdeofertas clubdeofertas > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.deploy.yml exec -T postgres psql \
  -U clubdeofertas clubdeofertas < backup_20231115_123456.sql
```

### Update Application Code

```bash
# On local machine: push changes to git
git push origin main

# On remote server: pull changes
cd /root/CLUBDEOFERTAS.COM.PY
git pull origin main

# Rebuild affected services
docker-compose -f docker-compose.deploy.yml build --no-cache backend frontend admin
docker-compose -f docker-compose.deploy.yml up -d
```

---

## Security Checklist

- [ ] **Firewall configured** to only allow necessary ports
- [ ] **SSL certificates** installed and auto-renewing (Let's Encrypt)
- [ ] **Database password** changed from default in `.env.deploy`
- [ ] **JWT secrets** regenerated (don't use example values)
- [ ] **pgAdmin** port 5050 blocked from public internet (or disabled)
- [ ] **Docker daemon** secured (don't expose socket to public)
- [ ] **Regular backups** configured (database + uploads volume)
- [ ] **Rate limiting** enabled in backend (already configured: 100 req/min)
- [ ] **ENABLE_DOCS** set to `false` in production (hides Swagger)
- [ ] **Log rotation** configured to prevent disk fill

---

## Performance Optimization

### Enable Nginx Caching

```nginx
# Add to http block in /etc/nginx/nginx.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

# In server block:
location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_valid 404 1m;
    proxy_cache_bypass $http_pragma $http_authorization;
    add_header X-Cache-Status $upstream_cache_status;
    proxy_pass http://localhost:3062;
}
```

### Enable Gzip Compression

```nginx
# Add to http block:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### Docker Resource Limits

```yaml
# Add to docker-compose.deploy.yml services:
backend:
  deploy:
    resources:
      limits:
        cpus: '1.0'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

---

## Monitoring

### Health Check Endpoints

```bash
# Backend health
curl http://localhost:3062/api/health

# Frontend health
curl http://localhost:3060

# Database health
docker-compose -f docker-compose.deploy.yml exec postgres pg_isready -U clubdeofertas
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network stats
docker network inspect clubdeofertas_deploy_network
```

---

## Complete Deployment Checklist

- [ ] **Files copied** to remote server `/root/CLUBDEOFERTAS.COM.PY`
- [ ] **Environment files** verified (`.env.deploy` in all locations)
- [ ] **Database URL** uses `postgres:5432` not `localhost:15432`
- [ ] **CORS origins** include all proxy domains
- [ ] **Reverse proxy** configured (Nginx/Apache)
- [ ] **SSL certificates** installed and working
- [ ] **DNS records** pointing to `217.79.189.223`
- [ ] **Firewall rules** allow ports 80, 443, 3060-3062, 15432
- [ ] **Docker images** built successfully
- [ ] **Containers running** and healthy (`docker ps`)
- [ ] **Database migrated** and seeded
- [ ] **Backend API** responding on https://api.clubdeofertas.online/api
- [ ] **Frontend** loading on https://clubdeofertas.online
- [ ] **Admin panel** loading on https://admin.clubdeofertas.online
- [ ] **Images loading** correctly (check product pages)
- [ ] **Authentication** working (login test)
- [ ] **Cart functionality** working
- [ ] **Order creation** working
- [ ] **Admin CRUD** operations working

---

## Quick Reference

### Service URLs

| Service | Internal Port | External URL |
|---------|--------------|--------------|
| Frontend | 3060 | https://clubdeofertas.online |
| Admin | 3061 | https://admin.clubdeofertas.online |
| Backend | 3062 | https://api.clubdeofertas.online/api |
| PostgreSQL | 5432 (15432 external) | localhost:15432 |
| pgAdmin | 5050 | http://217.79.189.223:5050 |

### Default Credentials

**Admin User:**
- Email: `admin@clubdeofertas.com`
- Password: `admin123456`

**pgAdmin:**
- Email: `admin@clubdeofertas.com`
- Password: `adminMa1x1x0x!!`

### Essential Commands

```bash
# Deploy
./setup-deploy.sh

# Stop
docker-compose -f docker-compose.deploy.yml down

# Start
docker-compose -f docker-compose.deploy.yml up -d

# Logs
docker-compose -f docker-compose.deploy.yml logs -f

# Rebuild
docker-compose -f docker-compose.deploy.yml build --no-cache

# Status
docker-compose -f docker-compose.deploy.yml ps
```

---

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.deploy.yml logs -f [service]`
2. Verify environment files: `cat .env.deploy backend/.env.deploy`
3. Review this documentation's troubleshooting section
4. Check CLAUDE.md for development guidelines

**Last Updated:** 2025-10-27
**Version:** 1.0.1
