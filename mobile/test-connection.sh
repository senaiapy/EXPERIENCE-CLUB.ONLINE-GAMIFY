#!/bin/bash

echo "════════════════════════════════════════════════════════"
echo "  Club de Ofertas - Mobile Connection Test"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get WiFi IP
WIFI_IP=$(ip addr show wlp2s0 | grep "inet " | awk '{print $2}' | cut -d'/' -f1)

echo "📡 Network Configuration:"
echo "   WiFi IP: $WIFI_IP"
echo "   Backend Port: 3062"
echo "   API URL: http://$WIFI_IP:3062/api"
echo ""

# Test 1: Check backend is running
echo "Test 1: Checking if backend is running..."
if netstat -tlnp 2>/dev/null | grep -q ":3062" || ss -tln | grep -q ":3062"; then
    echo -e "   ${GREEN}✓${NC} Backend is running on port 3062"
else
    echo -e "   ${RED}✗${NC} Backend is NOT running on port 3062"
    echo "   Run: npm run dev:backend (from monorepo root)"
    exit 1
fi
echo ""

# Test 2: Test backend via localhost
echo "Test 2: Testing backend via localhost..."
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/test_response.txt "http://localhost:3062/api/products?page=1&limit=1")
if [ "$RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Backend responds on localhost (HTTP $RESPONSE)"
else
    echo -e "   ${RED}✗${NC} Backend not responding on localhost (HTTP $RESPONSE)"
    exit 1
fi
echo ""

# Test 3: Test backend via WiFi IP
echo "Test 3: Testing backend via WiFi IP ($WIFI_IP)..."
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/test_response2.txt "http://$WIFI_IP:3062/api/products?page=1&limit=1")
if [ "$RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Backend responds on WiFi IP (HTTP $RESPONSE)"
else
    echo -e "   ${RED}✗${NC} Backend not responding on WiFi IP (HTTP $RESPONSE)"
    echo "   Check firewall settings"
    exit 1
fi
echo ""

# Test 4: Test registration endpoint
echo "Test 4: Testing registration endpoint..."
REG_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/reg_response.txt \
    -X POST "http://$WIFI_IP:3062/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test $(date +%s)\",\"email\":\"test$(date +%s)@test.com\",\"password\":\"test123456\"}")

if [ "$REG_RESPONSE" = "201" ]; then
    echo -e "   ${GREEN}✓${NC} Registration endpoint working (HTTP $REG_RESPONSE)"
    cat /tmp/reg_response.txt | jq -r '.user.email' 2>/dev/null | xargs -I {} echo "   Created user: {}"
else
    echo -e "   ${RED}✗${NC} Registration failed (HTTP $REG_RESPONSE)"
    cat /tmp/reg_response.txt
    exit 1
fi
echo ""

# Test 5: Check Android device
echo "Test 5: Checking Android device connection..."
if adb devices | grep -q "device$"; then
    DEVICE_ID=$(adb devices | grep "device$" | awk '{print $1}')
    echo -e "   ${GREEN}✓${NC} Android device connected: $DEVICE_ID"
else
    echo -e "   ${YELLOW}⚠${NC} No Android device detected via USB"
    echo "   This is OK if testing via WiFi only"
fi
echo ""

# Test 6: Check environment file
echo "Test 6: Checking .env.development configuration..."
if grep -q "API_URL=http://$WIFI_IP:3062/api" .env.development; then
    echo -e "   ${GREEN}✓${NC} Environment file configured correctly"
    echo "   API_URL=http://$WIFI_IP:3062/api"
else
    echo -e "   ${YELLOW}⚠${NC} Environment file might need update"
    echo "   Current API_URL: $(grep "^API_URL=" .env.development)"
    echo "   Expected: API_URL=http://$WIFI_IP:3062/api"
fi
echo ""

echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ All tests passed!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📱 Next steps:"
echo "   1. Make sure your phone and computer are on the same WiFi"
echo "   2. Run: pnpm start -c"
echo "   3. Scan QR code or press 'a' for Android"
echo "   4. Test registration in the app"
echo ""
echo "📋 Test registration credentials:"
echo "   Email: test@clubdeofertas.com"
echo "   Password: test123456"
echo ""
