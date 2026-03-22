import { useMutation } from "@tanstack/react-query";
import { authFetch } from "@/utils/authFetch";
import { loadAuth } from "@/utils/authStorage";
import { messageFromFastApiDetail } from "@/utils/apiErrorMessage";

function parseResponseBody(response, rawText) {
  if (!rawText) return {};
  try {
    return JSON.parse(rawText);
  } catch {
    return { detail: rawText || response.statusText };
  }
}

function messageFromApiError(response, data) {
  if (typeof data?.detail === "string" && data.detail) return data.detail;
  const fromDetail = messageFromFastApiDetail(data?.detail);
  if (fromDetail) return fromDetail;
  if (typeof data?.message === "string" && data.message) return data.message;
  return `Request failed (${response.status}).`;
}

/**
 * Phone sent to API: 10 digits only by default.
 * Set VITE_PHONE_E164=true in .env if your backend expects +977XXXXXXXXXX (see BACKEND_SETUP.md).
 */
function formatPhoneForApi(digits10) {
  const d = String(digits10 ?? "").replace(/\D/g, "");
  if (d.length !== 10) return d;
  const useE164 = import.meta.env.VITE_PHONE_E164 === "true";
  return useE164 ? `+977${d}` : d;
}

const createDepartmentAdmin = async (payload) => {
  const token = loadAuth()?.access_token;
  if (!token) {
    const error = new Error("Not authenticated.");
    error.status = 401;
    throw error;
  }

  const departmentId = Number(payload.department_id);
  if (Number.isNaN(departmentId) || departmentId < 1) {
    const error = new Error("Please select a valid department.");
    error.status = 400;
    throw error;
  }

  const body = {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    phone_number: formatPhoneForApi(payload.phone_number),
    department_id: departmentId,
  };

  const response = await authFetch("/api/department/add-department-admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  const data = parseResponseBody(response, rawText);

  if (!response.ok) {
    const msg = messageFromApiError(response, data);
    const error = new Error(msg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const useCreateDepartmentAdmin = () => {
  return useMutation({
    mutationFn: createDepartmentAdmin,
  });
};
