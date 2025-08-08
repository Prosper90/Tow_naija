# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /initialse-script

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g typescript ts-node


# Copy all files from the current directory into the container
# COPY . .

# Default command to run the initialization script
CMD ["npx", "ts-node", "initializeServices.ts"]