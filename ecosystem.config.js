module.exports = {
  apps: [
    {
      name: 'scholar-hour-manager',
      script: 'npm',
      args: 'start',
      cwd: '/home/azureuser/scholar_hour_manager', // Update this path based on your VM user
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
