# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce monorepo for Experience Club (Paraguay):
- **Backend**: NestJS API with PostgreSQL (Prisma ORM) - port 3062
- **Frontend**: Next.js 14+ customer storefront - port 3060
- **Admin**: Next.js 14+ admin dashboard - port 3061
- **Database**: PostgreSQL with 11,361+ products, 579 brands, 18 categories

## Essential Commands

### Daily Development
```bash
npm run dev:start              # Start all Docker services
npm run dev:logs               # Monitor logs
npm run dev:ps                 # Check service status
npm run dev:stop               # Stop all services
```

### Database Operations
```bash
npm run docker:migrate:dev     # Run migrations
npm run docker:seed            # Seed with admin + products
npm run prisma:studio          # Open database GUI (localhost)
npm run docker:migrate:reset   # Reset database (⚠️ destructive)
```

### Testing & Building
```bash
npm run test:all               # Run all tests
npm run build                  # Build all applications
npm run build:all              # Build apps + Docker images
```

### Individual Services (Workspace Commands)
```bash
npm run dev:backend            # Backend only
npm run dev:frontend           # Frontend only
npm run dev:admin              # Admin only
npm run lint -w backend        # Lint specific workspace
npm install axios -w admin     # Install in specific workspace
```

## Critical Architecture Patterns

### 1. Currency System (MUST FOLLOW)

**Backend stores USD, Frontend displays Guaraníes (₲):**

```typescript
// ✅ CORRECT - Use conversion utility
import { convertAndFormatPrice } from '@/lib/currency';
{convertAndFormatPrice(product.price)}  // "₲386.754"

// ❌ WRONG - Will show huge incorrect numbers
₲{product.price.toLocaleString('es-PY')}
```

Exchange rate: 1 USD = 7,300 Guaraníes

### 2. Data Fetching Patterns

**Frontend** - Hybrid rendering:
```typescript
// Server Component (for SEO)
export default async function ProductsPage({ searchParams }) {
  const products = await productsApi.getProducts({...});
  return <ProductList products={products} />;
}

// Client Component (for interactivity)
'use client';
export default function CartPage() {
  const [cart, setCart] = useState(null);
  useEffect(() => { cartApi.getCart().then(setCart); }, []);
  return <CartView cart={cart} />;
}
```

**Admin** - Always client-side:
```typescript
'use client';
export default function AdminPage() {
  const [data, setData] = useState<Type[]>([]);  // ✅ Always initialize []
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getData();
      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error('Invalid API response');
      }
      setData(response.data);
    } catch (err) {
      setError(err.message);
      setData([]);  // ✅ Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  const safeData = data || [];  // ✅ Safe variable

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} />;
  return <div>{safeData.map(item => ...)}</div>;
}
```

### 3. API Services Architecture

Both apps use centralized API services in `/lib/`:

**Frontend** (`/frontend/lib/`):
- `products-api.ts` - Read-only product operations
- `cart-api.ts` - Shopping cart CRUD
- `wishlist-api.ts` - Wishlist management
- `orders-api.ts` - Order creation and history
- `auth-api.ts` - Authentication + JWT tokens
- `currency.ts` - USD to Guaraní conversion
- `axios.ts` - Configured instance with JWT interceptor

**Admin** (`/admin/lib/`):
- `products-api.ts` - Full CRUD + image upload
- `orders-api.ts` - Order management (admin-only)
- `brands-api.ts`, `categories-api.ts` - Catalog management
- `auth-api.ts` - Admin authentication
- `axios.ts` - Configured with JWT + error handling

### 4. Authentication Flow

JWT-based with localStorage:
```typescript
// Token automatically added by axios interceptor
localStorage.setItem('token', jwt);
localStorage.setItem('user', JSON.stringify(user));

// Auto-redirects to /auth/login on 401
// Frontend checks: authApi.isAuthenticated()
// Admin checks: localStorage.getItem('admin_authenticated') === 'true'
```

## Database Schema (Prisma)

**Core Models:**
- `User` - JWT auth, roles (ADMIN/USER), profile info
- `Product` - Catalog with pricing, inventory, slugs
- `ProductImage` - Legacy direct images (SMALL, MEDIUM, LARGE, HOME)
- `Image` - New unified system with relations
- `Brand`, `Category` - Product organization
- `Cart`, `CartItem` - Shopping cart
- `Wishlist` - Saved products
- `Order`, `OrderItem` - Order management with status tracking

**Dual Image System:**
1. Legacy `ProductImage` - Direct one-to-many with sizes
2. New `Image` + relation tables - Centralized with metadata

## Port Configuration

- **Frontend**: http://localhost:3060
- **Admin**: http://localhost:3061
- **Backend API**: http://localhost:3062/api
- **Swagger Docs**: http://localhost:3062/api/docs
- **PostgreSQL**: localhost:15432
- **pgAdmin**: http://localhost:5050

## Default Credentials

- **Admin**: admin@clubdeofertas.com / admin123456
- **pgAdmin**: admin@clubdeofertas.com / admin

## Environment Files

