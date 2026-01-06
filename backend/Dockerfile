# Dockerfile for the NestJS Backend API
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine AS development
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code and environment files
COPY . .

# Copy environment file
COPY .env* ./

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3062
CMD ["npm", "run", "start:dev"]

FROM node:18-alpine AS production-build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code and environment files
COPY . .

# Copy environment file
COPY .env* ./

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Install wget for healthchecks
RUN apk add --no-cache wget

# Copy built application
COPY --from=production-build /app/node_modules ./node_modules
COPY --from=production-build /app/dist ./dist
COPY --from=production-build /app/prisma ./prisma
COPY --from=production-build /app/package*.json ./
COPY --from=production-build /app/tsconfig*.json ./
COPY --from=production-build /app/scripts ./scripts
COPY --from=production-build /app/db ./db

# Copy environment file
COPY .env* ./

# Create uploads and public directories with proper permissions
RUN mkdir -p uploads public && chown -R node:node uploads public

# Switch to non-root user
USER node

EXPOSE 3062
CMD ["node", "dist/src/main"]