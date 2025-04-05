
import { z } from "zod";

export const missionFormSchema = z.object({
  mission_type: z.string(),
  client_id: z.string(),
  pickup_address: z.string(),
  delivery_address: z.string(),
  vehicle_type: z.string(),
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
  brand: z.string(),
  model: z.string(),
  year: z.string(),
  fuel: z.string(),
  licensePlate: z.string(),
  pickup_first_name: z.string(),
  pickup_last_name: z.string(),
  pickup_email: z.string().email(),
  pickup_phone: z.string(),
  delivery_first_name: z.string(),
  delivery_last_name: z.string(),
  delivery_email: z.string().email(),
  delivery_phone: z.string(),
  pickup_date: z.date(),
  pickup_time: z.string(),
  delivery_date: z.date(),
  delivery_time: z.string(),
  additional_info: z.string().optional(),
  attachments: z.array(z.any()).optional()
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;
