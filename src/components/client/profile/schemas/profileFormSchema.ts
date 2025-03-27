
import { z } from "zod";

export const profileFormSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  siret: z.string()
    .regex(/^[0-9]{14}$/, "Le numéro SIRET doit contenir exactement 14 chiffres")
    .or(z.string().length(0)),
  vat_number: z.string()
    .regex(/^[A-Z]{2}[0-9A-Z]{2,12}$/, "Le format du numéro de TVA est invalide (ex: FR12345678912)")
    .or(z.string().length(0)),
  billing_address_street: z.string().min(1, "L'adresse est requise"),
  billing_address_city: z.string().min(1, "La ville est requise"),
  billing_address_postal_code: z.string().regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres"),
  billing_address_country: z.string().min(1, "Le pays est requis")
});

// Create a type from the schema to ensure consistency
export type ProfileFormSchemaType = z.infer<typeof profileFormSchema>;
