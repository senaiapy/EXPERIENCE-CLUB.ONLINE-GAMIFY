#!/bin/bash

echo "========================================="
echo "Crontab Permission Fix Script"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root or with sudo"
    exit 1
fi

echo "1. Checking current cron directory permissions..."
ls -la /var/spool/cron/

echo ""
echo "2. Checking crontabs directory permissions..."
ls -la /var/spool/cron/crontabs/ 2>/dev/null || echo "Directory doesn't exist yet"

echo ""
echo "3. Fixing permissions on /var/spool/cron/crontabs..."
chmod 1730 /var/spool/cron/crontabs 2>/dev/null || mkdir -p /var/spool/cron/crontabs && chmod 1730 /var/spool/cron/crontabs

echo ""
echo "4. Setting correct ownership..."
chown root:crontab /var/spool/cron/crontabs 2>/dev/null || chown root:root /var/spool/cron/crontabs

echo ""
echo "5. Checking if crontab group exists..."
getent group crontab || echo "crontab group doesn't exist, using root"

echo ""
echo "6. Verifying permissions after fix..."
ls -la /var/spool/cron/crontabs/

echo ""
echo "7. Testing crontab command..."
echo "# Test crontab entry" | crontab -

if [ $? -eq 0 ]; then
    echo "✓ SUCCESS: Crontab is working!"
    echo ""
    echo "8. Current crontab entries:"
    crontab -l
else
    echo "✗ ERROR: Crontab still has issues"
    echo ""
    echo "Trying alternative fix..."

    # Alternative fix: Check SELinux
    if command -v getenforce &> /dev/null; then
        echo "SELinux status: $(getenforce)"
        if [ "$(getenforce)" != "Disabled" ]; then
            echo "SELinux might be blocking. Try: setenforce 0"
        fi
    fi

    # Check AppArmor
    if command -v aa-status &> /dev/null; then
        echo "AppArmor is running, checking profiles..."
        aa-status | grep cron
    fi
fi

echo ""
echo "========================================="
echo "Script completed"
echo "========================================="
echo ""
echo "You can now try: crontab -e"
