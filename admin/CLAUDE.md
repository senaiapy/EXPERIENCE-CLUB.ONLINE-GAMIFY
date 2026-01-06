# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (default port 3000)
npm run dev

# Build for production
npm run build

# Start production server (configured for port 3052)
npm start

# Deploy with PM2 as "romapy-app"
npm run deploy-local

# Run linting
npm run lint
```

## Architecture Overview

This is a Next.js 14+ e-commerce application built with TypeScript and Tailwind CSS using the App Router architecture. The project handles large product datasets through server-side JSON parsing with efficient pagination and filtering.

### Key Structure

- **App Router**: Uses Next.js App Router with `app/` directory structure
- **Server Components**: Main pages are Server Components that read JSON data directly from filesystem
- **Client Components**: Interactive filtering and pagination logic in separate client components (e.g., `app/marcas/client.tsx`)
- **Data Source**: Primary data source is `database/products.json` with CSV files (`products.csv`, `products_with_spacing_issues.csv`) as backup

### Page Routes

1. **Home Page** (`app/page.tsx`): Main product listing with server-side JSON parsing and search functionality
2. **Brands Page** (`app/marcas/page.tsx`): Brand-specific products with advanced filtering
   - Uses `app/marcas/client.tsx` for client-side interactions
   - Separate loading states in `app/marcas/loading.tsx`
   - Dynamic brand routes (`app/marcas/[brand]/page.tsx`)
3. **Experience Club** (`app/clubdeofertas/page.tsx`): Additional product section with pagination
   - Includes filters page (`app/clubdeofertas/filtros/page.tsx`)
   - Uses `app/clubdeofertas/client.tsx` for client interactions
4. **Product Details** (`app/product/[id]/page.tsx`): Individual product pages with `ProductDetailClient.tsx`
5. **Authentication & User Management**:
   - **Login** (`app/auth/login/page.tsx`): User authentication with redirect to dashboard
   - **Register** (`app/auth/register/page.tsx`): User registration with form validation
   - **Dashboard** (`app/dashboard/page.tsx`): Protected user account dashboard with:
     - User profile overview and statistics
     - Order history management
     - Wishlist functionality
     - Account settings and security options
     - Authentication protection via `ProtectedRoute` component
6. **Additional Pages**: Categories, Cart, Checkout, Contact, Company info, Payment methods, etc.

### Data Handling

- **JSON Parsing**: Primary data source is JSON files (`database/products.json`) for faster loading
- **CSV Fallback**: CSV files available in root directory and `/db/` folder as backup
- **Pagination**: Server-side pagination with configurable limits (default 12-24 items per page)
- **Product Types**: Two main interfaces defined in `types/index.ts`:
  - `ClubDeOfertasProduct` for main products (uppercase field names)
  - `BrandProduct` for brand products (lowercase field names)
- **Search Functionality**: Full-text search across product name, description, brand, category, and tags

### Data Structure

**Main Products JSON Structure (`ClubDeOfertasProduct`):**
- Fields: ID, CATEGORIA, NOME, DISPONIBILIDADE, REF, TAGS, marca, DESCRICAO, ESPECIFICACAO, DESCRICAO_COMPLETA, PRECO, PRECO_VENTA, IMAGEM

**Brand Products Structure (`BrandProduct`):**
- Fields: id, name, descripcion, buy_price, sell_price, marca, categoria_marca, ref, disponibilidad, main_image, additional_images, categorias, tags

### Component Architecture

**Shared Components (`/components/`):**
- `Navigation.tsx`: Header with logo, navigation dropdowns, search functionality, and mobile menu
- `ProductCard.tsx`: Reusable product display component with image, pricing, and availability
- `Carousel.tsx`: Hero section carousel for featured content
- `Footer.tsx`: Site footer with links and contact information

**Client-Side Components:**
- `app/marcas/client.tsx`: Advanced filtering for brand products (brand, category, price, availability)
- `app/clubdeofertas/client.tsx`: Product interactions for club section
- `app/product/[id]/ProductDetailClient.tsx`: Client-side product detail interactions

### TypeScript Setup

- Path aliases configured with `@/*` mapping to root directory
- Strict TypeScript configuration enabled
- Type definitions in `types/index.ts` with separate interfaces for different product types
- Two main product interfaces handle different data formats (uppercase vs lowercase field names)

### Styling & UI

- Tailwind CSS with custom configuration (`tailwind.config.js`)
- Responsive design patterns throughout
- Inter font from Google Fonts (configured in layout)
- Loading states for better UX during data parsing (`app/loading.tsx`)
- Gradient backgrounds and modern UI components
- Sticky navigation with dropdowns for categories and brands

### Performance Considerations

- Server-side JSON parsing for optimal performance with large datasets (20MB+ JSON files)
- Pagination to handle large datasets efficiently (1000+ products)
- Separate client components to minimize hydration overhead
- Image optimization with Next.js Image component and error fallbacks
- Memoized filtering in client components

### File Structure

- **Product data**: Root level JSON files (`products.json`) and CSV files (`products.csv`, `products_with_spacing_issues.csv`)
- **Database backup**: `/db/` folder with additional product files
- **Images**: `/public/images` and `/public/images_marcas` directories for product images
- **Components**: `/components` directory for shared UI components
- **Types**: `/types/index.ts` for TypeScript interfaces
- **Navigation**: Sticky header with logo (`/public/logo-clubdeofertas.png`)

### Key Features

- **Multi-format Data Support**: Primary JSON with CSV fallback
- **Advanced Search**: Full-text search with URL parameter support
- **Responsive Pagination**: Dynamic pagination with first/last navigation
- **Brand Filtering**: Dedicated brand page with multi-criteria filtering
- **Price Formatting**: Localized currency formatting (USD/Guarani)
- **Availability Status**: Real-time availability indicators
- **SEO Friendly**: Proper metadata and page structure
- **Mobile Navigation**: Collapsible mobile menu with dropdown support
- **Product Categories**: Organized by perfume types (masculine, feminine, Arabic)