# Multi-stage Dockerfile for the organization seeder (TypeScript console app)

# Builder stage: install dev deps and compile TypeScript
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install dev dependencies needed for build
COPY package*.json ./
RUN npm install --include=dev --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# Runner stage: small runtime image with only production deps and compiled output
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy compiled output from builder
COPY --from=builder /usr/src/app/dist ./dist

# If the seeder needs env vars (e.g. MONGO_URL), pass them at runtime
CMD ["node", "dist/index.js"]
