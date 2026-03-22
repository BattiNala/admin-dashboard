import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/utils/authFetch";
import { loadAuth } from "@/utils/authStorage";

const fetchDepartments = async () => {
  const token = loadAuth()?.access_token;
  if (!token) {
    const err = new Error("Not authenticated.");
    err.status = 401;
    throw err;
  }

  const response = await authFetch("/api/department/list-departments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.detail || data?.message || "Failed to load departments.");
    error.status = response.status;
    throw error;
  }

  return Array.isArray(data?.departments) ? data.departments : [];
};

export const useListDepartments = (options = {}) => {
  return useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime: 60 * 1000,
    ...options,
  });
};