Multiple .env files control different layers:
- Root `.env` - Database credentials, JWT secret
- Root `.env.dev` - Development overrides (docker-compose.dev.yml)
- `backend/.env` - DATABASE_URL, JWT settings
- `frontend/.env`, `admin/.env` - NEXT_PUBLIC_API_URL

## Common Issues & Fixes

### Price Display Shows Wrong Numbers
Use `convertAndFormatPrice()` from `/lib/currency.ts` - never format prices directly.

### Admin Redirect Loop
Clear localStorage (F12 → Application → Clear storage), login fresh at `/auth/login`.

### Loading Spinner Stuck
1. Check backend is running: `npm run dev:ps`
2. Test API: `curl http://localhost:3062/api/products?page=1&limit=5`
3. Clear localStorage and re-login

### Docker Issues
```bash
npm run dev:stop && npm run dev:start  # Reset containers
docker-compose -f docker-compose.dev.yml logs -f  # View logs
```

## Development Workflow

**Standard Development:**
1. `npm run dev:start` - Start all services
2. `npm run dev:ps` - Verify containers running
3. `npm run dev:logs` - Monitor real-time logs
4. Make changes - hot reload enabled
5. `npm run dev:stop` - Stop when done

**Database Changes:**
1. Edit `backend/prisma/schema.prisma`
2. `npm run docker:migrate:dev` - Create migration
3. Migration applied automatically to running containers

**First Time Setup:**
1. `npm run setup` - Automated setup script
2. OR manually: `npm run install:all && npm run docker:build && npm run dev:start`
3. `npm run docker:seed` - Populate database

## Key Development Rules

1. **Currency**: Backend stores USD, Frontend converts to ₲ using `/lib/currency.ts`
2. **Data Source**: All data from PostgreSQL via NestJS API (no static files)
3. **Stock Sorting**: Backend auto-sorts by `stockQuantity DESC`
4. **Type Safety**: Strict TypeScript throughout
5. **Docker First**: All development in containers
6. **Monorepo**: Use `-w <workspace>` for package-specific commands
7. **Migrations**: Always use Prisma for schema changes
8. **Rendering**: Frontend uses Server Components for SEO, Admin uses Client Components
9. **Safe Coding**: Always initialize arrays as `[]`, use optional chaining, validate API responses

## Quick Health Check

```bash
npm run dev:ps                 # All containers running?
curl http://localhost:3062/api/products?page=1&limit=5  # Backend OK?
curl http://localhost:3060     # Frontend OK?
curl http://localhost:3061     # Admin OK?
```

## API Endpoints Summary

**Auth** (`/api/auth`):
- POST `/register`, `/login` - Create/authenticate user
- GET `/profile` - Get current user (requires JWT)

**Products** (`/api/products`):
- GET `/` - List with pagination/filters
- GET `/:id`, `/slug/:slug` - Get single product
- POST `/`, PATCH `/:id`, DELETE `/:id` - Admin only

**Cart** (`/api/cart`) - All require JWT:
- GET `/` - Get user's cart
- POST `/` - Add product
- PATCH `/:productId` - Update quantity
- DELETE `/:productId`, `/` - Remove item or clear

**Wishlist** (`/api/wishlist`) - All require JWT:
- GET `/`, POST `/` - Get/add items
- DELETE `/:productId` - Remove item

**Orders** (`/api/orders`) - All require JWT:
- POST `/` - Create order (checkout)
- GET `/my-orders`, `/:id` - User's orders
- GET `/all`, `/stats` - Admin only
- PATCH `/:id` - Admin: update status

## Frontend-Specific Guidelines

**When creating pages:**
1. Determine if SEO needed (Server Component) or interactive (Client Component)
2. Use `convertAndFormatPrice()` for all price displays
3. Handle loading, error, and empty states
4. Check auth for protected routes
5. Use optional chaining: `product?.images?.[0]?.url`

**Cart updates:**
```typescript
// Trigger navigation cart count update
window.dispatchEvent(new Event('cartUpdated'));
```

## Admin-Specific Guidelines

**When creating admin pages:**
1. Always add `'use client'` directive
2. Initialize state: `useState<Type[]>([])`
3. Validate responses: `if (!response?.data || !Array.isArray(response.data))`
4. Use safe variables: `const safeData = data || []`
5. Show loading, error, and empty states

**Admin layout pattern:**
```typescript
// Set isLoading=false BEFORE redirect (prevents stuck spinner)
useEffect(() => {
  const authenticated = localStorage.getItem('admin_authenticated') === 'true';
  if (!authenticated) {
    setIsLoading(false);  // ✅ Critical
    router.push('/auth/login');
    return;
  }
  setIsLoading(false);
}, [router]);
```

## Monorepo Structure

```
/backend     - NestJS API (port 3062)
/frontend    - Next.js customer store (port 3060)
/admin       - Next.js admin panel (port 3061)
/zap-ai      - n8n chatbot workflows and documentation
```

Use workspace commands: `npm run build -w backend`, `npm install axios -w admin`

---

## n8n AI Chatbot Integration

### Overview

Complete n8n-powered AI chatbot with mobile optimization, intent-based routing, and PostgreSQL conversation storage.

