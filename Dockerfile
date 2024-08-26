# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy app files
COPY . .

# Build the NestJS app
RUN npm run build

# Start the NestJS app
CMD ["npm", "run", "start:prod"]

# Expose the port the app runs on
EXPOSE 3300
