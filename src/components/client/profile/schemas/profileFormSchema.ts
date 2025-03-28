
import { z } from "zod";

// Define the schema for profile form validation with some properties optional
export const profileFormSchema = z.object({
  email: z.string().email("Adresse e-mail invalide").min(1, "L'email est requis"),
  phone: z.string().min(1, "Le numéro de téléphone est requis")
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone invalide"),
  siret: z.string().min(1, "Le numéro SIRET est requis")
    .regex(/^\d{14}$/, "Format de SIRET invalide (14 chiffres)"),
  vat_number: z.string().min(1, "Le numéro de TVA est requis")
    .regex(/^(FR){0,1}[0-9A-Z]{2}[0-9]{9}$/, "Format de TVA invalide (ex: FR12345678912)"),
  billing_address_street: z.string().min(1, "L'adresse est requise"),
  billing_address_city: z.string().min(1, "La ville est requise"),
  billing_address_postal_code: z.string().min(1, "Le code postal est requis"),
  billing_address_country: z.string().min(1, "Le pays est requis")
});

// Export le type généré par le schéma
export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;
