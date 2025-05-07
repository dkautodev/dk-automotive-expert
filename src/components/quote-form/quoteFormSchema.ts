
import { z } from 'zod';

// Schéma pour le formulaire de devis
export const quoteFormSchema = z.object({
  // Étape 1: Type de mission
  mission_type: z.string(),
  
  // Étape 2: Adresses et véhicule
  vehicle_type: z.string(),
  pickup_address: z.string().min(1, "L'adresse de départ est requise"),
  delivery_address: z.string().min(1, "L'adresse d'arrivée est requise"),
  
  // Étape 3: Détails du véhicule
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().optional(),
  fuel: z.string().optional(),
  licensePlate: z.string().optional(),
  
  // Détails des adresses
  pickupStreetNumber: z.string().optional(),
  pickupStreetType: z.string().optional(),
  pickupStreetName: z.string().optional(),
  pickupComplement: z.string().optional(),
  pickupPostalCode: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupCountry: z.string().optional(),
  
  deliveryStreetNumber: z.string().optional(),
  deliveryStreetType: z.string().optional(),
  deliveryStreetName: z.string().optional(),
  deliveryComplement: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryCountry: z.string().optional(),
  
  // Étape 4: Contact
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
  company: z.string().optional(),
  
  // Champs générés automatiquement
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
  
  // Champs supplémentaires
  additionalInfo: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
