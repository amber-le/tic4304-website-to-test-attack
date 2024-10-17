# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if using Yarn) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the app for production
RUN npm run build

# Use an NGINX image to serve the static files
FROM nginx:alpine

# Copy the build folder to NGINX's HTML directory
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port on which NGINX will serve the app
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]

