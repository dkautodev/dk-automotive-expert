
import { z } from "zod";

// Schéma pour les types de mission
const missionTypeSchema = z.enum(["livraison", "transfert", "autre"]);

// Schéma pour les valeurs du formulaire de mission
export const missionFormSchema = z.object({
  mission_type: missionTypeSchema,
  client_id: z.string().optional(),

  // Adresses
  pickup_address: z.string().min(1, { message: "L'adresse de départ est requise" }),
  delivery_address: z.string().min(1, { message: "L'adresse de destination est requise" }),
  
  // Distance et prix calculés
  distance: z.any().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
  
  // Informations sur le véhicule
  vehicle_type: z.string().min(1, { message: "Le type de véhicule est requis" }),
  brand: z.string().min(1, { message: "La marque est requise" }),
  model: z.string().min(1, { message: "Le modèle est requis" }),
  year: z.string().min(1, { message: "L'année est requise" }),
  fuel: z.string().min(1, { message: "Le type de carburant est requis" }),
  licensePlate: z.string().min(1, { message: "L'immatriculation est requise" }),

  // Contact pour la prise en charge
  pickup_first_name: z.string().min(1, { message: "Le prénom est requis" }),
  pickup_last_name: z.string().min(1, { message: "Le nom est requis" }),
  pickup_email: z.string().email({ message: "L'email doit être valide" }),
  pickup_phone: z.string().min(10, { message: "Le téléphone doit avoir au moins 10 chiffres" }),

  // Contact pour la livraison
  delivery_first_name: z.string().min(1, { message: "Le prénom est requis" }),
  delivery_last_name: z.string().min(1, { message: "Le nom est requis" }),
  delivery_email: z.string().email({ message: "L'email doit être valide" }),
  delivery_phone: z.string().min(10, { message: "Le téléphone doit avoir au moins 10 chiffres" }),

  // Dates et heures
  pickup_date: z.date({
    required_error: "La date de prise en charge est requise"
  }),
  pickup_time: z.string().min(1, { message: "L'heure de prise en charge est requise" }),
  delivery_date: z.date({
    required_error: "La date de livraison est requise"
  }),
  delivery_time: z.string().min(1, { message: "L'heure de livraison est requise" }),

  // Informations supplémentaires
  additional_info: z.string().optional(),
  
  // Pièces jointes
  attachments: z.any().optional(),
  
  // Acceptation des CGV
  termsAccepted: z.boolean().optional(),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;
