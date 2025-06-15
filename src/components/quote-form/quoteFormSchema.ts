
import { z } from 'zod';

// Schéma pour le formulaire de devis restructuré
export const quoteFormSchema = z.object({
  // Étape 1 : Adresses et grille tarifaire (obligatoire)
  pickup_address: z.string().min(1, 'L\'adresse de départ est requise'),
  delivery_address: z.string().min(1, 'L\'adresse d\'arrivée est requise'),
  vehicle_type: z.string().min(1, 'La catégorie de véhicule est requise'),
  
  // Étape 2 : Détails du véhicule (facultatif)
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  fuel: z.string().optional(),
  licensePlate: z.string().optional(),
  vin: z.string().optional(),
  
  // Étape 3 : Contact (obligatoire)
  company: z.string().min(1, 'La société est requise'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Format d\'email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  
  // Informations complémentaires
  additionalInfo: z.string().optional(),
  
  // Champs calculés
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
