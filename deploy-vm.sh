#!/bin/bash

# VM Deployment Script for Scholar Hour Manager
# Run this script on your Azure VM to set up the application

set -e  # Exit on any error

echo "🚀 Scholar Hour Manager VM Deployment Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/azureuser/scholar_hour_manager"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
SERVICE_NAME="scholar-hour-manager"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as correct user
if [ "$USER" != "azureuser" ]; then
    print_error "This script should be run as azureuser"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Clean up any existing lockfiles that might cause issues
print_status "Cleaning up lockfiles..."
cd "$APP_DIR"
if [ -f "/home/azureuser/package-lock.json" ]; then
    print_warning "Removing conflicting lockfile at /home/azureuser/package-lock.json"
    rm -f /home/azureuser/package-lock.json
fi

# Step 2: Set up environment variables
print_status "Setting up environment variables..."
if [ ! -f ".env" ]; then
    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env
        print_status "Created .env from template"
        print_warning "Please edit .env file to update NEXTAUTH_URL and other settings if needed"
    else
        print_error ".env.production.example not found. Creating basic .env..."
        cat > .env << EOF
MONGODB_URI=mongodb+srv://Lili:Phnt43025471@cluster0.qxli1n7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=http://wad-6632067.eastus2.cloudapp.azure.com/scholar-hour-manager
NEXTAUTH_SECRET=8Vj8N4G1RIi8ChHZqAJhf8w8QcnIfT6kz2ZHPzTOu5Y=
AUTH_TRUST_HOST=true
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
EOF
    fi
else
    print_status ".env file already exists"
fi

# Step 3: Install dependencies and build
print_status "Installing dependencies..."
npm ci --only=production --silent

print_status "Building application..."
npm run build

# Step 4: Set up PM2
print_status "Setting up PM2 process manager..."

# Stop existing PM2 process if running
pm2 delete $SERVICE_NAME 2>/dev/null || true

# Start the application with PM2
pm2 start npm --name $SERVICE_NAME -- start
pm2 save

# Set up PM2 to start on boot (if not already done)
if ! pm2 startup | grep -q "already configured"; then
    print_status "Configuring PM2 startup..."
    pm2 startup systemd -u azureuser --hp /home/azureuser
fi

# Step 5: Set up Nginx
print_status "Setting up Nginx reverse proxy..."

# Install nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Copy nginx configuration
if [ -f "nginx.conf" ]; then
    sudo cp nginx.conf $NGINX_SITES_AVAILABLE/$SERVICE_NAME
    
    # Enable the site
    sudo ln -sf $NGINX_SITES_AVAILABLE/$SERVICE_NAME $NGINX_SITES_ENABLED/
    
    # Remove default nginx site if it exists
    sudo rm -f $NGINX_SITES_ENABLED/default
    
    # Test nginx configuration
    if sudo nginx -t; then
        print_status "Nginx configuration is valid"
        sudo systemctl restart nginx
        sudo systemctl enable nginx
    else
        print_error "Nginx configuration is invalid"
        exit 1
    fi
else
    print_warning "nginx.conf not found. Skipping nginx setup."
fi

# Step 6: Set up firewall
print_status "Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Step 7: Health check
print_status "Performing health check..."
sleep 5

# Check if PM2 process is running
if pm2 list | grep -q $SERVICE_NAME; then
    print_status "PM2 process is running"
else
    print_error "PM2 process failed to start"
    pm2 logs $SERVICE_NAME --lines 20
    exit 1
fi

# Check if application is responding
if curl -f -s http://localhost:3000 > /dev/null; then
    print_status "Application is responding on port 3000"
else
    print_warning "Application may not be responding yet. Check logs with: pm2 logs $SERVICE_NAME"
fi

# Check if Nginx is running
if sudo systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
else
    print_warning "Nginx is not running"
fi

# Final status
echo ""
echo "============================================="
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo "============================================="
echo ""
echo "📋 Deployment Summary:"
echo "• Application: Running on port 3000 via PM2"
echo "• Web Server: Nginx reverse proxy on port 80"
echo "• Access URL: http://wad-6632067.eastus2.cloudapp.azure.com"
echo ""
echo "🔧 Useful Commands:"
echo "• Check app status: pm2 status"
echo "• View app logs: pm2 logs $SERVICE_NAME"
echo "• Restart app: pm2 restart $SERVICE_NAME"
echo "• Check nginx status: sudo systemctl status nginx"
echo "• View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "🌐 Your Scholar Hour Manager should now be accessible at:"
echo "   http://wad-6632067.eastus2.cloudapp.azure.com/scholar-hour-manager"
echo ""

# Show current status
echo "Current PM2 Status:"
pm2 status

echo "Current Nginx Status:"
sudo systemctl status nginx --no-pager -l
