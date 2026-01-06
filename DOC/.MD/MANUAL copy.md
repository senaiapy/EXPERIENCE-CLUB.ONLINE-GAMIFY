# Experience Club - Deployment & Setup Manual

This manual provides comprehensive instructions for setting up, running, and deploying the Experience Club e-commerce application.

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or later) - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **PM2** (for production deployment) - Install globally with `npm install -g pm2`

## 🚀 Quick Start Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clubdeofertas.online.git
cd clubdeofertas.online
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NextAuth
- TanStack React Query
- Zustand
- Axios
- Zod
- React i18next

### 3. Environment Configuration

Create your environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-for-development-only

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database (when you add one)
DATABASE_URL=your-database-connection-string
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Development Commands

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production version |
| `npm run start` | Start production server on port 3052 |
| `npm run deploy-local` | Deploy with PM2 as "romapy-app" |
| `npm run lint` | Run ESLint for code quality |

### Development Workflow

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Run Linting** (recommended before commits):
   ```bash
   npm run lint
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Test Production Build Locally**:
   ```bash
   npm run start
   ```

## 🌐 Production Deployment

### Local Production Deployment with PM2

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Deploy with PM2**:
   ```bash
   npm run deploy-local
   ```

This starts the application as a PM2 process named "romapy-app" on port 3052.

### PM2 Management Commands

```bash
# View running processes
pm2 list

# Monitor logs
pm2 logs romapy-app

# Restart the application
pm2 restart romapy-app

# Stop the application
pm2 stop romapy-app

# Delete the process
pm2 delete romapy-app

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

### Server Deployment (VPS/Cloud)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

#### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-username/clubdeofertas.online.git
cd clubdeofertas.online

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.local
# Edit .env.local with production values

# Build application
npm run build

# Start with PM2
npm run deploy-local
```

#### 3. Nginx Configuration (Optional)

Create Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/clubdeofertas
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3052;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/clubdeofertas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Environment Variables Guide

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXTAUTH_URL` | Base URL for NextAuth | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption | `your-secret-key` |
| `NEXT_PUBLIC_API_URL` | Public API base URL | `http://localhost:3000/api` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | From Google Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | From Google Console |
| `DATABASE_URL` | Database connection string | `postgresql://...` |

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your `.env.local`

## 📂 Project Structure & Key Files

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

### Critical Files for Deployment

- `package.json` - Dependencies and scripts
- `.env.local` - Environment configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `products.json` - Main product data

### Data Files

- `products.json` - Primary product dataset
- `products.csv` - CSV backup of products
- `products_with_spacing_issues.csv` - Alternative CSV format
- `/public/images/` - Product images
- `/public/images_marcas/` - Brand images

## 🔍 Troubleshooting

### Common Issues & Solutions

#### Development Server Won't Start

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Build Fails

```bash
# Check for TypeScript errors
npm run lint

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### PM2 Process Issues

```bash
# Check PM2 status
pm2 list

# View logs for errors
pm2 logs romapy-app

# Restart process
pm2 restart romapy-app
```

#### Authentication Not Working

1. Check `NEXTAUTH_SECRET` is set
2. Verify `NEXTAUTH_URL` matches your domain
3. Ensure Google OAuth credentials are correct
4. Check redirect URIs in Google Console

#### Theme/Language Toggle Not Working

1. Clear browser cache and localStorage
2. Check browser console for JavaScript errors
3. Verify hydration by refreshing the page

### Performance Optimization

#### For Large Product Datasets

1. **Enable Pagination**: Products are automatically paginated
2. **Optimize Images**: Use Next.js Image component (already implemented)
3. **Database Integration**: Consider moving from JSON to database for >10k products
4. **CDN**: Use CDN for static assets in production

#### Memory Management

```bash
# Monitor memory usage
pm2 monit

# Increase Node.js memory limit if needed
NODE_OPTIONS="--max_old_space_size=4096" npm run start
```

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check application status
curl http://localhost:3052

# PM2 process monitoring
pm2 monit

# System resources
htop
```

### Log Management

```bash
# PM2 logs
pm2 logs romapy-app --lines 100

# Nginx logs (if using)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Strategy

1. **Code**: Use Git for version control
2. **Data**: Regular backup of `products.json` and image files
3. **Environment**: Secure backup of `.env.local` (without exposing secrets)

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes without errors
- [ ] All features tested in production build
- [ ] Database connections tested (if applicable)
- [ ] SSL certificates configured (for HTTPS)

### Post-Deployment

- [ ] Application accessible via domain/IP
- [ ] Authentication working correctly
- [ ] Theme switching functional
- [ ] Language switching functional
- [ ] Product search and filtering working
- [ ] PM2 process monitoring setup
- [ ] Nginx configuration tested (if applicable)
- [ ] Backup strategy implemented

## 🆘 Support & Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### Common URLs

- **Development**: http://localhost:3000
- **Production (PM2)**: http://localhost:3052
- **Health Check**: http://your-domain.com/api/health (if implemented)

### Emergency Procedures

#### Application Down

```bash
# Check PM2 status
pm2 list

# Restart application
pm2 restart romapy-app

# If restart fails, stop and start
pm2 stop romapy-app
pm2 start npm --name "romapy-app" -- start
```

#### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart to clear memory
pm2 restart romapy-app

# Scale if needed (multiple instances)
pm2 scale romapy-app 2
```

This manual covers all essential aspects of deploying and managing the Experience Club application. Keep this documentation updated as the application evolves.