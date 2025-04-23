
import { z } from "zod";

export const quoteFormSchema = z.object({
  // Type de mission (fixé à "livraison" pour les devis)
  mission_type: z.string().default("livraison"),
  
  // Informations du véhicule
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().min(1, "L'année est requise"),
  fuel: z.string().min(1, "Le type de carburant est requis"),
  licensePlate: z.string().min(1, "La plaque d'immatriculation est requise"),
  
  // Adresses
  pickup_address: z.string().min(1, "L'adresse de prise en charge est requise"),
  delivery_address: z.string().min(1, "L'adresse de livraison est requise"),
  
  // Dates et heures
  pickup_date: z.date({
    required_error: "La date de prise en charge est requise",
  }),
  pickup_time: z.string().min(1, "L'heure de prise en charge est requise"),
  delivery_date: z.date({
    required_error: "La date de livraison est requise",
  }),
  delivery_time: z.string().min(1, "L'heure de livraison est requise"),

  // Informations du contact
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
  phone: z.string().min(1, "Le téléphone est requis"),
  company: z.string().min(1, "La société est requise"),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
