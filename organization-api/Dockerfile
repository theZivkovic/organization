# Multi-stage Dockerfile for organization-api (NestJS)

# Builder stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install build deps
COPY package*.json ./
RUN npm install --include=dev --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build

# Runner stage
FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy built app
COPY --from=builder /usr/src/app/dist ./dist

# If you need environment variables, pass them at docker run or via compose
EXPOSE 3000

CMD ["node", "dist/main"]
