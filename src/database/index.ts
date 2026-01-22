import { drizzle } from "drizzle-orm/sqlite-proxy";
import { SQLocalDrizzle } from "sqlocal/drizzle";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const DB_NAME = "context-protector.sqlite3";

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let sqlocalDrizzle: SQLocalDrizzle | null = null;
let isInitialized = false;

export async function initDatabase(): Promise<typeof db> {
  if (isInitialized && db) {
    console.log("Database already initialized");
    return db;
  }

  try {
    console.log("🔄 Initializing database...");

    // ⚠️ 关键修复1: 等待浏览器释放之前的 Access Handle
    // 刷新页面后需要等待旧句柄完全释放
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    sqlocalDrizzle = new SQLocalDrizzle(DB_NAME);

    // ⚠️ 关键修复2: 等待 worker 就绪并处理冲突重试
    let retries = 0;
    const maxRetries = 20;

    while (retries < maxRetries) {
      try {
        await sqlocalDrizzle.sql`SELECT 1`;
        console.log("✅ Worker ready");
        break;
      } catch (e: any) {
        retries++;

        // 检测 Access Handle 冲突
        const isAccessHandleError =
          e.message?.includes("Access Handle") ||
          e.message?.includes("createSyncAccessHandle") ||
          e.message?.includes("NoModificationAllowedError");

        if (isAccessHandleError) {
          console.warn(
            `⚠️ Access Handle 冲突,等待释放... (${retries}/${maxRetries})`,
          );
          // Access Handle 冲突需要更长等待
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (retries >= maxRetries) {
          console.error("❌ 初始化超时");
          throw new Error("数据库初始化超时,请刷新页面重试");
        }
      }
    }

    // 优化设置
    await sqlocalDrizzle.sql`PRAGMA journal_mode = WAL`;
    await sqlocalDrizzle.sql`PRAGMA synchronous = NORMAL`;

    db = drizzle(sqlocalDrizzle.driver, { schema });
    isInitialized = true;

    console.log("✅ Database initialized successfully");
    return db;
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}

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
      CREATE TABLE IF NOT EXISTS debug_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS debug_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES debug_users (id)
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS debug_contexts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    await db.run(
      sql`CREATE INDEX IF NOT EXISTS idx_debug_tasks_user_id ON debug_tasks(user_id)`,
    );
    await db.run(
      sql`CREATE INDEX IF NOT EXISTS idx_debug_contexts_created_at ON debug_contexts(created_at)`,
    );

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS debug_replace_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id TEXT NOT NULL,
        original_match TEXT NOT NULL,
        original_match_type TEXT NOT NULL,
        replaced_with TEXT NOT NULL,
        replaced_with_type TEXT NOT NULL,
        rule_id INTEGER NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS replace_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        note TEXT,
        match_type TEXT NOT NULL,
        match_value TEXT NOT NULL,
        target_value TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);

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

    await db.run(sql`DROP TABLE IF EXISTS debug_replace_history`);
    await db.run(sql`DROP TABLE IF EXISTS debug_contexts`);
    await db.run(sql`DROP TABLE IF EXISTS debug_tasks`);
    await db.run(sql`DROP TABLE IF EXISTS debug_users`);

    console.log("Database reset completed with Drizzle");
    isInitialized = false;
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw error;
  }
}

export function closeDatabase() {
  try {
    if (sqlocalDrizzle) {
      sqlocalDrizzle = null;
      db = null;
      isInitialized = false;
      console.log("✅ Database connection closed");
    }
  } catch (error) {
    console.error("Failed to close database:", error);
  }
}

// ⚠️ 关键修复3: 页面卸载时关闭数据库
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    closeDatabase();
  });

  // 页面隐藏时也关闭(针对移动端)
  window.addEventListener("pagehide", () => {
    closeDatabase();
  });
}
