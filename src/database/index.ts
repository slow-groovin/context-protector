import { drizzle } from "drizzle-orm/sqlite-proxy";
import { SQLocalDrizzle } from "sqlocal/drizzle";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

// Database configuration
const DB_NAME = "context-protector.sqlite3";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlocalDrizzle: SQLocalDrizzle | null = null;
let isInitialized = false;

/**
 * Initialize database connection
 * Uses OPFS for storage in supported browsers
 */
export async function initDatabase(): Promise<typeof db> {
  if (isInitialized && db) {
    console.log("Database already initialized");
    return db;
  }

  try {
    console.log("Initializing database with SQLocal...");

    // Create SQLocalDrizzle instance with OPFS support
    sqlocalDrizzle = new SQLocalDrizzle(DB_NAME);

    // Enable better performance
    await sqlocalDrizzle.sql`PRAGMA journal_mode = WAL`;
    await sqlocalDrizzle.sql`PRAGMA synchronous = NORMAL`;

    // Create Drizzle instance
    db = drizzle(sqlocalDrizzle.driver, { schema });

    isInitialized = true;
    console.log("Database initialized successfully with OPFS support");

    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

/**
 * Get database instance
 */
export async function getDatabase() {
  if (!db) {
    return await initDatabase();
  }
  return db;
}

/**
 * Run database migrations
 */
export async function runMigrations() {
  try {
    console.log("Running migrations...");

    const db = await getDatabase();
    if (!db) {
      throw new Error("Database not initialized");
    }

    // Create tables using Drizzle run
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS contexts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_contexts_created_at ON contexts(created_at)`);

    console.log("Migrations completed successfully with Drizzle");
  } catch (error) {
    console.error("Failed to run migrations:", error);
    throw error;
  }
}

/**
 * Reset database (for testing)
 */
export async function resetDatabase() {
  try {
    const db = await getDatabase();
    if (!db) {
      throw new Error("Database not initialized");
    }

    await db.run(sql`DROP TABLE IF EXISTS contexts`);
    await db.run(sql`DROP TABLE IF EXISTS tasks`);
    await db.run(sql`DROP TABLE IF EXISTS users`);

    console.log("Database reset completed with Drizzle");
    isInitialized = false;
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw error;
  }
}

/**
 * Close database connection
 */
export function closeDatabase() {
  try {
    if (sqlocalDrizzle) {
      // SQLocal doesn't require explicit closing
      sqlocalDrizzle = null;
      db = null;
      isInitialized = false;
      console.log("Database connection closed");
    }
  } catch (error) {
    console.error("Failed to close database:", error);
  }
}
