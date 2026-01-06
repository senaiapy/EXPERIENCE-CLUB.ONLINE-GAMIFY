# Experience Club - E-commerce Application

A modern, feature-rich e-commerce application built with Next.js 14, featuring multi-language support, theme switching, authentication, and advanced state management.

## 🚀 Features

### Core Functionalities

#### 🛍️ E-commerce Features
- **Product Catalog**: Comprehensive product listing with search and filtering
- **Brand Pages**: Dedicated brand-specific product pages (`/marcas`)
- **Experience Club Section**: Special offers section with pagination (`/clubdeofertas`)
- **Product Search**: Full-text search across products with URL parameter support
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS

#### 🎨 User Interface
- **Theme Switching**: Dark/Light mode toggle with persistent storage
- **Multi-language Support**: Spanish/English language switching
- **Interactive Navigation**: Sticky header with dropdown menus
- **Product Cards**: Reusable product display components
- **Loading States**: Smooth loading experiences with skeleton screens

#### 🔐 Authentication System
- **NextAuth Integration**: Complete authentication system
- **Google OAuth**: Social login with Google
- **Credentials Provider**: Username/password authentication
- **Session Management**: Persistent user sessions
- **Protected Routes**: Authentication-based route protection

#### 📊 State Management
- **Zustand Store**: Lightweight state management with persistence
- **Authentication Store**: User session and token management
- **Theme Store**: Dark/light mode preferences
- **Shopping Cart Store**: Cart functionality (extendable)

#### 🔄 Data Management
- **TanStack React Query**: Advanced data fetching and caching
- **Server-side Rendering**: Fast initial page loads
- **JSON Data Parsing**: Efficient product data handling
- **API Routes**: RESTful API endpoints for product management
- **Data Validation**: Zod schema validation for type safety

#### 🌐 Internationalization
- **React i18next**: Complete internationalization system
- **Language Detection**: Automatic browser language detection
- **Dynamic Translation**: Runtime language switching
- **Persistent Language**: User preference storage

### Technical Stack

#### Frontend Technologies
- **Next.js 14**: App Router architecture with TypeScript
- **React 18**: Latest React features with Server Components
- **Tailwind CSS**: Utility-first styling framework
- **TypeScript**: Full type safety throughout the application

#### State & Data Management
- **TanStack React Query v5**: Server state management and caching
- **Zustand**: Client state management with persistence
- **Axios**: HTTP client with request/response interceptors
- **Zod**: Runtime type validation and schema parsing

#### Authentication & Security
- **NextAuth v4**: Complete authentication solution
- **JWT Tokens**: Secure token-based authentication
- **Environment Variables**: Secure configuration management
- **CSRF Protection**: Built-in security features

#### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing with Autoprefixer
- **Hot Reload**: Fast development with instant updates

### Project Structure

```
clubdeofertas.online/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page with product listing
│   ├── marcas/                   # Brand pages
│   │   ├── page.tsx              # Server component for brands
│   │   ├── client.tsx            # Client-side filtering
│   │   └── loading.tsx           # Loading states
│   ├── clubdeofertas/            # Club section
│   │   ├── page.tsx              # Club products page
│   │   ├── client.tsx            # Client interactions
│   │   └── filtros/              # Filters page
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── products/             # Product API endpoints
│   │   └── favorites/            # Favorites management
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── Navigation.tsx            # Header navigation
│   ├── ProductCard.tsx           # Product display component
│   ├── Carousel.tsx              # Hero carousel
│   └── Providers.tsx             # Context providers wrapper
├── contexts/                     # React contexts
│   └── ThemeContext.tsx          # Theme management
├── hooks/                        # Custom React hooks
│   ├── useProducts.ts            # Product data hooks
│   └── useAuth.ts                # Authentication hooks
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── axios.ts                  # Axios instance setup
│   ├── react-query.ts            # Query client configuration
│   ├── schemas.ts                # Zod validation schemas
│   └── i18n.ts                   # Internationalization setup
├── stores/                       # Zustand stores
│   ├── auth.ts                   # Authentication store
│   └── theme.ts                  # Theme store
├── types/                        # TypeScript definitions
│   └── index.ts                  # Global type definitions
├── public/                       # Static assets
│   ├── images/                   # Product images
│   ├── images_marcas/            # Brand images
│   └── logo-clubdeofertas.png    # Application logo
└── products.json                 # Product data source
```

### Data Architecture

#### Product Data Structure
```typescript
interface ClubDeOfertasProduct {
  ID: string;
  CATEGORIA: string;
  NOME: string;
  DISPONIBILIDADE: string;
  REF: string;
  TAGS: string;
  marca: string;
  DESCRICAO: string;
  ESPECIFICACAO: string;
  DESCRICAO_COMPLETA: string;
  PRECO: string;
  PRECO_VENTA: string;
  IMAGEM: string;
}

interface BrandProduct {
  id: string;
  categoria: string;
  nome: string;
  disponibilidade: string;
  ref: string;
  tags: string;
  marca: string;
  descricao: string;
  especificacao: string;
  descricao_completa: string;
  preco: string;
  preco_venta: string;
  imagem: string;
}
```

#### API Endpoints
- `GET /api/products` - Get products with search and pagination
- `GET /api/products/[id]` - Get single product by ID
- `POST /api/favorites` - Add product to favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - User logout

### Authentication Flow

1. **User Registration/Login**: Via NextAuth with Google OAuth or credentials
2. **Session Creation**: JWT token generation and storage
3. **State Management**: Zustand store updates with user data
4. **API Protection**: Middleware validates tokens for protected routes
5. **Persistent Sessions**: LocalStorage maintains login state

### Theme System

- **Context Provider**: ThemeContext manages global theme state
- **LocalStorage Persistence**: User preferences saved across sessions
- **CSS Variables**: Dynamic theme switching with Tailwind dark mode
- **Hydration Safe**: Prevents SSR/client mismatch issues

### Internationalization

- **Language Files**: JSON translation files for Spanish/English
- **Dynamic Loading**: Runtime language switching without reload
- **URL Parameters**: Language preference in query parameters
- **Fallback System**: Default language fallback for missing translations

### Performance Optimizations

- **Server-side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Dynamic imports for route-based splitting
- **Caching Strategy**: React Query caching with stale-while-revalidate
- **Pagination**: Efficient handling of large product datasets
- **Memoization**: React.memo for expensive component renders

### Security Features

- **CSRF Protection**: Built-in Next.js security
- **Environment Variables**: Secure configuration management
- **Input Validation**: Zod schemas prevent malicious data
- **JWT Security**: Secure token handling and validation
- **API Rate Limiting**: Protection against abuse (configurable)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoint System**: Tailwind responsive classes
- **Touch Interactions**: Mobile-friendly navigation and controls
- **Progressive Enhancement**: Works without JavaScript

## 🔧 Development Features

- **Hot Reload**: Instant development feedback
- **TypeScript**: Full type safety and IntelliSense
- **Linting**: ESLint configuration for code quality
- **Error Boundaries**: Graceful error handling
- **Development Tools**: React Query DevTools for debugging

This application represents a modern, scalable e-commerce solution with enterprise-grade features and performance optimizations.
