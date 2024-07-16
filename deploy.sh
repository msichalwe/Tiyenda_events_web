#!/bin/bash

# Navigate to the project directory
cd /root/projects/Tiyenda_events_web

# Fetch the latest changes from the GitHub repository
git pull origin main

# Install any new dependencies
npm install --legacy-peer-deps

# Build the application
npm run build

# Restart the systemd service
sudo systemctl restart nextjs-app

