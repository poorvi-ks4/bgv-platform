module.exports = {
  apps: [
    {
      name: 'bgv-platform-server',
      script: './src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
