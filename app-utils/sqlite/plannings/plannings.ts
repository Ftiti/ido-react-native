import { execute, query } from "../index";

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export function buildPlanningsCacheKey(
  userId: number,
  companyId: number | null,
  date: string,
): string {
  return `plannings:${userId}:${companyId}:${date}`;
}

export async function savePlanningsToSQLite(
  cacheKey: string,
  data: any[],
): Promise<void> {
  await execute(
    `INSERT INTO plannings_cache (cache_key, data, cached_at)
     VALUES (?, ?, ?)
     ON CONFLICT(cache_key) DO UPDATE SET
       data = excluded.data,
       cached_at = excluded.cached_at`,
    [cacheKey, JSON.stringify(data), Date.now()],
  );
}

export async function getPlanningsFromSQLite(
  cacheKey: string,
): Promise<any[] | null> {
  const rows = await query<{ data: string; cached_at: number }>(
    `SELECT data, cached_at FROM plannings_cache WHERE cache_key = ? LIMIT 1`,
    [cacheKey],
  );

  if (!rows.length) return null;

  const { data, cached_at } = rows[0];

  if (Date.now() - cached_at > CACHE_TTL_MS) return null;

  return JSON.parse(data);
}

export async function clearPlanningsCache(): Promise<void> {
  await execute(`DELETE FROM plannings_cache`);
}
