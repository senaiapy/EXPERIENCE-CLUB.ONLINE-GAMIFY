# ⚠️ CRITICAL WARNING: seed:perfumes Script

## 🚨 THIS SCRIPT WILL DELETE ALL PRODUCTS

### What Happens When You Run:
```bash
npm run seed:perfumes
# OR
npm run docker:seed:perfumes
# OR
npm run dev:seed:perfumes
```

---

## ❌ DELETED DATA

The following will be **PERMANENTLY DELETED**:

| Data Type | Description | Impact |
|-----------|-------------|--------|
| **Products** | All 11,361+ products | ❌ **DELETED** |
| **Cart Items** | All shopping cart contents | ❌ **DELETED** |
| **Wishlist Items** | All user wishlists | ❌ **DELETED** |
| **Order Items** | Product references in orders | ❌ **DELETED** |
| **Product Images** | All product image data | ❌ **DELETED** |
| **Image Relations** | Product-image links | ❌ **DELETED** |

---

## ✅ PRESERVED DATA

The following will **NOT** be deleted:

| Data Type | Status |
|-----------|--------|
| **Users** | ✅ **PRESERVED** |
| **Orders** | ✅ **PRESERVED** (but items deleted) |
| **Brands** | ✅ **PRESERVED** |
| **Categories** | ✅ **PRESERVED** |
| **Carts** | ✅ **PRESERVED** (but empty) |

---

## 📦 WHAT GETS ADDED

After deletion, only **145 perfume products** will be added:
- 32 perfume brands
- 4 perfume categories (Masculinos, Femeninos, Arabes Masculinos, Arabes Femeninos)
- 145 perfume products from `/backend/db/perfumes.json`

---

## ⚠️ USE CASES

### ✅ When to Use This Script:
- You want to **completely replace** the product catalog with perfumes
- You're starting a **perfume-only** store
- You're **testing** in a development environment
- You have a **backup** and want to restore with perfumes

### ❌ When NOT to Use This Script:
- You want to **add** perfumes to existing products (use regular `seed` instead)
- You have **active orders** with product references
- You have **customers** with items in carts/wishlists
- This is your **production** database

---

## 🔄 Alternative: Keep Existing Products

If you want to **ADD** perfumes without deleting existing products, you need to:

1. **Remove the deletion function** from `seed_perfumes.ts`
2. Comment out this line:
   ```typescript
   // await deleteAllProducts();  // ← Comment this out
   ```

3. Or create a separate script that only adds perfumes

---

## 💾 BACKUP RECOMMENDATION

**BEFORE running this script**, create a database backup:

```bash
# Backup database
docker-compose exec postgres pg_dump -U clubdeofertas clubdeofertas > backup_$(date +%Y%m%d).sql

# Restore if needed
docker-compose exec -T postgres psql -U clubdeofertas clubdeofertas < backup_20251010.sql
```

---

## 🚀 How to Run (If You're Sure)

```bash
# Option 1: Docker (Recommended)
npm run docker:seed:perfumes

# Option 2: Development environment
npm run dev:seed:perfumes

# Option 3: Direct (from backend directory)
cd backend && npm run seed:perfumes
```

---

## 📊 What You'll See

```
🚀 Starting perfume database seeding...

🗑️  Deleting all existing products...
   ✅ Deleted 0 cart items
   ✅ Deleted 0 wishlist items
   ✅ Deleted 0 order items
   ✅ Deleted 0 product images
   ✅ Deleted 0 product-image relations
   ✅ Deleted 11361 products  ← YOUR PRODUCTS ARE GONE

🗑️  All products and related data deleted successfully!

🏷️  Seeding perfume brands...
✅ 32 perfume brands created/updated

📂 Seeding perfume categories...
✅ 4 perfume categories created/updated

🧴 Seeding perfumes from JSON file...
✅ Loaded 145 perfumes from JSON
✅ Processed 145/145 perfumes

✅ Perfume seeding completed successfully!
```

---

## 🔍 Verification

After running, verify the results:

```bash
# Check product count (should be 145)
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas -c "SELECT COUNT(*) FROM \"Product\";"

# Check categories (should include PERFUMES categories)
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas -c "SELECT name FROM \"Category\";"
```

---

## 🆘 If You Ran This By Mistake

1. **Stop immediately** (if still running): `Ctrl+C`
2. **Restore from backup**:
   ```bash
   docker-compose exec -T postgres psql -U clubdeofertas clubdeofertas < backup_YYYYMMDD.sql
   ```
3. **Reseed regular products**:
   ```bash
   npm run docker:seed
   ```

---

## 📝 Summary

| Action | Result |
|--------|--------|
| Run `seed:perfumes` | **Deletes all 11,361+ products** |
| | **Adds 145 perfume products** |
| | **Clears all carts and wishlists** |
| | **Removes product references from orders** |

**Think twice before running this script!**

If in doubt, use the regular seed script instead: `npm run docker:seed`

---

**For complete documentation, see**: [PERFUMES-SEED-SETUP.md](../PERFUMES-SEED-SETUP.md)
