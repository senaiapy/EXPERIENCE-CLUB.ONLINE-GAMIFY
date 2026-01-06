# Production Deployment Guide

## Overview

This guide covers deploying Experience Club e-commerce platform to a production server.

## Server Requirements

- **Server IP**: 217.79.189.223
- **OS**: Ubuntu 20.04+ or Debian 11+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 20GB free space
- **Access**: SSH root access

## Prerequisites

### On Your Local Machine

1. **SSH Access**:
   ```bash
   ssh root@217.79.189.223
   # Password: @450ab6606
   ```

2. **Required Tools** (auto-installed by script):
   - sshpass (for automated SSH)
   - rsync (for file transfer)

### On Production Server

The deployment script automatically installs:
- Docker & Docker Compose
- Node.js 18+
- Required system packages

## Configuration Files

### 1. `.env.prod` (Production Environment Variables)

Already created with:
- `SERVER_IP=217.79.189.223`
- Database credentials
- JWT secrets
- Port configurations (3060, 3061, 3062, 5050)
- Production URLs using SERVER_IP

### 2. `docker-compose.prod.yml` (Production Docker Configuration)

Configured with:
- PostgreSQL database with persistent volumes
- NestJS backend (production build)
- Next.js frontend (production build)
- Next.js admin panel (production build)
- pgAdmin for database management
- All services using production environment
- Automatic restarts (`restart: always`)

### 3. `setup-prod.sh` (Production Setup Script)

Automated setup script that:
- Validates prerequisites
- Builds production Docker containers
- Starts all services
- Runs database migrations
- Seeds initial data
- Configures firewall rules
- Validates all services

### 4. `deploy-to-server.sh` (Remote Deployment Script)

Fully automated deployment that:
- Tests SSH connectivity
- Installs Docker on remote server
- Transfers project files
- Runs production setup remotely
- Validates deployment

## Deployment Methods

### Method 1: Automated Remote Deployment (Recommended)

From your local machine:

```bash
# Make script executable
chmod +x deploy-to-server.sh

# Run deployment
./deploy-to-server.sh
```

This script will:
1. Check SSH connectivity
2. Install Docker on server
3. Transfer all project files
4. Run production setup
5. Verify deployment

**Estimated time**: 10-15 minutes

### Method 2: Manual Deployment

#### Step 1: Transfer Files to Server

```bash
# Using SCP
scp -r ./ root@217.79.189.223:/opt/clubdeofertas/

# Or using rsync (recommended)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ root@217.79.189.223:/opt/clubdeofertas/
```

#### Step 2: SSH to Server

```bash
ssh root@217.79.189.223
# Password: @450ab6606
```

#### Step 3: Install Docker (if not installed)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### Step 4: Run Production Setup

```bash
cd /opt/clubdeofertas
chmod +x setup-prod.sh
./setup-prod.sh
```

## Access Points

After deployment, services are accessible at:

| Service | URL | Description |
|---------|-----|-------------|
| Frontend Store | http://217.79.189.223:3060 | Customer-facing store |
| Admin Panel | http://217.79.189.223:3061 | Admin dashboard |
| Backend API | http://217.79.189.223:3062/api | REST API |
| Swagger Docs | http://217.79.189.223:3062/api/docs | API documentation |
| pgAdmin | http://217.79.189.223:5050 | Database management |

## Default Credentials

### Admin Account
- **Email**: admin@clubdeofertas.com
- **Password**: admin123456

⚠️ **CHANGE IMMEDIATELY AFTER FIRST LOGIN**

### pgAdmin
- **Email**: admin@clubdeofertas.com
- **Password**: adminMa1x1x0x!!

## Post-Deployment Steps

### 1. Security Hardening

```bash
# Change admin password via admin panel
# http://217.79.189.223:3061/auth/login

# Update .env.prod with new JWT secrets
openssl rand -base64 32  # Generate new secret
nano .env.prod  # Update JWT_SECRET
docker-compose -f docker-compose.prod.yml restart backend
```

### 2. Firewall Configuration

```bash
# UFW (Ubuntu Firewall)
ufw allow 3060/tcp  # Frontend
ufw allow 3061/tcp  # Admin
ufw allow 3062/tcp  # Backend
ufw allow 5050/tcp  # pgAdmin
ufw enable
```

### 3. SSL/TLS Configuration (Recommended)

For HTTPS, use nginx reverse proxy with Let's Encrypt:

```bash
# Install nginx
apt-get install nginx certbot python3-certbot-nginx

# Configure domain names (if available)
# Then use certbot to get SSL certificates
```

### 4. Database Backups

```bash
# Create backup script
cat > /opt/clubdeofertas/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/clubdeofertas"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)
docker exec clubdeofertas_prod_postgres pg_dump -U clubdeofertas clubdeofertas > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/clubdeofertas/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/clubdeofertas/backup.sh") | crontab -
```

## Monitoring & Maintenance

### Check Service Status

```bash
cd /opt/clubdeofertas
docker-compose -f docker-compose.prod.yml ps
```

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f admin
```

### Restart Services

```bash
# All services
docker-compose -f docker-compose.prod.yml restart

# Specific service
docker-compose -f docker-compose.prod.yml restart backend
```

### Update Application

```bash
# From local machine, run deployment again
./deploy-to-server.sh

# Or manually on server
cd /opt/clubdeofertas
git pull  # If using git
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Monitor Resources

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

## Troubleshooting

### Services Not Starting

```bash
# Check Docker status
systemctl status docker

# Check container logs
docker-compose -f docker-compose.prod.yml logs

# Rebuild containers
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Database Connection Issues

```bash
# Check database health
docker exec clubdeofertas_prod_postgres pg_isready -U clubdeofertas

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Restart database
docker-compose -f docker-compose.prod.yml restart postgres
```

### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :3062

# Kill process or change port in .env.prod
```

### Out of Disk Space

```bash
# Remove unused Docker images
docker system prune -a

# Remove old logs
docker-compose -f docker-compose.prod.yml logs --tail=1000 > /dev/null
```

## Rollback Procedure

```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Restore database backup
docker exec -i clubdeofertas_prod_postgres psql -U clubdeofertas clubdeofertas < /opt/backups/clubdeofertas/backup_YYYYMMDD_HHMMSS.sql

# Start previous version
docker-compose -f docker-compose.prod.yml up -d
```

## Performance Optimization

### 1. Enable Docker Log Rotation

```bash
# Edit /etc/docker/daemon.json
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker
```

### 2. Database Optimization

```bash
# Run VACUUM on database (monthly)
docker exec clubdeofertas_prod_postgres psql -U clubdeofertas clubdeofertas -c "VACUUM ANALYZE;"
```

### 3. Monitor Application Performance

Access Swagger docs at http://217.79.189.223:3062/api/docs to test API performance.

## Support & Documentation

- **Project Documentation**: See `CLAUDE.md` for complete development guide
- **API Documentation**: http://217.79.189.223:3062/api/docs
- **Issues**: Report issues in project repository

## Deployment Checklist

- [ ] Server has Docker and Docker Compose installed
- [ ] Firewall configured to allow ports 3060, 3061, 3062, 5050
- [ ] `.env.prod` configured with correct SERVER_IP
- [ ] Files transferred to server
- [ ] Production setup completed successfully
- [ ] All services running and accessible
- [ ] Admin password changed
- [ ] Database backup configured
- [ ] SSL/TLS configured (if using domain)
- [ ] Monitoring setup complete

---

**Deployment Date**: $(date)
**Server IP**: 217.79.189.223
**Application Version**: 1.0.3
