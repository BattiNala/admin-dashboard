import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/utils/authFetch";
import { loadAuth } from "@/utils/authStorage";

const fetchRoles = async () => {
  const token = loadAuth()?.access_token;
  if (!token) {
    const error = new Error("Not authenticated.");
    error.status = 401;
    throw error;
  }

  const response = await authFetch("/api/role/list-roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to load roles.");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const useListRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
};
