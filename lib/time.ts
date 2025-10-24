// lib/time.ts
export function userTimeZone(profileTz?: string) {
  return profileTz || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
export function fmtDateTime(dt: Date | number | string, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
    timeZone: tz,
  }).format(typeof dt === "string" || typeof dt === "number" ? new Date(dt) : dt);
}
