#!/bin/bash

# Setup script for testing Club de Ofertas mobile app on physical Android device via USB

echo "🔧 Setting up Android USB connection for Club de Ofertas..."
echo ""

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device detected via USB"
    echo "   Please ensure:"
    echo "   1. Device is connected via USB"
    echo "   2. USB debugging is enabled"
    echo "   3. You've authorized the device (check device screen)"
    exit 1
fi

echo "✅ Android device detected:"
adb devices | grep "device$"
echo ""

# Setup port forwarding
echo "🔄 Setting up port forwarding (port 3062)..."
adb reverse tcp:3062 tcp:3062

if [ $? -eq 0 ]; then
    echo "✅ Port forwarding successful!"
    echo "   Your device can now access backend at: http://localhost:3062"
else
    echo "❌ Port forwarding failed"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo "   pnpm start -c"
echo ""
echo "💡 Note: You need to run this script every time you reconnect your device"
