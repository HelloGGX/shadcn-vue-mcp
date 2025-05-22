FROM node:22.14.0-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install pnpm and dependencies
RUN npm install

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

# Command will be provided by smithery.yaml
CMD ["node", "dist/index.js"] 