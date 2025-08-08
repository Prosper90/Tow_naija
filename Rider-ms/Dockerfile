FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create empty dist directory
RUN mkdir -p dist

# Install TypeScript globally
RUN npm install -g typescript

# Build the app
RUN npm run build

# Set production environment
ENV NODE_ENV=production
EXPOSE 3002

CMD ["npm", "start"]