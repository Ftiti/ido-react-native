import { execute } from "../database";

export async function migrate_002_auth() {
  await execute(`
    CREATE TABLE IF NOT EXISTS auth (
      id INTEGER PRIMARY KEY NOT NULL,
      token TEXT,
      user TEXT
    );
  `);
}
