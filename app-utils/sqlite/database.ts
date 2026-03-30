import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("app.db");
  }
  return db;
}

export async function query<T = any>(
  sql: string,
  params: SQLite.SQLiteBindParams = []
): Promise<T[]> {
  const database = await getDB();
  return await database.getAllAsync<T>(sql, params);
}

export async function execute(
  sql: string,
  params: SQLite.SQLiteBindParams = []
): Promise<void> {
  const database = await getDB();
  await database.runAsync(sql, params);
}

export async function transaction(
  fn: (tx: SQLite.SQLiteDatabase) => Promise<void>
) {
  const database = await getDB();
  await database.execAsync("BEGIN");
  try {
    await fn(database);
    await database.execAsync("COMMIT");
  } catch (e) {
    await database.execAsync("ROLLBACK");
    throw e;
  }
}
