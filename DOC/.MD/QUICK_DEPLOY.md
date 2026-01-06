# 🚀 Quick Production Deployment Guide

## TL;DR - Deploy in 5 Minutes

### Step 1: Clone on Server
```bash
cd /var/www
git clone https://github.com/your-repo/clubdeofertas.online-FULL.git
cd clubdeofertas.online-FULL
```

### Step 2: Setup Environment
```bash
# Copy production environment files
cp .env.prod .env
cp backend/.env.prod backend/.env
cp frontend/.env.prod frontend/.env
cp admin/.env.prod admin/.env

# Generate new secrets (IMPORTANT!)
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXT_PUBLIC_JWT_SECRET=$(openssl rand -base64 32)" >> .env
```

### Step 3: Deploy with Docker
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to start (30 seconds)
sleep 30

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed admin user
docker-compose -f docker-compose.prod.yml exec backend npm run seed:admin
```

### Step 4: Configure Nginx + SSL

**Install Nginx & Certbot:**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

**Create Nginx config:** `/etc/nginx/sites-available/clubdeofertas`
```nginx
# Backend API
server {
    listen 80;
    server_name api.clubdeofertas.online;
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name clubdeofertas.online www.clubdeofertas.online;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Admin
server {
    listen 80;
    server_name admin.clubdeofertas.online;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable and get SSL:**
```bash
sudo ln -s /etc/nginx/sites-available/clubdeofertas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Get SSL certificates
sudo certbot --nginx -d api.clubdeofertas.online
sudo certbot --nginx -d clubdeofertas.online -d www.clubdeofertas.online
sudo certbot --nginx -d admin.clubdeofertas.online
```

### Step 5: Verify Deployment
```bash
# Check services
docker-compose -f docker-compose.prod.yml ps

# Test URLs
curl https://api.clubdeofertas.online/api/health
curl https://clubdeofertas.online
curl https://admin.clubdeofertas.online
```

## ✅ Done!

Your domains:
- **Frontend**: https://clubdeofertas.online
- **Admin**: https://admin.clubdeofertas.online
- **API**: https://api.clubdeofertas.online/api

Default admin credentials:
- Email: `admin@clubdeofertas.com`
- Password: `admin123456`

**⚠️ IMPORTANT:** Change admin password after first login!

---

## 🔄 Quick Update

```bash
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Monitor Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 🛑 Stop Services

```bash
docker-compose -f docker-compose.prod.yml down
```

---

For detailed instructions, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)
