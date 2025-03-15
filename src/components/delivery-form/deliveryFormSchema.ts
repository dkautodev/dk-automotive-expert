
import * as z from 'zod';

export const deliveryFormSchema = z.object({
  companyName: z.string().min(1, "Le nom de la société est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  deliveryDate: z.date({
    required_error: "La date de livraison est requise",
  }),
  deliveryTime: z.string().min(1, "L'heure de livraison est requise"),
  additionalMessage: z.string().optional(),
});

export type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;
