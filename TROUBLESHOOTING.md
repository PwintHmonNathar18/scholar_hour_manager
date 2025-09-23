# Troubleshooting Guide for VM Deployment

## Current Issues and Solutions

### Issue 1: Multiple Lockfiles Warning
**Problem**: Next.js detects multiple package-lock.json files
**Solution**: 
```bash
# Remove the conflicting lockfile
rm -f /home/azureuser/package-lock.json
```

### Issue 2: Wrong Port Access
**Problem**: App runs on port 4000/3000 but accessed without port
**Solution**: Set up Nginx reverse proxy to handle port 80

### Issue 3: Application Not Accessible from Internet
**Problem**: Can't access http://wad-6632067.eastus2.cloudapp.azure.com
**Root Causes**:
1. App running on wrong port (4000 instead of 3000)
2. No reverse proxy setup
3. Firewall blocking connections
4. NEXTAUTH_URL misconfigured

## Quick Fix Commands

### On Your VM, run these commands in order:

```bash
# 1. Navigate to your app directory
cd /home/azureuser/scholar_hour_manager

# 2. Remove conflicting lockfile
rm -f /home/azureuser/package-lock.json

# 3. Set up proper environment
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://Lili:Phnt43025471@cluster0.qxli1n7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=http://wad-6632067.eastus2.cloudapp.azure.com
NEXTAUTH_SECRET=8Vj8N4G1RIi8ChHZqAJhf8w8QcnIfT6kz2ZHPzTOu5Y=
AUTH_TRUST_HOST=true
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
EOF

# 4. Stop any running processes
pm2 delete scholar-hour-manager 2>/dev/null || true
pkill -f "next" || true

# 5. Rebuild and start on correct port
npm run build
PORT=3000 pm2 start npm --name "scholar-hour-manager" -- start

# 6. Install and configure Nginx
sudo apt install -y nginx

# 7. Create Nginx configuration
sudo tee /etc/nginx/sites-available/scholar-hour-manager > /dev/null << 'EOF'
server {
    listen 80;
    server_name wad-6632067.eastus2.cloudapp.azure.com;

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
EOF

# 8. Enable the site
sudo ln -sf /etc/nginx/sites-available/scholar-hour-manager /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 9. Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 10. Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# 11. Save PM2 configuration
pm2 save
```

## Verification Commands

```bash
# Check if Next.js app is running
curl http://localhost:3000

# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check if site is accessible externally
curl -I http://wad-6632067.eastus2.cloudapp.azure.com

# View logs if there are issues
pm2 logs scholar-hour-manager
sudo tail -f /var/log/nginx/error.log
```

## Alternative: Simple Port-based Access

If you just want to test quickly without Nginx:

```bash
# Make sure your app runs on port 80 (requires sudo)
sudo PORT=80 pm2 start npm --name "scholar-hour-manager" -- start

# Or use port 3000 and access via:
# http://wad-6632067.eastus2.cloudapp.azure.com:3000
```

## Common Error Messages and Solutions

### "EADDRINUSE: address already in use"
```bash
# Find what's using the port
sudo lsof -i :3000
# Kill the process
sudo kill -9 <PID>
```

### "502 Bad Gateway" from Nginx
```bash
# Check if Next.js app is actually running
pm2 status
# Restart the app
pm2 restart scholar-hour-manager
```

### "Connection refused"
```bash
# Check firewall settings
sudo ufw status
# Make sure ports are open
sudo ufw allow 80
```

### NextAuth CSRF errors
- Make sure NEXTAUTH_URL matches exactly: `http://wad-6632067.eastus2.cloudapp.azure.com`
- Clear browser cookies and try again

## Expected Working State

When everything is working correctly:

1. PM2 shows `scholar-hour-manager` as `online`
2. `curl http://localhost:3000` returns HTML
3. Nginx is `active (running)`
4. `curl http://wad-6632067.eastus2.cloudapp.azure.com` returns HTML
5. You can access the login page in your browser

## Still Not Working?

Run the automated deployment script:
```bash
# Use the deployment script we created
./deploy-vm.sh
```

Or contact support with these diagnostic outputs:
```bash
pm2 status
sudo systemctl status nginx
sudo ufw status
curl -v http://localhost:3000
netstat -tlnp | grep :80
```
