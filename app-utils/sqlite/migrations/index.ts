import { migrate_001_meta } from "./001_meta";
import { migrate_002_auth } from "./002_auth";
import { migrate_003_offline_queue } from "./003_offline_queue";
import { migrate_004_plannings_cache } from "./004_plannings_cache";

export async function runMigrations(): Promise<void> {
  await migrate_001_meta();
  await migrate_002_auth();
  await migrate_003_offline_queue();
  await migrate_004_plannings_cache();
}
