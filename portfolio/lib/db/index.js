const mysql = require("mysql2/promise");
const { drizzle } = require("drizzle-orm/mysql2");
const schema = require("./schema");

// Reuse the pool across hot reloads / serverless invocations.
const globalForDb = globalThis;

const pool =
  globalForDb.__mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "portfolio",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
  });

if (!globalForDb.__mysqlPool) {
  globalForDb.__mysqlPool = pool;
}

const db = drizzle(pool, { schema, mode: "default" });

module.exports = { db, pool, schema };
