#!/bin/bash

echo "🚀 Starting Club de Ofertas Mobile App..."
echo ""

# Kill any existing Expo processes
echo "🧹 Cleaning up existing processes..."
pkill -f "expo start" 2>/dev/null
lsof -ti:8081 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

# Check backend is running
echo "🔍 Checking backend..."
if ! netstat -tlnp 2>/dev/null | grep -q ":3062" && ! ss -tln | grep -q ":3062"; then
    echo "❌ Backend is NOT running!"
    echo "   Please start it first:"
    echo "   cd .. && npm run dev:backend"
    exit 1
fi
echo "✅ Backend is running"
echo ""

# Get WiFi IP
WIFI_IP=$(ip addr show wlp2s0 | grep "inet " | awk '{print $2}' | cut -d'/' -f1)
echo "📡 Your computer IP: $WIFI_IP"
echo "📱 API URL: http://$WIFI_IP:3062/api"
echo ""

# Check environment file
if ! grep -q "API_URL=http://$WIFI_IP:3062/api" .env.development; then
    echo "⚠️  WARNING: .env.development might need update"
    echo "   Expected: API_URL=http://$WIFI_IP:3062/api"
    echo "   Current:  $(grep "^API_URL=" .env.development)"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🎯 Starting Expo with cache clear..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Press 'a' to open on Android device"
echo "  Press 'r' to reload"
echo "  Press 'c' to clear cache and reload"
echo "  Press 'q' to quit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Expo
pnpm start -c
