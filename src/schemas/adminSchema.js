import { z } from "zod";

export const adminSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone_number: z.string().min(10, "Phone number must be exactly 10 digits").max(10, "Phone number must be exactly 10 digits").regex(/^\d+$/, "Use digits only"),
  department_id: z.string().min(1, "Please select a department").or(z.number()),
});
