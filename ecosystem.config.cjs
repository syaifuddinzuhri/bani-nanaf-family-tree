module.exports = {
  apps: [
    {
      name: "family-tree",
      port: "5000",
      exec_mode: "fork", // Karena VPS 1 Core, pakai mode fork saja
      instances: "1",
      script: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        NITRO_PORT: "5000", // Port Nuxt (Nitro)
        NITRO_HOST: "127.0.0.1"
      },
      max_memory_restart: "500M", // Restart otomatis jika memakan RAM > 500MB
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
