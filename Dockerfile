# --- Stage 1: Build Image (Uses Node.js and pnpm to build the static assets) ---
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy lockfile and package.json to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install dependencies
# Use --frozen-lockfile for reliable CI builds
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code and perform the production build
COPY . .
RUN pnpm run build

# --- Stage 2: Production Runtime Image (Lean and secure environment) ---
FROM node:22-alpine

# Security: Create and switch to a non-root user
RUN npm install -g serve # Install the static file server
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
USER appuser
WORKDIR /app

# Copy only the built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the standard web port
EXPOSE 3000

# Start the application using the 'serve' package
# '-s' serves files from the specified directory (dist) and '-p' sets the port
CMD ["serve", "-s", "dist", "-p", "3000"]