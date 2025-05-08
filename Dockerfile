# Use Node.js as base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm ci for cleaner, more reliable builds
RUN npm ci && \
    # Fix vulnerabilities where possible
    npm audit fix || true && \
    # Update nth-check to fix CVE-2021-3803
    npm install nth-check@2.0.1 --save && \
    # Clean npm cache to remove any private keys
    npm cache clean --force

# Copy source code
COPY . .

# Expose port for development server
EXPOSE 3000

# Start development server
CMD ["npm", "start"]