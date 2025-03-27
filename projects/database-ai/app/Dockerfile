# Use the Node.js LTS image
FROM node:latest

ADD cert.crt /usr/local/share/ca-certificates/cert.crt
RUN update-ca-certificates

RUN npm config set cafile /usr/local/share/ca-certificates/cert.crt

# Set the working directory
WORKDIR /.

# Copy only package.json and package-lock.json first for caching
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the default Vite port (change if needed)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
