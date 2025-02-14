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

# Expose the port your app runs on
ENV PORT=3000
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
