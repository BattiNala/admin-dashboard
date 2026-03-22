import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone_number: z.string().optional(),
  team_id: z.string().optional().or(z.number()),
  current_status: z.enum(["available", "busy", "off_duty"]),
});
