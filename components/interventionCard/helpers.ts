export const getPointingStatus = (
  pointing_internal: any,
): "finished" | "started" | "not_started" => {
  if (!pointing_internal || pointing_internal.length === 0)
    return "not_started";
  const p = pointing_internal[0];
  if (p.finished_on) return "finished";
  if (p.started_on) return "started";
  return "not_started";
};

export const isValidUrl = (url: any): boolean =>
  !!url && String(url).startsWith("http");

export const parseTime = (iso: any): string => {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
