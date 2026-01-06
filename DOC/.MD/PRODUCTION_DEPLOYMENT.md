# 🚀 Production Deployment Guide
## Experience Club - Full Stack eCommerce Platform

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Requirements](#server-requirements)
3. [Domain Configuration](#domain-configuration)
4. [Environment Setup](#environment-setup)
5. [Docker Deployment](#docker-deployment)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL Certificates](#ssl-certificates)
8. [Database Setup](#database-setup)
9. [Deployment Commands](#deployment-commands)
10. [Post-Deployment](#post-deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software on Server:
- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Nginx**: Latest stable version
- **Certbot** (for SSL): Let's Encrypt client
- **Git**: For code deployment

### Server Specifications (Minimum):
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04 LTS or newer

---

## 🌐 Domain Configuration

### DNS Records to Configure:

```
# A Records (Point to your server IP)
api.clubdeofertas.online        → YOUR_SERVER_IP
clubdeofertas.online            → YOUR_SERVER_IP
admin.clubdeofertas.online      → YOUR_SERVER_IP
www.clubdeofertas.online        → YOUR_SERVER_IP (optional)

# CNAME (Optional)
server.clubdeofertas.online     → api.clubdeofertas.online
```

### Verify DNS Propagation:
```bash
dig api.clubdeofertas.online
dig clubdeofertas.online
dig admin.clubdeofertas.online
```

---

## ⚙️ Environment Setup

### 1. Clone Repository on Server

```bash
cd /var/www
git clone https://github.com/your-repo/clubdeofertas.online-FULL.git
cd clubdeofertas.online-FULL
```

### 2. Copy Production Environment Files

```bash
# Copy main production environment
cp .env.prod .env

# Copy backend production environment
cp backend/.env.prod backend/.env

# Copy frontend production environment
cp frontend/.env.prod frontend/.env

# Copy admin production environment
cp admin/.env.prod admin/.env
```

### 3. Update Secrets (IMPORTANT!)

Edit `.env.prod` and update the following:

```bash
# Generate new JWT secrets
openssl rand -base64 32  # Use for JWT_SECRET
openssl rand -base64 32  # Use for NEXTAUTH_SECRET
openssl rand -base64 32  # Use for NEXT_PUBLIC_JWT_SECRET

# Update database password
POSTGRES_PASSWORD=your-strong-password-here

# Update pgAdmin password
PGADMIN_DEFAULT_PASSWORD=your-admin-password-here
```

---

## 🐳 Docker Deployment

### 1. Build Production Images

```bash
# Build all production Docker images
docker-compose -f docker-compose.prod.yml build --no-cache
```

### 2. Start Services

```bash
# Start all services in detached mode
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Check Container Status

```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f admin
```

---

## 🔐 Nginx Configuration

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Create Nginx Configuration

Create file: `/etc/nginx/sites-available/clubdeofertas.online`

```nginx
# Backend API - api.clubdeofertas.online
server {
    listen 80;
    server_name api.clubdeofertas.online;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (images)
    location /uploads {
        alias /var/www/clubdeofertas.online-FULL/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# Frontend - clubdeofertas.online
server {
    listen 80;
    server_name clubdeofertas.online www.clubdeofertas.online;

    location / {
        proxy_pass http://localhost:3000;
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

# Admin Panel - admin.clubdeofertas.online
server {
    listen 80;
    server_name admin.clubdeofertas.online;

    # Restrict admin access by IP (optional)
    # allow YOUR_OFFICE_IP;
    # deny all;

    location / {
        proxy_pass http://localhost:3001;
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

### 3. Enable Configuration

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/clubdeofertas.online /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔒 SSL Certificates (Let's Encrypt)

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obtain SSL Certificates

```bash
# Get certificates for all domains
sudo certbot --nginx -d api.clubdeofertas.online
sudo certbot --nginx -d clubdeofertas.online -d www.clubdeofertas.online
sudo certbot --nginx -d admin.clubdeofertas.online
```

### 3. Auto-Renewal

Certbot automatically creates a cron job for renewal. Verify:

```bash
sudo certbot renew --dry-run
```

---

## 🗄️ Database Setup

### 1. Run Database Migrations

```bash
# Execute migrations inside backend container
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### 2. Seed Database

```bash
# Seed admin user
docker-compose -f docker-compose.prod.yml exec backend npm run seed:admin

# Seed products (if needed)
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

### 3. Create Database Backups

```bash
# Create backup directory
mkdir -p /var/backups/clubdeofertas

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U clubdeofertas clubdeofertas > /var/backups/clubdeofertas/backup-$(date +%Y%m%d-%H%M%S).sql

# Setup automatic daily backups (crontab)
0 2 * * * docker-compose -f /var/www/clubdeofertas.online-FULL/docker-compose.prod.yml exec postgres pg_dump -U clubdeofertas clubdeofertas > /var/backups/clubdeofertas/backup-$(date +\%Y\%m\%d).sql
```

---

## 🚀 Deployment Commands

### Complete Deployment Script

Create file: `deploy.sh`

```bash
#!/bin/bash

echo "🚀 Starting Experience Club Production Deployment..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Stop services
echo "🛑 Stopping services..."
docker-compose -f docker-compose.prod.yml down

# Build images
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
echo "▶️  Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Check health
echo "🏥 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment complete!"
echo ""
echo "🌐 URLs:"
echo "  - Frontend: https://clubdeofertas.online"
echo "  - Admin: https://admin.clubdeofertas.online"
echo "  - API: https://api.clubdeofertas.online/api"
```

Make executable:
```bash
chmod +x deploy.sh
```

Run deployment:
```bash
./deploy.sh
```

---

## ✅ Post-Deployment Checklist

### 1. Verify Services

```bash
# Check all containers are running
docker-compose -f docker-compose.prod.yml ps

# Check logs for errors
docker-compose -f docker-compose.prod.yml logs --tail=100
```

### 2. Test URLs

```bash
# Test API
curl https://api.clubdeofertas.online/api/health

# Test Frontend
curl -I https://clubdeofertas.online

# Test Admin
curl -I https://admin.clubdeofertas.online
```

### 3. Test Functionality

- [ ] Can browse products on frontend
- [ ] Can login to admin panel
- [ ] Can view products in admin
- [ ] Can create/edit products
- [ ] Images load correctly
- [ ] Search functionality works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Admin CRUD operations work

### 4. Security Checklist

- [ ] SSL certificates installed and working
- [ ] CORS configured correctly
- [ ] JWT secrets are unique and strong
- [ ] Database password is strong
- [ ] pgAdmin is disabled or protected
- [ ] Admin panel IP restrictions (if needed)
- [ ] Firewall configured (UFW)
- [ ] Regular backups scheduled

---

## 🔥 Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs backend

# Check disk space
df -h

# Check memory
free -m
```

### Database Connection Issues

```bash
# Check postgres container
docker-compose -f docker-compose.prod.yml logs postgres

# Connect to database
docker-compose -f docker-compose.prod.yml exec postgres psql -U clubdeofertas -d clubdeofertas
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 Monitoring

### Setup Monitoring Tools

1. **Docker Stats**:
```bash
docker stats
```

2. **PM2** (optional, for process management):
```bash
npm install -g pm2
pm2 startup
pm2 save
```

3. **Log Monitoring**:
```bash
# Install logrotate for log management
sudo apt install logrotate

# Create logrotate config
sudo nano /etc/logrotate.d/clubdeofertas
```

---

## 🔄 Update Strategy

### Rolling Updates

```bash
# 1. Pull latest code
git pull origin main

# 2. Build new images
docker-compose -f docker-compose.prod.yml build

# 3. Restart services one by one
docker-compose -f docker-compose.prod.yml up -d --no-deps backend
docker-compose -f docker-compose.prod.yml up -d --no-deps frontend
docker-compose -f docker-compose.prod.yml up -d --no-deps admin
```

---

## 📞 Support

For issues or questions:
- Check logs: `docker-compose -f docker-compose.prod.yml logs`
- Review this guide
- Contact development team

---

**Last Updated**: October 2025
**Version**: 1.0.3
