
import { z } from "zod";

export const missionFormSchema = z.object({
  mission_type: z.string(),
  client_id: z.string().optional(),
  pickup_address: z.string().min(1, "L'adresse de départ est requise"),
  delivery_address: z.string().min(1, "L'adresse de livraison est requise"),
  distance: z.number().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  suggested_vehicle: z.string().optional(),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().min(1, "L'année est requise"),
  fuel: z.string().min(1, "Le type de carburant est requis"),
  licensePlate: z.string().min(1, "La plaque d'immatriculation est requise"),
  pickup_first_name: z.string().min(1, "Le prénom est requis"),
  pickup_last_name: z.string().min(1, "Le nom est requis"),
  pickup_email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
  pickup_phone: z.string().min(1, "Le numéro de téléphone est requis"),
  delivery_first_name: z.string().min(1, "Le prénom est requis"),
  delivery_last_name: z.string().min(1, "Le nom est requis"),
  delivery_email: z.string().email("Format d'email invalide").min(1, "L'email est requis"),
  delivery_phone: z.string().min(1, "Le numéro de téléphone est requis"),
  pickup_date: z.date({
    required_error: "La date de ramassage est requise",
  }),
  pickup_time: z.string().min(1, "L'heure de ramassage est requise"),
  delivery_date: z.date({
    required_error: "La date de livraison est requise",
  }),
  delivery_time: z.string().min(1, "L'heure de livraison est requise"),
  additional_info: z.string().max(250, "Les compléments d'informations ne peuvent pas dépasser 250 caractères").optional(),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;
