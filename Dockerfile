# =============================================================================
# MULTI-STAGE DOCKERFILE
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies required for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# -----------------------------------------------------------------------------
# Stage 2: Dependencies
# -----------------------------------------------------------------------------
FROM base AS dependencies

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts

# -----------------------------------------------------------------------------
# Stage 3: Build
# -----------------------------------------------------------------------------
FROM dependencies AS build

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Prune devDependencies
RUN npm prune --production

# -----------------------------------------------------------------------------
# Stage 4: Development
# -----------------------------------------------------------------------------
FROM base AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Development command with hot reload
CMD ["npm", "run", "dev"]

# -----------------------------------------------------------------------------
# Stage 5: Production
# -----------------------------------------------------------------------------
FROM base AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy production node_modules from build stage
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Copy other necessary files
COPY --chown=nodejs:nodejs tsconfig.json ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/server.js"]

# -----------------------------------------------------------------------------
# Labels
# -----------------------------------------------------------------------------
LABEL org.opencontainers.image.title="Anclora WhatsApp Integration"
LABEL org.opencontainers.image.description="Luxury real estate WhatsApp automation"
LABEL org.opencontainers.image.vendor="Anclora Private Estates"
LABEL org.opencontainers.image.licenses="Proprietary"
LABEL org.opencontainers.image.source="https://github.com/anclora/whatsapp-integration"
