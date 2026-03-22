import { z } from "zod";

export const roleSchema = z.object({
  role_name: z.string().min(3, "Role name must be at least 3 characters").max(50),
});
