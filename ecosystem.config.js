module.exports = {
  apps: [
    {
      name: 'scholar-hour-manager',
      script: 'npm',
      args: 'start',
      cwd: '/home/azureuser/scholar_hour_manager',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
        MONGODB_URI: 'mongodb+srv://thantshweyee:thantshweyee123@cluster0.irhm5.mongodb.net/scholar_hour_manager',
        NEXTAUTH_URL: 'http://wad-6632067.eastus2.cloudapp.azure.com/scholar-hour-manager',
        NEXTAUTH_SECRET: 'your-secret-key-here-change-this-in-production'
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      error_file: '/home/azureuser/.pm2/logs/scholar-hour-manager-error.log',
      out_file: '/home/azureuser/.pm2/logs/scholar-hour-manager-out.log',
      log_file: '/home/azureuser/.pm2/logs/scholar-hour-manager-combined.log',
      time: true
    }
  ]
};
