
import { z } from "zod";

// Step 1: Mission Type
export const missionTypeSchema = z.object({
  mission_type: z.enum(["livraison", "restitution"], {
    required_error: "Veuillez sélectionner un type de mission",
  }),
});

// Step 2: Addresses and Vehicle Type
export const addressesVehicleSchema = z.object({
  pickup_address: z.string().min(1, "L'adresse de prise en charge est requise"),
  delivery_address: z.string().min(1, "L'adresse de livraison est requise"),
  vehicle_type: z.string().min(1, "Veuillez sélectionner un type de véhicule"),
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
});

// Step 3: Vehicle Information
export const vehicleInfoSchema = z.object({
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().min(1, "L'année est requise"),
  fuel: z.string().min(1, "Le type de carburant est requis"),
  licensePlate: z.string().min(1, "L'immatriculation est requise"),
});

// Step 4: Contact and Schedule Information
export const contactScheduleSchema = z.object({
  // Pickup Contact
  pickup_first_name: z.string().min(1, "Le prénom est requis"),
  pickup_last_name: z.string().min(1, "Le nom est requis"),
  pickup_email: z.string().email("Email invalide").min(1, "L'email est requis"),
  pickup_phone: z.string().min(1, "Le téléphone est requis"),
  
  // Delivery Contact
  delivery_first_name: z.string().min(1, "Le prénom est requis"),
  delivery_last_name: z.string().min(1, "Le nom est requis"),
  delivery_email: z.string().email("Email invalide").min(1, "L'email est requis"),
  delivery_phone: z.string().min(1, "Le téléphone est requis"),
  
  // Schedule
  pickup_date: z.date({
    required_error: "La date de prise en charge est requise",
  }),
  pickup_time: z.string().min(1, "L'heure de prise en charge est requise"),
  delivery_date: z.date({
    required_error: "La date de livraison est requise",
  }),
  delivery_time: z.string().min(1, "L'heure de livraison est requise"),
});

// Combine all schemas for the full form
export const missionFormSchema = z.object({
  ...missionTypeSchema.shape,
  ...addressesVehicleSchema.shape,
  ...vehicleInfoSchema.shape,
  ...contactScheduleSchema.shape,
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;
