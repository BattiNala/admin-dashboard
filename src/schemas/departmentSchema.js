import { z } from "zod";

export const departmentSchema = z.object({
  department_name: z.string().min(2, "Department name must be at least 2 characters").max(100),
});
