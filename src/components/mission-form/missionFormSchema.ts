
import { z } from "zod";

export const missionFormSchema = z.object({
  mission_type: z.string(),
  
  client_id: z.string().optional(), // Champ pour sélectionner un client

  pickup_address: z.string().min(1, { message: "L'adresse de prise en charge est requise" }),
  delivery_address: z.string().min(1, { message: "L'adresse de livraison est requise" }),
  vehicle_type: z.string().min(1, { message: "Le type de véhicule est requis" }),
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
  
  brand: z.string().min(1, { message: "La marque est requise" }),
  model: z.string().min(1, { message: "Le modèle est requis" }),
  year: z.string().min(1, { message: "L'année est requise" }),
  fuel: z.string().min(1, { message: "Le type de carburant est requis" }),
  licensePlate: z.string().min(1, { message: "La plaque d'immatriculation est requise" }),
  
  pickup_first_name: z.string().min(1, { message: "Le prénom est requis" }),
  pickup_last_name: z.string().min(1, { message: "Le nom est requis" }),
  pickup_email: z.string().email({ message: "L'email doit être valide" }),
  pickup_phone: z.string().min(1, { message: "Le téléphone est requis" }),
  
  delivery_first_name: z.string().min(1, { message: "Le prénom est requis" }),
  delivery_last_name: z.string().min(1, { message: "Le nom est requis" }),
  delivery_email: z.string().email({ message: "L'email doit être valide" }),
  delivery_phone: z.string().min(1, { message: "Le téléphone est requis" }),
  
  pickup_date: z.date({ required_error: "La date de prise en charge est requise" }),
  pickup_time: z.string().min(1, { message: "L'heure de prise en charge est requise" }),
  delivery_date: z.date({ required_error: "La date de livraison est requise" }),
  delivery_time: z.string().min(1, { message: "L'heure de livraison est requise" }),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;
