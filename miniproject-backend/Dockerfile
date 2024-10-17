# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application to the container
# ignore the node_modules folder
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Command to run your app
CMD ["node", "index.js"]