**Location:** `/zap-ai/`

### Key Components

1. **ChatWidget** (`/frontend/components/ChatWidget.tsx`)
   - Full-screen mobile experience
   - Desktop floating widget
   - SSR-compatible (no localStorage errors)
   - Touch-optimized UI with 48px+ touch targets
   - Safe area insets for notched devices (iPhone X+)

2. **n8n API Service** (`/frontend/lib/n8n-api.ts`)
   - Webhook communication
   - Session management
   - Browser-compatible (SSR safe)

3. **n8n Workflow** (`/zap-ai/chatbot-workflow.json`)
   - 14 nodes with PostgreSQL Database integration
   - Intent-based routing (greeting, pricing, shipping, orders, products)
   - OpenAI GPT-3.5 fallback for complex queries
   - Conversation analytics

### Mobile Optimization Features

✅ **Full-screen overlay** on mobile (floating widget on desktop)
✅ **Touch targets** minimum 48x48px (Material Design standard)
✅ **Safe area insets** for iPhone notch and home indicator
✅ **No zoom on focus** (16px font size on inputs)
✅ **Smooth scrolling** with `-webkit-overflow-scrolling: touch`
✅ **PWA ready** with manifest and metadata
✅ **SSR compatible** with browser environment checks

### Quick Start

1. **Import n8n workflow:**
   ```bash
   # In n8n interface: Settings → Import from File
   # Select: /zap-ai/chatbot-workflow.json
   ```

2. **Configure PostgreSQL:**
   ```bash
   # In n8n: Add PostgreSQL credentials
   # Host: localhost:15432
   # Database: clubofertas
   # User/Password: From root .env file
   ```

3. **Run database schema:**
   ```bash
   psql -h localhost -p 15432 -U clubofertas -d clubofertas -f zap-ai/database-schema.sql
   ```

4. **Add webhook URL to frontend:**
   ```bash
   # /frontend/.env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat
   CHAT_WEBHOOK_SECRET=your-secret-token
   ```

5. **Test the chatbot:**
   - Open http://localhost:3060
   - Click WhatsApp/Chat button (bottom-right)
   - Send test message

### Documentation Files

- **`MOBILE_IMPLEMENTATION.md`** - Complete mobile optimization guide
- **`QUICKSTART.md`** - 5-minute setup guide
- **`IMPLEMENTATION_SUMMARY.md`** - Technical architecture
- **`README.md`** - Full documentation
- **`INDEX.md`** - File structure reference

### Environment Variables

```bash
# /frontend/.env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat
CHAT_WEBHOOK_SECRET=89e2eaeac2a8c604c76a144a0511ed115c9b35689465c303ac7696cec847717e
```

### Testing Checklist

**Mobile:**
- [ ] Chat opens full-screen on iPhone/Android
- [ ] Header respects notch area
- [ ] Input area respects home indicator
- [ ] No zoom on input focus
- [ ] Touch buttons are large and responsive

**Desktop:**
- [ ] Chat appears as floating widget (bottom-right)
- [ ] 384px width, 600px height
- [ ] Rounded corners with green border

**SSR:**
- [ ] `npm run build` succeeds without localStorage errors
- [ ] No server-side rendering warnings
- [ ] Chat history loads correctly

### API Integration

**Send message:**
```typescript
import { getN8nService } from '@/lib/n8n-api';

const n8n = getN8nService();
const response = await n8n.sendMessage('¿Cuánto cuesta este producto?', {
  previousMessages: [...],
});

console.log(response.response);      // AI response text
console.log(response.suggestions);   // Quick reply buttons
```

**Clear session:**
```typescript
n8n.clearSession();  // Starts fresh conversation
```

### n8n Workflow Features

1. **Intent Detection** - Routes to specialized handlers:
   - Greeting → Welcome message
   - Pricing → Price queries from database
   - Shipping → Delivery information
   - Orders → Order status lookup
   - Products → Product search and recommendations

2. **Context Awareness** - Uses previous 5 messages for context

3. **Conversation Storage** - Saves to PostgreSQL:
   - Session ID
   - User ID (if authenticated)
   - Message history
   - Intent classification
   - Timestamps

4. **Analytics Dashboard** - PostgreSQL views:
   - Message volume by hour/day
   - Intent distribution
   - User engagement metrics
   - Response time statistics

### Troubleshooting

**Issue:** `localStorage is not defined` error

**Fix:** Check browser environment checks in:
- `/frontend/lib/n8n-api.ts` (generateSessionId, getUserId, clearSession)
- `/frontend/components/ChatWidget.tsx` (useEffect chat history)

**Issue:** Chat doesn't open on mobile

**Fix:**
1. Check `isOpen` prop is true
2. Verify `z-50` z-index
3. Test on real device (not just dev tools)

**Issue:** Webhook returns 401 Unauthorized

**Fix:**
1. Check `CHAT_WEBHOOK_SECRET` matches in:
   - `/frontend/.env`
   - n8n workflow Webhook Authentication node
2. Restart frontend: `npm run dev:frontend`

---
