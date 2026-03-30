import { execute } from "../database";

export async function migrate_004_plannings_cache() {
  await execute(`
    CREATE TABLE IF NOT EXISTS plannings_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cache_key TEXT NOT NULL UNIQUE,
      data TEXT NOT NULL,
      cached_at INTEGER NOT NULL
    );
  `);

  await execute(`
    CREATE INDEX IF NOT EXISTS idx_plannings_cache_key
    ON plannings_cache(cache_key);
  `);
}
