import { apiClient } from "@/api/client";

export const loginUser = ({ username, password }) => {
  return apiClient.post("/auth/login", { username, password });
};
