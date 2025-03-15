
import * as z from 'zod';

export const pickupFormSchema = z.object({
  companyName: z.string().min(1, "Le nom de la société est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  pickupDate: z.date({
    required_error: "La date d'enlèvement est requise",
  }),
  pickupTime: z.string().min(1, "L'heure d'enlèvement est requise"),
  additionalMessage: z.string().optional(),
});

export type PickupFormValues = z.infer<typeof pickupFormSchema>;

