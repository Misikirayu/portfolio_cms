require("dotenv").config();

/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: "./lib/db/schema.js",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "portfolio",
  },
};
