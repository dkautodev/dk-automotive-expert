
import { z } from "zod";

export const quoteFormSchema = z.object({
  // Type de mission (livraison ou restitution)
  mission_type: z.enum(["livraison", "restitution"]),
  
  // Informations du véhicule
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  fuel: z.string().optional(),
  licensePlate: z.string().optional(),
  
  // Adresses
  pickup_address: z.string().min(1, "L'adresse de prise en charge est requise"),
  delivery_address: z.string().min(1, "L'adresse de livraison est requise"),
  
  // Fields for structured address entry - Rendus optionnels
  pickupStreetNumber: z.string().optional(),
  pickupStreetType: z.string().optional().default("Rue"),
  pickupStreetName: z.string().optional(),
  pickupComplement: z.string().optional(),
  pickupPostalCode: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupCountry: z.string().default("France"),
  
  deliveryStreetNumber: z.string().optional(),
  deliveryStreetType: z.string().optional().default("Rue"),
  deliveryStreetName: z.string().optional(),
  deliveryComplement: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryCountry: z.string().default("France"),
  
  // Contact
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
  company: z.string().min(1, "La société est requise"),
  
  // Champs calculés (en lecture seule)
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
