import { apiClient } from "@/api/client";

export const listRoles = () => {
  return apiClient.get("/role/list-roles");
};

export const createRole = (payload) => {
  return apiClient.post("/role/create-role", payload);
};
