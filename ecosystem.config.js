module.exports = {
  apps: [
    {
      script: "muster-server/lib/index.js",
      name: "muster-tools",
      watch: "muster-server/lib/",
      env: {
        NODE_ENV: "development",
        DB_URI: "sqlite:muster-server/data/data_store.sqlite3",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        DB_URI: "sqlite:muster-server/data/data_store.sqlite3",
        PORT: 3000,
      },
    },
  ],
};
