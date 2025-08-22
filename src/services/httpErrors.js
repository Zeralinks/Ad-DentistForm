// Turn DRF errors into readable strings
export function extractError(err) {
  const r = err?.response;
  if (!r) return err?.message || "Network error";
  if (typeof r.data === "string") return r.data;
  if (r.data?.detail) return r.data.detail;
  if (r.data && typeof r.data === "object") {
    return Object.entries(r.data)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" | ");
  }
  return `HTTP ${r.status}`;
}
