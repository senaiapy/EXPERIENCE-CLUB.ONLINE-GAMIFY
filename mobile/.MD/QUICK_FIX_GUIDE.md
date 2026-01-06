# 🚀 QUICK FIX - Products Not Displaying

## Problem: Home page is empty, no products showing

## ✅ FIXED! Here's what to do:

---

## 1️⃣ Run the Fix Script

```bash
cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133755/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1/mobile

./fix-and-restart.sh
```

**What this does:**
- ✅ Kills old Expo processes
- ✅ Clears port 8081
- ✅ Tests backend API
- ✅ Starts fresh Expo server with cache cleared

---

## 2️⃣ Press 'a' to Reload on Android

When Expo starts, you'll see:

```
› Press a │ open Android
› Press w │ open web
```

**Press `a`** and wait for the app to reload on your device.

---

## 3️⃣ You Should See Products!

After the app reloads, you should see:

- ✅ **Product grid** (2 columns)
- ✅ **Product images**
- ✅ **Product names**
- ✅ **Prices in Guaraníes** (₲)
- ✅ **Search bar** at top
- ✅ **Scrollable list**

---

## 🎯 What I Fixed

**File Changed:** `src/api/products/use-products.ts`

**The Issue:**
- Backend returns: `{ products: [...], pagination: {...} }`
- Mobile app was trying to access: `data` directly (which was undefined)

**The Fix:**
- Now correctly accesses: `data.products` ✅
- Properly maps pagination data ✅

---

## 🐛 Still Not Working?

### Option 1: Manual restart
```bash
# Kill Expo
pkill -f "expo start"

# Clear cache and restart
pnpm start -c
```

### Option 2: Check backend
```bash
# Test API manually
curl "http://192.168.0.7:3062/api/products?page=1&limit=5"

# Should show products JSON
```

### Option 3: Check environment
```bash
# Verify API URL
cat .env.development | grep API_URL

# Should show:
# API_URL=http://192.168.0.7:3062/api
```

---

## 📱 Test Everything

After products load, test these features:

- [ ] **Products display** on home page
- [ ] **Search** for products
- [ ] **Click product** to see details
- [ ] **Add to cart**
- [ ] **Add to wishlist** (heart icon)
- [ ] **View cart** (bottom tab)
- [ ] **Checkout**

---

## ✨ That's It!

The fix is already applied. Just run:

```bash
./fix-and-restart.sh
```

Then press **`a`** when Expo starts.

Products should load! 🎉

---

**Need more help?** Check [PRODUCTS_FIX.md](PRODUCTS_FIX.md) for detailed technical explanation.
