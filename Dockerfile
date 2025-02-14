# Use Node.js LTS (Latest LTS version)
FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install required type definitions
RUN npm install --save-dev @types/node-fetch @types/uuid

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Set environment variables for the server
ENV PORT=8080
ENV HOST=0.0.0.0
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
