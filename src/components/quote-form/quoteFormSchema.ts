
import * as z from 'zod';

export const quoteFormSchema = z.object({
  vehicleType: z.string({
    required_error: "Le type de véhicule est requis",
  }),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().min(4, "L'année est requise"),
  licensePlate: z.string().min(1, "L'immatriculation est requise"),
  fuelType: z.string({
    required_error: "Le type de carburant est requis",
  }),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
