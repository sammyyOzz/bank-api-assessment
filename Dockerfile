# Use the official Node.js 22.x base image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install both production and development dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your application will run (replace 5000 with your desired port)
EXPOSE 5000

# Start the application in development mode with nodemon for live reloading
CMD ["yarn", "dev"]
