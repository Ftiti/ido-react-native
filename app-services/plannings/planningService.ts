import { api } from "@/app-services/api";
import { PlanningsApiResponse } from "./types";

export function buildDateTimestamp(date: string): number {
  return Math.floor(new Date(date).getTime() / 1000);
}

export async function fetchPlannings(
  date: string,
  type?: string,
): Promise<PlanningsApiResponse> {
  const timestamp = buildDateTimestamp(date);
  const params: Record<string, string | number> = { date: timestamp };
  if (type) params.type = type;

  const response = await api.get<PlanningsApiResponse>("/plannings", {
    params,
  });

  return response.data;
}
