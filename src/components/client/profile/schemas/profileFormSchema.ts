
import { z } from "zod";

// Define the schema for profile form validation
export const profileFormSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  siret: z.string().min(1, "Le numéro SIRET est requis"),
  vat_number: z.string().min(1, "Le numéro de TVA est requis"),
  billing_address_street: z.string().min(1, "L'adresse est requise"),
  billing_address_city: z.string().min(1, "La ville est requise"),
  billing_address_postal_code: z.string().min(1, "Le code postal est requis"),
  billing_address_country: z.string().min(1, "Le pays est requis")
});

// Create a type from the schema to ensure consistency
export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;
