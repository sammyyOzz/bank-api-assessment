# Use the official Node.js 22.x base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy tsconfig and source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to JavaScript
RUN yarn build

# Remove devDependencies after build
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Expose the port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]