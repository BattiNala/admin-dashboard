// Centralized backend error normalization helpers.

export const messageFromFastApiDetail = (detail) => {
  if (detail == null) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => (typeof item === "string" ? item : item?.msg || ""))
      .filter(Boolean)
      .join(" ");
  }
  if (typeof detail === "object" && detail.msg) return detail.msg;
  return "";
};

export const parseBackendError = (data) => {
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((err) => `${err.loc?.join(".")}: ${err.msg}`)
      .join(", ");
  }
  return data?.detail || data?.message || "Request failed";
};
