import { useMutation } from "@tanstack/react-query";

export const useLoginUser = () => {
    return useMutation({
        mutationFn: async ({ username, password }) => {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(
                    responseData.message || "Failed to login user."
                );
                error.status = response.status;
                throw error;
            }

            return responseData;
        },
    });
};
