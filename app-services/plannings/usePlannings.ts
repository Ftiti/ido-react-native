import { fetchPlannings } from "@/app-services/plannings/planningService";
import { Planning } from "@/app-services/plannings/types";
import { useAuthStore } from "@/app-states/auth/AuthStore";
import {
  buildPlanningsCacheKey,
  getPlanningsFromSQLite,
  savePlanningsToSQLite,
} from "@/app-utils/sqlite/plannings/plannings";
import { useQuery } from "@tanstack/react-query";

export function usePlannings(date: string) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const cacheKey = buildPlanningsCacheKey(
    user?.id ?? 0,
    null, // add company_id to User type if needed
    date,
  );

  return useQuery<Planning[]>({
    queryKey: ["plannings", user?.id, date],
    enabled: !!token, // ← won't fire until token is available
    queryFn: async () => {
      try {
        // Try API first
        const data = await fetchPlannings(date);

        // Persist to SQLite on success
        await savePlanningsToSQLite(cacheKey, data);

        return data;
      } catch (error) {
        // Offline fallback — read from SQLite
        const cached = await getPlanningsFromSQLite(cacheKey);
        if (cached) return cached;

        // Nothing available
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 min — don't refetch if fresh
    gcTime: 1000 * 60 * 60, // 1 hour in memory
    retry: 1,
    placeholderData: (prev) => prev, // keep previous date data while loading new
  });
}
