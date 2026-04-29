import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/services/auth";

export const useLoginUser = () => {
  return useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        return await loginUser({ username, password });
      } catch (error) {
        const message =
          error?.detail || error?.message || "Failed to login user.";
        const nextError = new Error(message);
        nextError.status = error?.status;
        throw nextError;
      }
    },
  });
};
