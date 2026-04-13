import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // Endpoint provided by user: /profile/employee
      const data = await apiClient.get("/profile/employee");
      return data;
    },
    // Keep profile data fresh but don't over-fetch
    staleTime: 5 * 60 * 1000, 
    retry: 1,
  });
};
