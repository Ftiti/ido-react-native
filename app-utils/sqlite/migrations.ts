import { execute } from "./database";

export async function runMigrations() {
  // Meta table
  await execute(`
    CREATE TABLE IF NOT EXISTS _meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);

  // Auth table
  await execute(`
    CREATE TABLE IF NOT EXISTS auth (
      id INTEGER PRIMARY KEY NOT NULL,
      token TEXT,
      user TEXT
    );
  `);

  // Example offline table
  await execute(`
    CREATE TABLE IF NOT EXISTS offline_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
}
