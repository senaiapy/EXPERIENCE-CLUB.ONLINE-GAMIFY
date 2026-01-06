# Dockerfile for the Next.js Admin App
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set environment variables from build args (must be BEFORE build)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_IMAGE_BASE_URL
ARG NEXT_PUBLIC_JWT_EXPIRATION
ARG NEXT_PUBLIC_ADMIN_MODE

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_IMAGE_BASE_URL=$NEXT_PUBLIC_IMAGE_BASE_URL
ENV NEXT_PUBLIC_JWT_EXPIRATION=$NEXT_PUBLIC_JWT_EXPIRATION
ENV NEXT_PUBLIC_ADMIN_MODE=$NEXT_PUBLIC_ADMIN_MODE
ENV NEXT_TELEMETRY_DISABLED=1

# Copy environment file AFTER setting ENV (build args take precedence)
COPY .env.deploy ./.env.production

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app

# Install system dependencies for sharp
RUN apk add --no-cache \
    wget \
    libc6-compat \
    libstdc++

# Set NODE_ENV
ENV NODE_ENV=production

# Copy package files for sharp installation
COPY package*.json ./

# Install sharp for image optimization in production
RUN npm install --omit=dev sharp

# Copy standalone output (includes minimal node_modules and server)
COPY --from=builder /app/.next/standalone ./
# Copy static files and public assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3061

# Run the standalone server directly (no npm needed)
CMD ["node", "server.js"]
