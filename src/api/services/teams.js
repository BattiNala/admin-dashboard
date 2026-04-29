import { apiClient } from "@/api/client";

export const listTeams = () => {
  return apiClient.get("/team/list-teams");
};

export const createTeam = (payload) => {
  return apiClient.post("/team/create-team", payload);
};
