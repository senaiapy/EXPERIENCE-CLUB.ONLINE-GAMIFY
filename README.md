# Experience Club - Complete E-Commerce Platform

**Full-stack monorepo e-commerce solution for Experience Club (Paraguay)**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-red.svg)](https://nestjs.com/)
[![React Native](https://img.shields.io/badge/React_Native-0.79-blue.svg)](https://reactnative.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Quick Start](#quick-start)
5. [Project Structure](#project-structure)
6. [Applications](#applications)
7. [Database](#database)
8. [API Documentation](#api-documentation)
9. [Development](#development)
10. [Deployment](#deployment)
11. [Features](#features)
12. [Configuration](#configuration)
13. [Testing](#testing)
14. [Documentation](#documentation)

---

## Overview

Experience Club is a comprehensive e-commerce platform built for the Paraguayan market, featuring:

- **11,361+ products** across 18 categories
- **579 brands** including major international names
- **Multi-platform**: Web (Frontend + Admin) + Mobile (iOS/Android)
- **Multi-language**: Spanish, English, Portuguese, Arabic
- **Currency system**: Backend stores USD, displays Guaraníes (₲)
- **AI Chatbot**: n8n-powered customer support
- **Complete e-commerce features**: Cart, wishlist, orders, payments, user management

**Live Deployment:**
- Production Server: `217.79.189.223`
- Frontend: `http://217.79.189.223:3060`
- Admin: `http://217.79.189.223:3061`
- API: `http://217.79.189.223:3062/api`

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Experience Club Platform                     │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼────┐          ┌──────▼──────┐       ┌──────▼──────┐
   │ Frontend│          │    Admin    │       │   Mobile    │
   │ Next.js │          │   Next.js   │       │ React Native│
   │  :3060  │          │    :3061    │       │  iOS/Android│
   └────┬────┘          └──────┬──────┘       └──────┬──────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                        ┌──────▼──────┐
                        │   Backend   │
                        │   NestJS    │
                        │   API :3062 │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ PostgreSQL  │
                        │  Database   │
                        │   :15432    │
                        └─────────────┘
```

### Monorepo Structure

```
experience-club/
├── backend/          # NestJS REST API (port 3062)
├── frontend/         # Next.js customer storefront (port 3060)
├── admin/            # Next.js admin dashboard (port 3061)
├── mobile/           # React Native app (Expo Router)
├── zap-ai/           # n8n chatbot workflows
├── DOC/              # Comprehensive documentation
└── project/          # Project management files
```

---

## Technology Stack

### Backend (NestJS API)
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL + Prisma ORM 6.17.1
- **Authentication**: JWT + Passport.js + bcrypt
- **File Upload**: Multer + Sharp (image processing)
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI
- **Internationalization**: nestjs-i18n (EN, ES, PT)

### Frontend (Customer Store)
- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18.2 + TypeScript 5.2
- **Styling**: Tailwind CSS 3.3
- **State**: TanStack React Query 5.87 + Zustand 5.0
- **API**: Axios 1.12 with JWT interceptors
- **i18n**: i18next 25.5 (Spanish, English, Portuguese)
- **Analytics**: Facebook Pixel integration

### Admin Panel
- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18.2 + TypeScript 5.2
- **Styling**: Tailwind CSS 3.3
- **State**: Client-side React hooks
- **API**: Centralized API services in `/lib`
- **Features**: Full CRUD, image upload, order management

### Mobile App
- **Framework**: React Native 0.79 + Expo Router 5.1
- **Language**: TypeScript 5.8 (strict mode)
- **Styling**: NativeWind 4.1 (Tailwind for RN)
- **State**: Zustand 5.0 + React Query 5.52
- **Storage**: MMKV (encrypted, fast)
- **Navigation**: Expo Router (file-based)
- **Icons**: Lucide React Native
- **Animations**: Moti + Reanimated
- **i18n**: i18next (ES, EN, PT, AR)
- **Build**: EAS Build (iOS/Android)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15+
- **Reverse Proxy**: Nginx (production)
- **Package Manager**: npm (workspaces)
- **Version Control**: Git

---

## Quick Start

### Prerequisites

- **Docker Desktop** (for containerized development)
- **Node.js** 18+ (for local development)
- **npm** 9+ (workspaces support)
- **Git**

### Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd EXPERIENCE-CLUB.ONLINE

# 2. Install all dependencies
npm run install:all

# 3. Start Docker services (database, backend, frontend, admin)
npm run dev:start

# 4. Seed database with products
npm run docker:seed

# 5. Access applications
# Frontend: http://localhost:3060
# Admin: http://localhost:3061
# Backend API: http://localhost:3062/api
# Swagger Docs: http://localhost:3062/api/docs
# pgAdmin: http://localhost:5050
```

### Default Credentials

**Admin User:**
- Email: `admin@clubdeofertas.com`
- Password: `admin123456`

**pgAdmin:**
- Email: `admin@clubdeofertas.com`
- Password: `admin`

**Database:**
- User: `clubdeofertas`
- Password: `Ma1x1x0x!!Ma1x1x0x!!`
- Database: `clubdeofertas`

---

## Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── auth/              # JWT authentication & authorization
│   ├── products/          # Product CRUD with search & filters
│   ├── brands/            # Brand management
│   ├── categories/        # Category management
│   ├── cart/              # Shopping cart operations
│   ├── wishlist/          # Wishlist management
│   ├── orders/            # Order processing & checkout
│   ├── users/             # User profile management
│   ├── images/            # Centralized image management
│   ├── checkout-api/      # External API for chatbots
│   ├── settings/          # Global application settings
│   ├── prisma/            # Prisma service
│   └── i18n/              # Translation files (EN, ES, PT)
├── prisma/
│   └── schema.prisma      # Database schema (19 models)
├── public/images/         # Product images (served at /images)
├── uploads/               # User uploads
└── db/                    # Seed data (products, brands, categories)
```

### Frontend (`/frontend`)

```
frontend/
├── app/                   # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Order checkout
│   ├── product/[id]/      # Product details
│   ├── categorias/        # Category pages
│   ├── marcas/            # Brand pages
│   ├── dashboard/         # User account
│   └── wishlist/          # Saved products
├── components/            # 83 reusable components
├── lib/                   # API services & utilities
├── contexts/              # React Context providers
└── public/                # Static assets
```

### Admin (`/admin`)

```
admin/
├── app/
│   ├── admin/
│   │   ├── products/      # Product management
│   │   ├── orders/        # Order management
│   │   ├── brands/        # Brand management
│   │   └── categories/    # Category management
│   └── auth/              # Admin login
├── components/
├── lib/                   # API services
└── public/
```

### Mobile (`/mobile`)

```
mobile/
├── src/
│   ├── app/               # Expo Router (file-based routing)
│   ├── api/               # React Query hooks
│   ├── components/ui/     # Reusable components
│   ├── lib/               # State stores & utilities
│   └── translations/      # i18n (ES, EN, PT, AR)
├── android/               # Android native code
├── ios/                   # iOS native code
└── eas.json               # Expo build configuration
```

---

## Applications

### 1. Backend API (NestJS) - Port 3062

**Core Endpoints:**
- `/api/auth` - Authentication (register, login, profile)
- `/api/products` - Products (CRUD, search, filter, sort)
- `/api/brands` - Brand management
- `/api/categories` - Category management
- `/api/cart` - Shopping cart (JWT required)
- `/api/wishlist` - Wishlist (JWT required)
- `/api/orders` - Orders (JWT required)

**Key Features:**
- Swagger API documentation at `/api/docs`
- Rate limiting (100 requests/minute)
- JWT authentication with role-based access
- Image upload up to 10MB
- Multi-language support

### 2. Frontend Store (Next.js) - Port 3060

**Key Pages:**
- Home, Product Details, Cart, Checkout
- User Dashboard, Wishlist
- Category and Brand pages

**Features:**
- Server-side rendering for SEO
- Currency conversion (USD → Guaraníes)
- Multi-language (ES, EN, PT)
- Dark mode, n8n AI chatbot

### 3. Admin Panel (Next.js) - Port 3061

**Features:**
- Product CRUD with image upload
- Order management with status updates
- Brand and category management
- User management, Order statistics

### 4. Mobile App (React Native + Expo)

**Features:**
- Tab navigation (Shop, Wishlist, Cart, Profile)
- Product browsing, Cart, Checkout
- Dark mode, 4 languages (ES, EN, PT, AR)

**Build:**
```bash
pnpm build:production:android
pnpm build:production:ios
```

---

## Database

### PostgreSQL with Prisma ORM

**Core Models:**
- User, Product, ProductImage, Image
- Brand, Category
- Cart, CartItem, Wishlist
- Order, OrderItem, Settings

**Operations:**
```bash
npm run docker:migrate:dev    # Run migrations
npm run docker:seed           # Seed database
npm run prisma:studio         # Database GUI
```

**Current Data:**
- Products: 11,361+
- Brands: 579
- Categories: 18

---

## API Documentation

### Products

```http
GET    /api/products              # List with pagination
GET    /api/products/:id          # Get by ID
POST   /api/products              # Create (admin)
PATCH  /api/products/:id          # Update (admin)
```

### Cart (JWT Required)

```http
GET    /api/cart                  # Get cart
POST   /api/cart                  # Add product
PATCH  /api/cart/:productId       # Update quantity
```

### Orders (JWT Required)

```http
POST   /api/orders                # Create order
GET    /api/orders/my-orders      # User's orders
GET    /api/orders/:id            # Order details
```

**Swagger:** http://localhost:3062/api/docs

---

## Development

### Daily Workflow

```bash
npm run dev:start     # Start all services
npm run dev:logs      # Monitor logs
npm run dev:ps        # Check status
npm run dev:stop      # Stop services
```

### Individual Services

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:admin
cd mobile && pnpm start
```

### Database

```bash
npm run docker:migrate:dev
npm run docker:seed
npm run prisma:studio
```

---

## Deployment

### Production Server

**Server:** 217.79.189.223

**Deployment:**
```bash
# Automated
./deploy-to-server.sh

# Manual
rsync -avz ./ root@217.79.189.223:/opt/clubdeofertas/
ssh root@217.79.189.223
./setup-prod.sh
```

**URLs:**
- Frontend: http://217.79.189.223:3060
- Admin: http://217.79.189.223:3061
- API: http://217.79.189.223:3062/api

---

## Features

### E-Commerce Core

✅ Product Catalog (11,361+ products)
✅ Shopping Cart with stock validation
✅ Wishlist
✅ Orders & Checkout
✅ User Management (JWT)

### Currency System

- Backend: USD
- Frontend: Guaraníes (₲)
- Rate: 1 USD = 7,300 Gs.

```typescript
import { convertAndFormatPrice } from '@/lib/currency';
{convertAndFormatPrice(product.price)}  // "₲386.754"
```

### Multi-Language

- Spanish (ES) - Default
- English (EN)
- Portuguese (PT)
- Arabic (AR) - Mobile (RTL)

### Dark Mode

System-aware, manual toggle, persisted

### AI Chatbot (n8n)

- Intent-based routing
- PostgreSQL conversation storage
- Mobile-optimized

---

## Configuration

### Environment Variables

**Root `.env`:**
```bash
POSTGRES_USER=clubdeofertas
POSTGRES_PASSWORD=Ma1x1x0x!!Ma1x1x0x!!
POSTGRES_DB=clubdeofertas
POSTGRES_PORT=15432
BACKEND_PORT=3062
FRONTEND_PORT=3060
ADMIN_PORT=3061
SERVER_IP=localhost
JWT_SECRET=your-secret
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:3062/images
```

**Ports:**
- Frontend: 3060
- Admin: 3061
- Backend: 3062
- PostgreSQL: 15432
- pgAdmin: 5050

---

## Testing

```bash
npm run test -w backend
npm run test -w frontend
npm run test:all
cd mobile && pnpm test
```

---

## Documentation

### Resources

- **[CLAUDE.md](CLAUDE.md)** - Development guide
- **[DEPLOYMENT.md](DOC/.MD/DEPLOYMENT.md)** - Production deployment
- **[DOCKER_DEPLOYMENT_COMPLETE.md](DOC/.MD/DOCKER_DEPLOYMENT_COMPLETE.md)** - Docker manual
- **[IMAGE_SERVER_DOCUMENTATION.md](DOC/.MD/IMAGE_SERVER_DOCUMENTATION.md)** - Image server
- **[Swagger UI](http://localhost:3062/api/docs)** - API docs

---

## Quick Reference

### Commands

```bash
# Development
npm run dev:start
npm run dev:logs
npm run dev:stop

# Database
npm run docker:migrate:dev
npm run docker:seed
npm run prisma:studio

# Testing
npm run test:all

# Build
npm run build
npm run build:all

# Mobile
cd mobile
pnpm start
pnpm build:production:android
```

### Health Check

```bash
curl http://localhost:3062/api/products?page=1&limit=5
curl http://localhost:3060
curl http://localhost:3061
docker-compose -f docker-compose.dev.yml ps
```

---

## Contact & Support

**Project:** Experience Club E-Commerce Platform
**Version:** 1.0.1
**Last Updated:** January 2025
**Server:** 217.79.189.223

For issues:
1. Check logs: `npm run dev:logs`
2. Review `/DOC/.MD`
3. Consult [CLAUDE.md](CLAUDE.md)
4. Test API: `curl http://localhost:3062/api/products`

---

**Built with ❤️ for Experience Club**
# EXPERIENCE-CLUB.ONLINE-GAMIFY
