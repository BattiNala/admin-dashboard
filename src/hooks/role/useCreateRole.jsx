import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/utils/authFetch";
import { loadAuth } from "@/utils/authStorage";

const createRole = async ({ role_name }) => {
  const token = loadAuth()?.access_token;
  if (!token) {
    const error = new Error("Not authenticated.");
    error.status = 401;
    throw error;
  }

  const response = await authFetch("/api/role/create-role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_name }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to create role.");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
