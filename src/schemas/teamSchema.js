import { z } from "zod";

export const teamSchema = z.object({
  team_name: z.string().min(3, "Team name must be at least 3 characters").max(100),
  base_latitude: z.coerce.number().min(-90).max(90),
  base_longitude: z.coerce.number().min(-180).max(180),
  coverage_radius_km: z.coerce.number().min(0.1, "Radius must be at least 0.1km").max(500, "Maximum radius is 500km"),
});
