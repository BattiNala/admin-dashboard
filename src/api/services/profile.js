import { apiClient } from "@/api/client";

export const getProfile = () => {
  return apiClient.get("/profile/employee");
};
