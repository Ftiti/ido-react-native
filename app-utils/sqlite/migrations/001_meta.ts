import { execute } from "../database";

export async function migrate_001_meta() {
  await execute(`
    CREATE TABLE IF NOT EXISTS _meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
}
