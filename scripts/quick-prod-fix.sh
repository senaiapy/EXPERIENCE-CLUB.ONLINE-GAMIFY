#!/bin/bash

echo "🚀 Quick Production Fix - Update ENV and Restart"
echo "================================================"

# Update .env files
sed -i.bak 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' .env
sed -i.bak 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' backend/.env
sed -i.bak 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' frontend/.env
sed -i.bak 's/SERVER_IP=localhost/SERVER_IP=217.79.189.223/g' admin/.env

echo "✅ Environment variables updated to use SERVER_IP=217.79.189.223"

# Restart containers
echo "🔄 Restarting containers..."
docker-compose -f docker-compose.dev.yml restart

echo "⏳ Waiting 15 seconds for services to start..."
sleep 15

# Test endpoints
echo ""
echo "🧪 Testing endpoints..."
echo "Backend API:"
curl -s "http://217.79.189.223:3062/api/products?page=1&limit=2" | head -10

echo ""
echo "Frontend:"
curl -s "http://217.79.189.223:3060" | grep -o "<title>.*</title>" | head -1

echo ""
echo "✅ Quick fix applied!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend: http://217.79.189.223:3060"
echo "   Admin:    http://217.79.189.223:3061"
echo "   Backend:  http://217.79.189.223:3062/api"
