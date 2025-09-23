#!/bin/bash

# Simple VM Deployment Script for Scholar Hour Manager (No Docker)
echo "🚀 Starting Scholar Hour Manager deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 process manager..."
    sudo npm install -g pm2
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << EOF
MONGODB_URI=mongodb+srv://Lili:Phnt43025471@cluster0.qxli1n7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=8Vj8N4G1RIi8ChHZqAJhf8w8QcnIfT6kz2ZHPzTOu5Y=
AUTH_TRUST_HOST=true
NODE_ENV=production
EOF
    echo "📝 Please edit .env file with your production settings before starting the application."
    echo "   Update NEXTAUTH_URL with your domain or IP address."
    exit 1
fi

# Stop existing PM2 process if it exists
pm2 delete scholar-hour-manager 2>/dev/null || true

# Start the application with PM2
echo "🌟 Starting application with PM2..."
pm2 start npm --name "scholar-hour-manager" -- start

# Save PM2 configuration
pm2 save

# Display status
echo "✅ Deployment completed!"
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "🌐 Your application should be accessible at:"
echo "   http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "   pm2 logs scholar-hour-manager    # View logs"
echo "   pm2 restart scholar-hour-manager # Restart app"
echo "   pm2 stop scholar-hour-manager    # Stop app"
echo "   pm2 monit                        # Monitor resources"
