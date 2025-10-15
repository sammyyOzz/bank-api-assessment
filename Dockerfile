# Use the official Node.js 22.x base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production=false

# Copy the rest of the application code
COPY . .

# Build TypeScript
RUN yarn build

# Remove dev dependencies
RUN yarn install --frozen-lockfile --production=true && yarn cache clean

# Expose the port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]