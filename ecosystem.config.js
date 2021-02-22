
module.exports = {
  apps : [{
    name: 'Data-Upload-Server',
    script: 'server.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch : ["public/*","node_modules"],
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};

