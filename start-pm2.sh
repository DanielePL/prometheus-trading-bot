
#!/bin/bash

# Build the application
npm run build

# Install serve if not already installed
npm install -g serve

# Start with PM2
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

echo "Application started with PM2. View status with 'pm2 status'"
