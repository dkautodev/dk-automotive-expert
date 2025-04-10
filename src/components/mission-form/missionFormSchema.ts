
import { z } from "zod";

// Schéma de validation pour le formulaire de mission avec Zod
export const missionFormSchema = z.object({
  mission_type: z.enum(["livraison", "restitution", "transfert", "autre"]).default("livraison"),
  client_id: z.string().optional(),
  
  // Étape 2: Adresses et véhicule
  pickup_address: z.string().min(1, "L'adresse de prise en charge est requise"),
  delivery_address: z.string().min(1, "L'adresse de livraison est requise"),
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  distance: z.any().optional(), // Calculé
  price_ht: z.string().optional(), // Calculé
  price_ttc: z.string().optional(), // Calculé
  
  // Étape 3: Informations du véhicule
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().min(1, "L'année est requise"),
  fuel: z.string().min(1, "Le carburant est requis"),
  licensePlate: z.string().min(1, "La plaque d'immatriculation est requise"),
  
  // Étape 4: Contacts et horaires
  pickup_first_name: z.string().min(1, "Le prénom du contact de prise en charge est requis"),
  pickup_last_name: z.string().min(1, "Le nom du contact de prise en charge est requis"),
  pickup_email: z.string().email("Email invalide").min(1, "L'email du contact de prise en charge est requis"),
  pickup_phone: z.string().min(1, "Le téléphone du contact de prise en charge est requis"),
  
  pickup_date: z.date({
    required_error: "La date de prise en charge est requise",
  }),
  pickup_time: z.string().min(1, "L'heure de prise en charge est requise"),
  
  delivery_first_name: z.string().min(1, "Le prénom du contact de livraison est requis"),
  delivery_last_name: z.string().min(1, "Le nom du contact de livraison est requis"),
  delivery_email: z.string().email("Email invalide").min(1, "L'email du contact de livraison est requis"),
  delivery_phone: z.string().min(1, "Le téléphone du contact de livraison est requis"),
  
  delivery_date: z.date({
    required_error: "La date de livraison est requise",
  }),
  delivery_time: z.string().min(1, "L'heure de livraison est requise"),
  
  additional_info: z.string().optional(),
  
  // Pièces jointes - Explicitement typé comme File[] pour éviter les erreurs TypeScript
  attachments: z.array(z.instanceof(File)).optional(),
  
  // Conditions générales
  termsAccepted: z.boolean().optional()
});

// Type dérivé du schéma
export type MissionFormValues = z.infer<typeof missionFormSchema>;
