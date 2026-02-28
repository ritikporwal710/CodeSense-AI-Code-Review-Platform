import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger";

// Ensure env is loaded before pool creation (this file is imported before index.ts runs dotenv)
dotenv.config();

// Create PostgreSQL connection pool
const isRemote = process.env.DB_HOST?.includes("render.com");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", { error: err.message });
});
pool.on("connect", () => {
  logger.info("Database connection established");
});

export const db = drizzle(pool);

export { pool };

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();

    logger.info("Database connection test successful", {
      timestamp: result.rows[0].now,
      database: process.env.DB_NAME,
    });

    return true;
  } catch (error) {
    logger.error("Database connection test failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
    });
    return false;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info("Database pool has ended");
  } catch (error) {
    logger.error("Error closing database pool", { error });
    throw error;
  }
};
