
module.exports = {
  apps: [{
    name: "prometheus-trading-frontend",
    script: "node_modules/serve/bin/serve.js",
    args: "-s dist -l 8080",
    env: {
      NODE_ENV: "production",
      SUPABASE_URL: "https://kaggqumvqjllbvmeaxxx.supabase.co",
      SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZ2dxdW12cWpsbGJ2bWVheHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3NjIsImV4cCI6MjA1NjgxNDc2Mn0.TM-WQHICL8cSKollAaNlCBijx44xHbcddmROShkPu2g"
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "500M"
  }]
};
