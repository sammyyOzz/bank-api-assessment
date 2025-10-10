# Use the official Node.js 18.x base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install both production and development dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which your application will run (replace 3000 with your desired port)
EXPOSE 3000

# Start the application in development mode with nodemon for live reloading
CMD ["yarn", "dev"]
