FROM node:22-bookworm-slim

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

# Install git for dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN NODE_OPTIONS=--max-old-space-size=8192 pnpm run build

# Verify build output
RUN ls -la build/ && ls -la build/server/ || echo "Build failed - no output"

# Set environment
ENV NODE_ENV=production
ENV PORT=5173
ENV HOST=0.0.0.0

EXPOSE 5173

# Start with custom server
CMD ["node", "server.js"]
