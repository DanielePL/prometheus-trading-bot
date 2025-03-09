
#!/bin/bash

echo "Starting deployment process for Prometheus Trading Bot..."

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop any running instances
echo "Stopping any running instances..."
pm2 stop all

# Delete the previous processes
echo "Cleaning up previous processes..."
pm2 delete all

# Start with PM2
echo "Starting application with PM2..."
pm2 start ecosystem.config.cjs

# Save PM2 configuration
echo "Saving PM2 configuration..."
pm2 save

# Setup PM2 to start on system boot (requires sudo rights)
echo "Setting up PM2 to start on system boot..."
pm2 startup

echo "Application deployed successfully with PM2!"
echo "Monitor status with: pm2 status"
echo "View logs with: pm2 logs"
echo "Access the dashboard at http://localhost:5000"

