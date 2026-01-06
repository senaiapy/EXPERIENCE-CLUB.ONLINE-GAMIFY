# Browser Access Guide

## ✅ Services are Running!

All services are UP and accessible. Here's how to access them:

## 🖥️ From Your Computer

Open your browser and go to:

### Frontend (Customer Store)
```
http://localhost:3060
```
or
```
http://192.168.0.9:3060
```

### Admin Panel
```
http://localhost:3061
```
or
```
http://192.168.0.9:3061
```

### API
```
http://localhost:3062/api/products
```

### Swagger Documentation
```
http://localhost:3062/api/docs
```

### pgAdmin (Database Management)
```
http://localhost:5050
```

## 📱 From Phone/Tablet (Same WiFi)

Make sure your phone/tablet is connected to the same WiFi network, then open:

### Frontend
```
http://192.168.0.9:3060
```

### Admin
```
http://192.168.0.9:3061
```

## 🔍 Troubleshooting

### Browser Shows "Cannot Connect" or "Site Can't Be Reached"

1. **Wait 30 seconds** - Services might still be starting
2. **Check services are running:**
   ```bash
   npm run dev:ps
   ```
   All should show "Up"

3. **Try different URL:**
   - If `localhost:3060` doesn't work, try `http://127.0.0.1:3060`
   - If `192.168.0.9:3060` doesn't work, try `localhost:3060`

4. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete` (Windows/Linux)
   - Press `Cmd+Shift+Delete` (Mac)
   - Clear cached images and files

5. **Try incognito/private mode:**
   - `Ctrl+Shift+N` (Chrome/Edge)
   - `Ctrl+Shift+P` (Firefox)
   - `Cmd+Shift+N` (Mac)

6. **Check firewall:**
   ```bash
   sudo ufw allow 3060/tcp
   sudo ufw allow 3061/tcp
   sudo ufw allow 3062/tcp
   ```

### Browser Shows Blank Page

1. **Open Developer Console:**
   - Press `F12`
   - Check Console tab for errors

2. **Check Network tab:**
   - Press `F12` → Network tab
   - Reload page
   - Look for failed requests (red)

3. **View logs:**
   ```bash
   npm run dev:logs
   ```

### "ERR_CONNECTION_REFUSED"

Services are not running. Start them:
```bash
npm run dev:start
```

Wait 30 seconds and try again.

### "This site can't provide a secure connection" (ERR_SSL_PROTOCOL_ERROR)

You're using `https://` - change to `http://`:
- ❌ `https://localhost:3060`
- ✅ `http://localhost:3060`

### Page Loads but Shows Errors

1. **Check backend is responding:**
   ```bash
   curl http://localhost:3062/api/products
   ```
   Should return JSON data

2. **Check logs for errors:**
   ```bash
   npm run dev:logs | grep -i error
   ```

### Can't Access from Phone

1. **Verify same WiFi:**
   - Computer and phone must be on same network

2. **Check computer's firewall:**
   ```bash
   sudo ufw status
   ```

3. **Test from computer first:**
   ```bash
   curl http://192.168.0.9:3060
   ```
   Should return HTML

4. **Use IP address (not localhost):**
   - ❌ `http://localhost:3060`
   - ✅ `http://192.168.0.9:3060`

## ✅ Quick Test

Run this command to verify everything:
```bash
curl -s http://localhost:3060 | head -20
```

Should show HTML starting with `<!DOCTYPE html>`

## 🔐 Login Credentials

### Admin Panel (http://localhost:3061)
- **Email:** admin@clubdeofertas.com
- **Password:** admin123456

### pgAdmin (http://localhost:5050)
- **Email:** admin@clubdeofertas.com
- **Password:** adminMa1x1x0x!!

## 📊 Check Status

```bash
# View running containers
npm run dev:ps

# View logs
npm run dev:logs

# View backend logs only
npm run dev:logs:backend

# View frontend logs only
npm run dev:logs:frontend

# View admin logs only
npm run dev:logs:admin
```

## 🔄 Restart Services

If something's not working:
```bash
npm run dev:stop
npm run dev:start
```

## 📚 Browser Compatibility

Tested and working on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ✅ Mobile browsers (Chrome, Safari, Firefox)

## Common Browser Issues

### Chrome: "NET::ERR_CERT_AUTHORITY_INVALID"
You're using HTTPS when you should use HTTP. Change URL from `https://` to `http://`

### Firefox: "Unable to connect"
Disable proxy settings or extensions that might block local connections

### Safari: "Safari Can't Connect to the Server"
Allow local network access in Safari settings

---

## 🎯 Quick Links (Click to open)

Once services are running, use these URLs:

**From your computer:**
- Frontend Store: http://localhost:3060
- Admin Panel: http://localhost:3061
- API Products: http://localhost:3062/api/products
- Swagger Docs: http://localhost:3062/api/docs
- pgAdmin: http://localhost:5050

**From phone/tablet on WiFi:**
- Frontend: http://192.168.0.9:3060
- Admin: http://192.168.0.9:3061

---

## 🚀 All Set!

Your development environment is running and accessible:
- ✅ Backend API responding on port 3062
- ✅ Frontend running on port 3060
- ✅ Admin panel running on port 3061
- ✅ Database healthy
- ✅ All services accessible from browser
