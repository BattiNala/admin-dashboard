/**
 * Normalize FastAPI `detail` (string | validation object[]) for display.
 */
export function messageFromFastApiDetail(detail) {
  if (detail == null) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d === "string" ? d : d?.msg || ""))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof detail === "object" && detail.msg) return detail.msg;
  return "";
}
