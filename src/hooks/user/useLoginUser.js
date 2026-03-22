import { useMutation } from "@tanstack/react-query";
import { API_BASE } from "@/api/client";

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async ({ username, password }) => {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const responseData = await response.json().catch(() => ({}));

            if (!response.ok) {
                const error = new Error(
                    responseData.detail || responseData.message || "Failed to login user."
                );
                error.status = response.status;
                throw error;
            }

            return responseData;
        },
    });
};
