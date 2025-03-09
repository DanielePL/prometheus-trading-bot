
module.exports = {
  apps: [
    {
      name: "prometheus-trading-bot",
      script: "node_modules/serve/bin/serve.js",
      args: "-s dist -l 8080",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    }
  ]
};
