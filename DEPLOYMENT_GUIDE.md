# Experience Club - Deployment Guide (Without Docker)

Complete guide for running all applications without Docker using `npm run dev-p`.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Running Applications](#running-applications)
5. [Hardcoded Values Fixed](#hardcoded-values-fixed)
6. [Deployment Checklist](#deployment-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

```bash
# Node.js (v18 or higher)
node --version  # Should be v18.x.x or higher

# npm
npm --version

# PostgreSQL (v14 or higher)
psql --version

# For mobile (optional)
npm install -g expo-cli
```

### Install Dependencies

```bash
# From project root
cd /Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY

# Install all workspace dependencies
npm install

# Or install individually
npm install -w backend
npm install -w frontend
npm install -w admin
cd mobile && npm install
```

---

## Environment Variables

### ✅ All Hardcoded Values Have Been Removed

The following hardcoded values have been moved to environment variables:

| Component | What Was Fixed | Environment Variable |
|-----------|---------------|---------------------|
| Backend CORS | 40+ hardcoded URLs | `CORS_ORIGINS` (comma-separated) |
| Frontend WhatsApp | 3 hardcoded URLs | `NEXT_PUBLIC_ZAP_PHONE` |
| Admin WhatsApp | 2 hardcoded URLs | `NEXT_PUBLIC_ZAP_PHONE` |
| All Apps | localhost fallbacks | Various `NEXT_PUBLIC_*` vars |

### Root `.env` File

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/.env`

```bash
# Environment
NODE_ENV=development
SERVER_IP=localhost

# Ports
BACKEND_PORT=3062
FRONTEND_PORT=3060
ADMIN_PORT=3061

# Database
DB_HOST=localhost
POSTGRES_PORT=15432
POSTGRES_USER=clubdeofertas
POSTGRES_PASSWORD=Ma1x1x0x!!Ma1x1x0x!!
POSTGRES_DB=clubdeofertas
DATABASE_URL=postgresql://clubdeofertas:Ma1x1x0x!!Ma1x1x0x!!@localhost:15432/clubdeofertas?schema=public

# Application URLs
NEXT_PUBLIC_ADMIN_URL=http://localhost:3061
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3060
NEXT_PUBLIC_API_URL=http://localhost:3062/api
API_URL=http://localhost:3062/api
FRONTEND_URL=http://localhost:3060
ADMIN_URL=http://localhost:3061

# CORS Origins (comma-separated) - NO MORE HARDCODED!
CORS_ORIGINS=http://localhost:3060,http://localhost:3061,http://localhost:3062,https://localhost:3060,https://localhost:3061,http://127.0.0.1:3060,http://127.0.0.1:3061,http://0.0.0.0:3060,http://0.0.0.0:3061,https://experience-club.online,https://www.experience-club.online,https://admin.experience-club.online,https://api.experience-club.online,https://clubdeofertas.online,https://www.clubdeofertas.online,https://admin.clubdeofertas.online,https://api.clubdeofertas.online

# Image Server
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:3062/images

# WhatsApp
NEXT_PUBLIC_ZAP_PHONE=595991474601

# JWT
NEXTAUTH_SECRET="FyquHRsMeg8E+T7K9Qd3pDeofESfz7N5fTi5WYtH78U="
JWT_SECRET="9cJb9oHBIQOiA3v1N9LvC31U4ENMAmI83GdpnvpK3Ok="
JWT_EXPIRATION=24h

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=828208093122934
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=828208093122934
```

### Backend `.env`

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend/.env`

```bash
DATABASE_URL=postgresql://clubdeofertas:Ma1x1x0x!!Ma1x1x0x!!@localhost:15432/clubdeofertas?schema=public
PORT=3062
JWT_SECRET="9cJb9oHBIQOiA3v1N9LvC31U4ENMAmI83GdpnvpK3Ok="
JWT_EXPIRATION=24h
```

### Frontend `.env`

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend/.env`

```bash
NODE_ENV=development
SERVER_IP=localhost
BACKEND_PORT=3062
FRONTEND_PORT=3060
ADMIN_PORT=3061

NEXT_PUBLIC_API_URL=http://localhost:3062/api
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:3062/images
NEXT_PUBLIC_ZAP_PHONE=595991474601
NEXT_PUBLIC_FB_PIXEL_ID=828208093122934
```

### Admin `.env`

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin/.env`

```bash
NODE_ENV=development
SERVER_IP=localhost
BACKEND_PORT=3062
FRONTEND_PORT=3060
ADMIN_PORT=3061

NEXT_PUBLIC_API_URL=http://localhost:3062/api
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:3062/images
NEXT_PUBLIC_ZAP_PHONE=595991474601
```

### Mobile `.env.development`

**Location:** `/Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/mobile/.env.development`

```bash
API_URL=http://localhost:3062/api
FRONTEND_URL=http://localhost:3060
IMAGE_BASE_URL=http://localhost:3062/images
SECRET_KEY=development-secret-key
```

---

## Database Setup

### 1. Start PostgreSQL

```bash
# If using Homebrew on macOS
brew services start postgresql

# Or start manually
pg_ctl -D /usr/local/var/postgres start

# Verify PostgreSQL is running
psql --version
```

### 2. Create Database

```bash
# Create database and user
psql postgres

CREATE DATABASE clubdeofertas;
CREATE USER clubdeofertas WITH PASSWORD 'Ma1x1x0x!!Ma1x1x0x!!';
GRANT ALL PRIVILEGES ON DATABASE clubdeofertas TO clubdeofertas;
\q
```

### 3. Run Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed
```

---

## Running Applications

### Option 1: Run All Apps Simultaneously (Recommended)

Open 4 terminal windows:

**Terminal 1 - Backend:**
```bash
cd /Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/backend
npm run dev-p
```

**Terminal 2 - Frontend:**
```bash
cd /Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/frontend
npm run dev-p
```

**Terminal 3 - Admin:**
```bash
cd /Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/admin
npm run dev-p
```

**Terminal 4 - Mobile (Optional):**
```bash
cd /Users/galo/PROJECTS/CLUBDEOFERTAS.COM.PY/mobile
npm start
```

### Option 2: Use tmux (Advanced)

```bash
# Install tmux (if not installed)
brew install tmux

# Create session
tmux new -s clubdeofertas

# Split terminal
Ctrl+B then %  # Split vertically
Ctrl+B then "  # Split horizontally
Ctrl+B then arrow keys  # Navigate between panes

# In each pane, run:
# Pane 1: cd backend && npm run dev-p
# Pane 2: cd frontend && npm run dev-p
# Pane 3: cd admin && npm run dev-p
# Pane 4: cd mobile && npm start
```

### Option 3: Use concurrently Package

```bash
# From project root
npm install -g concurrently

# Run all
concurrently \
  "cd backend && npm run dev-p" \
  "cd frontend && npm run dev-p" \
  "cd admin && npm run dev-p"
```

---

## Hardcoded Values Fixed

### Backend (`src/main.ts`)

**Before:**
```typescript
app.enableCors({
  origin: [
    'http://localhost:3060',  // ❌ Hardcoded
    'http://localhost:3061',  // ❌ Hardcoded
    // ... 40+ more hardcoded URLs
  ],
});
```

**After:**
```typescript
// Parse CORS origins from environment variable
const corsOriginsEnv = process.env.CORS_ORIGINS || '';
const corsOrigins = corsOriginsEnv
  ? corsOriginsEnv.split(',').map((origin) => origin.trim())
  : ['http://localhost:3060', 'http://localhost:3061'];  // ✅ Fallback only

app.enableCors({
  origin: corsOrigins,  // ✅ From env variable
});
```

### Frontend Pages

**Before:**
```typescript
<a href="https://wa.me/595991474601">  // ❌ Hardcoded
```

**After:**
```typescript
const whatsappNumber = process.env.NEXT_PUBLIC_ZAP_PHONE || '595991474601';
const whatsappUrl = `https://wa.me/${whatsappNumber}`;
<a href={whatsappUrl}>  // ✅ From env variable
```

**Files Fixed:**
- `frontend/app/como-comprar/page.tsx`
- `frontend/app/sucursales/page.tsx`
- `frontend/app/order-confirmation/page.tsx`

### Admin Pages

**Before:**
```typescript
<a href="https://wa.me/595991474601">  // ❌ Hardcoded
```

**After:**
```typescript
const whatsappNumber = process.env.NEXT_PUBLIC_ZAP_PHONE || '595991474601';
const whatsappUrl = `https://wa.me/${whatsappNumber}`;
<a href={whatsappUrl}>  // ✅ From env variable
```

**Files Fixed:**
- `admin/app/como-comprar/page.tsx`
- `admin/app/sucursales/page.tsx`

### Frontend Product Details

**Before:**
```typescript
const productImages = [
  `/images/${product.images}`,  // ❌ Hardcoded
];
```

**After:**
```typescript
import { getImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

const mainImageUrl = getImageUrl(product.images);  // ✅ From env variable
const productImages = [mainImageUrl, mainImageUrl, mainImageUrl];
```

**Files Fixed:**
- `frontend/app/product/[id]/ProductDetailClient.tsx`

### Admin Products List

**Before:**
```typescript
let imageUrl = '/images/placeholder-product.png';  // ❌ Hardcoded
if (product.images && Array.isArray(product.images)) {
  imageUrl = `/images/${imageFilename}`;  // ❌ Hardcoded
}
```

**After:**
```typescript
import { getProductImageUrl, getPlaceholderUrl } from '@/lib/image-utils';

const imageUrl = getProductImageUrl(product);  // ✅ From env variable
```

**Files Fixed:**
- `admin/app/admin/products/page.tsx`

---

## Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set in `.env` files
- [ ] Database is running and accessible
- [ ] All dependencies installed (`npm install`)
- [ ] Database migrated (`npx prisma migrate deploy`)
- [ ] Database seeded (`npm run seed`)

### Running Apps

- [ ] Backend running on http://localhost:3062
- [ ] Frontend running on http://localhost:3060
- [ ] Admin running on http://localhost:3061
- [ ] All apps can communicate (no CORS errors)

### Testing

- [ ] Backend API accessible at http://localhost:3062/api/docs
- [ ] Frontend displays products with images
- [ ] Admin can login and manage products
- [ ] Image upload works in admin
- [ ] WhatsApp buttons use correct phone number
- [ ] No hardcoded URLs in console/logs

---

## Troubleshooting

### Issue: CORS Errors

**Symptoms:** `Access-Control-Allow-Origin` errors in browser console

**Solutions:**
1. Check `CORS_ORIGINS` in root `.env`
2. Ensure backend is reading the env variable:
   ```bash
   # In backend/src/main.ts, add logging:
   console.log('CORS Origins:', corsOrigins);
   ```
3. Restart backend: `npm run dev-p`

### Issue: Database Connection Failed

**Symptoms:** `Error: connect ECONNREFUSED`

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   pg_isready
   ```
2. Verify database exists:
   ```bash
   psql -l | grep clubdeofertas
   ```
3. Check `DATABASE_URL` in `backend/.env`

### Issue: Images Not Loading

**Symptoms:** Broken images, 404 errors

**Solutions:**
1. Check images exist in `backend/public/images/`
2. Verify `NEXT_PUBLIC_IMAGE_BASE_URL` in frontend/admin `.env`
3. Check backend is serving static files (visit http://localhost:3062/images/product-1.jpg)

### Issue: WhatsApp Links Not Working

**Symptoms:** Links go to wrong number or show hardcoded value

**Solutions:**
1. Check `NEXT_PUBLIC_ZAP_PHONE` in `.env`
2. Clear Next.js cache:
   ```bash
   rm -rf frontend/.next admin/.next
   ```
3. Restart apps

### Issue: Port Already in Use

**Symptoms:** `Error: listen EADDRINUSE: address already in use :::3062`

**Solutions:**
```bash
# Find process using port
lsof -i :3062

# Kill process
kill -9 <PID>

# Or use different port in .env
BACKEND_PORT=3063
```

---

## Production Deployment

### Environment Variables for Production

Update root `.env` to uncomment production URLs:

```bash
# Production
NODE_ENV=production
SERVER_IP=217.79.189.223

NEXT_PUBLIC_ADMIN_URL=https://admin.experience-club.online
NEXT_PUBLIC_WEBSITE_URL=https://experience-club.online
NEXT_PUBLIC_API_URL=https://api.experience-club.online/api
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.experience-club.online/images

CORS_ORIGINS=https://experience-club.online,https://admin.experience-club.online,https://api.experience-club.online,https://www.experience-club.online,https://clubdeofertas.online,https://admin.clubdeofertas.online,https://api.clubdeofertas.online
```

### Build for Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start

# Admin
cd admin
npm run build
npm start
```

---

## Scripts Reference

### Root Package.json

```bash
npm run dbss          # Start database only
npm run instalss      # Install all workspace dependencies
npm run migratess     # Run all Prisma migrations
npm run buildss       # Build all apps
```

### Backend

```bash
npm run dev           # Development mode (default port)
npm run dev-p         # Development mode on port 3062
npm run build         # Build for production
npm run start:prod    # Start production server
npm run seed          # Seed database
```

### Frontend

```bash
npm run dev           # Development mode (default port)
npm run dev-p         # Development mode on port 3060
npm run build         # Build for production
npm start             # Start production server
```

### Admin

```bash
npm run dev           # Development mode (default port)
npm run dev-p         # Development mode on port 3061
npm run build         # Build for production
npm start             # Start production server
```

### Mobile

```bash
npm start             # Start Expo dev server
npm run android       # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on web browser
```

---

## Summary

✅ **All hardcoded values removed and moved to environment variables**
✅ **Backend CORS origins now configurable via `CORS_ORIGINS`**
✅ **WhatsApp phone numbers use `NEXT_PUBLIC_ZAP_PHONE`**
✅ **All apps have `dev-p` scripts for specific ports**
✅ **Image server fully configured with env variables**
✅ **Mobile app integrated with centralized image server**

**Ready to deploy without Docker!** 🚀

---

**Last Updated:** January 2025
**Version:** 1.0.0
