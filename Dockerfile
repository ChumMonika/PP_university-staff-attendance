# Use Node.js 18 Alpine (lightweight)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application code
COPY dist/ ./dist/

# Expose port (adjust if your app uses a different port)
EXPOSE 5000

# Run the app
CMD ["node", "dist/index.js"]