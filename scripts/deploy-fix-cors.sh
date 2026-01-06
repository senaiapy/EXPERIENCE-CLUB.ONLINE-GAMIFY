#!/bin/bash

# Production Deployment Script - CORS Fix
# This script rebuilds and redeploys the production environment with domain-based URLs

set -e  # Exit on error

echo "🚀 Club de Ofertas - Production Deployment (CORS Fix)"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo -e "${RED}❌ Error: .env.prod file not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Step 1: Stopping existing production containers...${NC}"
docker-compose -f docker-compose.prod.yml down

echo ""
echo -e "${YELLOW}📋 Step 2: Cleaning up old images (optional - press Ctrl+C to skip)...${NC}"
sleep 3
docker image prune -f || true

echo ""
echo -e "${YELLOW}📋 Step 3: Building new production images...${NC}"
echo "This may take 5-10 minutes..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo -e "${YELLOW}📋 Step 4: Starting production containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${YELLOW}📋 Step 5: Waiting for services to start...${NC}"
sleep 10

echo ""
echo -e "${YELLOW}📋 Step 6: Checking container status...${NC}"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo -e "${YELLOW}📋 Step 7: Checking service health...${NC}"
echo "Checking backend API..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3062/api || echo "000")
if [ "$BACKEND_STATUS" = "404" ] || [ "$BACKEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Backend API is responding (HTTP $BACKEND_STATUS)${NC}"
else
    echo -e "${RED}❌ Backend API is not responding (HTTP $BACKEND_STATUS)${NC}"
fi

echo "Checking frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3060 || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding (HTTP $FRONTEND_STATUS)${NC}"
fi

echo "Checking admin panel..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3061 || echo "000")
if [ "$ADMIN_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Admin panel is responding${NC}"
else
    echo -e "${RED}❌ Admin panel is not responding (HTTP $ADMIN_STATUS)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "=================================================="
echo "📊 Production URLs:"
echo "=================================================="
echo "Frontend:  http://experience-club.online"
echo "Admin:     http://experience-club.online:3061"
echo "Backend:   http://experience-club.online:3062/api"
echo "Swagger:   http://experience-club.online:3062/api/docs"
echo ""
echo "🔍 Local Testing URLs:"
echo "Frontend:  http://localhost:3060"
echo "Admin:     http://localhost:3061"
echo "Backend:   http://localhost:3062/api"
echo ""
echo "=================================================="
echo "🔧 Management Commands:"
echo "=================================================="
echo "View logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "Stop services: docker-compose -f docker-compose.prod.yml down"
echo "Restart:       docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "=================================================="
echo "🐛 Debugging:"
echo "=================================================="
echo "If you still see CORS errors:"
echo "1. Clear browser cache and cookies"
echo "2. Check browser console for the exact API URL being called"
echo "3. Verify CORS headers: curl -I http://experience-club.online:3062/api"
echo "4. Check backend logs: docker-compose -f docker-compose.prod.yml logs backend"
echo ""
