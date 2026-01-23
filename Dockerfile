# ===============================
# Builder stage
# ===============================
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Build frontend
RUN npm run build:client

# Build backend
RUN npm run build:server

# ===============================
# Production stage
# ===============================
FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "dist/index.js"]
