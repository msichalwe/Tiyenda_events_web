#!/bin/bash

# Navigate to the project directory
cd /root/projects/Tiyenda_events_web

# Ensure the production service is stopped
echo "Stopping the production service if it's running..."
sudo systemctl stop nextjs-app

# Fetch the latest changes from the GitHub repository
echo "Pulling the latest changes from the repository..."
git pull origin main

# Install any new dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "Building the application..."
npm run build

# Stop the production service if it's still running
echo "Ensuring the production service is stopped..."
sudo systemctl stop nextjs-app

# Start the development service
echo "Starting the development service..."
sudo systemctl start nextjs-dev

echo "Deployment to development environment completed successfully!"
