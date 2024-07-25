#!/bin/bash

# Navigate to the project directory
cd /root/projects/Tiyenda_events_web

# Ensure the development service is stopped
echo "Stopping the development service if it's running..."
sudo systemctl stop nextjs-dev

# Fetch the latest changes from the GitHub repository
echo "Pulling the latest changes from the repository..."
git pull origin main

# Install any new dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "Building the application..."
npm run build

# Stop the development service if it's still running
echo "Ensuring the development service is stopped..."
sudo systemctl stop nextjs-dev

# Start the production service
echo "Starting the production service..."
sudo systemctl start nextjs-app

echo "Deployment to production environment completed successfully!"

