
import * as z from 'zod';

export const pickupFormSchema = z.object({
  companyName: z.string({
    required_error: "Le nom de la société est requis",
  }).min(1, "Le nom de la société est requis"),
  lastName: z.string({
    required_error: "Le nom est requis",
  }).min(1, "Le nom est requis"),
  firstName: z.string({
    required_error: "Le prénom est requis",
  }).min(1, "Le prénom est requis"),
  address: z.string({
    required_error: "L'adresse est requise",
  }).min(1, "L'adresse est requise"),
  email: z.string({
    required_error: "L'email est requis",
  }).email("Email invalide"),
  phone: z.string({
    required_error: "Le numéro de téléphone est requis",
  }).min(10, "Le numéro de téléphone est requis"),
  pickupDate: z.date({
    required_error: "La date d'enlèvement est requise",
  }),
  pickupTime: z.string({
    required_error: "L'heure d'enlèvement est requise",
  }).min(1, "L'heure d'enlèvement est requise"),
  additionalMessage: z.string({
    required_error: "Le message complémentaire est requis",
  }).min(1, "Le message complémentaire est requis"),
});

export type PickupFormValues = z.infer<typeof pickupFormSchema>;

