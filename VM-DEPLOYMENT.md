# VM Deployment Guide for Scholar Hour Manager (No Docker)

## Prerequisites on VM
1. Install Node.js 18+ 
2. Install Git
3. Install PM2 (for process management)
4. Ensure ports 3000 and 80/443 are open

## Step 1: Prepare Your VM

### Install Node.js (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## Step 2: Upload Your Code to VM

### Option A: Using SCP (if you have the files locally)
```bash
# From your local machine
scp -r scholar-hour-manager/ user@your-vm-ip:/home/user/
```

### Option B: Using Git (recommended)
```bash
# On your VM
cd /home/user
git clone https://github.com/PwintHmonNathar18/scholar_hour_manager.git
cd scholar_hour_manager
```

## Step 3: Set up Environment Variables

### Create production environment file
```bash
# Create .env file on your VM
nano .env
```

Add this content (update NEXTAUTH_URL with your domain/IP):
```bash
MONGODB_URI=mongodb+srv://Lili:Phnt43025471@cluster0.qxli1n7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=http://your-vm-ip:3000
NEXTAUTH_SECRET=8Vj8N4G1RIi8ChHZqAJhf8w8QcnIfT6kz2ZHPzTOu5Y=
AUTH_TRUST_HOST=true
NODE_ENV=production
```

**Important**: Replace `your-vm-ip` with your actual VM IP address or domain name.

## Step 4: Install and Build

```bash
# Install dependencies
npm ci --only=production

# Build the application
npm run build
```

## Step 5: Start the Application

### Option A: Simple start (for testing)
```bash
npm start
```

### Option B: PM2 (recommended for production)
```bash
# Start with PM2
pm2 start npm --name "scholar-hour-manager" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above

# Check status
pm2 status
```

## Step 6: Set up Nginx Reverse Proxy (Optional but Recommended)

### Install Nginx
```bash
sudo apt install nginx
```

### Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/scholar-hour-manager
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com your-vm-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/scholar-hour-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # If accessing directly without nginx
sudo ufw enable
```

## Step 8: SSL Certificate (Optional but Recommended)

### Using Certbot for Let's Encrypt (if you have a domain)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Monitoring and Maintenance

### Check Application Status
```bash
# Check if app is running
curl http://localhost:3000

# Check PM2 status
pm2 status
pm2 logs scholar-hour-manager

# Restart application
pm2 restart scholar-hour-manager
```

### View Logs
```bash
# PM2 logs
pm2 logs scholar-hour-manager --lines 100

# Nginx logs (if using nginx)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Application Updates
```bash
# Pull latest code (if using git)
git pull origin main

# Rebuild application
npm run build

# Restart with PM2
pm2 restart scholar-hour-manager
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Find what's using the port
   sudo lsof -i :3000
   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Database connection failed**
   - Check MONGODB_URI in .env file
   - Ensure MongoDB Atlas allows connections from your VM IP

3. **Authentication errors**
   - Verify NEXTAUTH_SECRET and NEXTAUTH_URL are correct
   - Clear browser cookies and try again

4. **Permission denied**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER /home/user/scholar_hour_manager
   chmod +x deploy.sh
   ```

5. **Application crashes**
   ```bash
   # Check PM2 logs
   pm2 logs scholar-hour-manager
   
   # Restart application
   pm2 restart scholar-hour-manager
   ```

### Environment Variables Check
```bash
# Check if environment variables are loaded
cat .env
```

### Health Check Script
Create a simple health check:
```bash
#!/bin/bash
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ $response -eq 200 ]; then
    echo "Application is healthy"
else
    echo "Application is down, restarting..."
    pm2 restart scholar-hour-manager
fi
```

## Security Best Practices

1. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. **Use SSH keys instead of passwords**

3. **Change default SSH port** (optional):
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Change Port 22 to something else
   sudo systemctl restart ssh
   ```

4. **Regular backups of your application and database**

5. **Monitor resource usage**:
   ```bash
   htop
   df -h
   free -h
   ```

## Quick Deployment Summary

```bash
# 1. On your VM - Install prerequisites
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2

# 2. Upload your code
git clone https://github.com/PwintHmonNathar18/scholar_hour_manager.git
cd scholar_hour_manager

# 3. Set up environment
nano .env  # Add your environment variables

# 4. Build and start
npm ci --only=production
npm run build
pm2 start npm --name "scholar-hour-manager" -- start
pm2 save
pm2 startup

# 5. Configure nginx (optional)
sudo nano /etc/nginx/sites-available/scholar-hour-manager
sudo ln -s /etc/nginx/sites-available/scholar-hour-manager /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

Your Scholar Hour Manager will be accessible at `http://your-vm-ip:3000` or `http://your-vm-ip` if using nginx!
