
import { z } from 'zod';

export const quoteFormSchema = z.object({
  mission_type: z.enum(['livraison', 'restitution']),
  vehicle_type: z.string().min(1, 'Le type de véhicule est requis'),
  brand: z.string().min(1, 'La marque est requise'),
  model: z.string().min(1, 'Le modèle est requis'),
  year: z.string().optional(),
  fuel: z.string().optional(),
  licensePlate: z.string().optional(),
  
  pickup_address: z.string().min(1, 'L\'adresse de départ est requise'),
  delivery_address: z.string().min(1, 'L\'adresse d\'arrivée est requise'),
  
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Format d\'email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  company: z.string().min(1, 'La société est requise'),
  
  // Détails supplémentaires pour l'adresse de départ
  pickupStreetNumber: z.string().optional(),
  pickupStreetType: z.string().optional(),
  pickupStreetName: z.string().optional(),
  pickupComplement: z.string().optional(),
  pickupPostalCode: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupCountry: z.string().optional(),
  
  // Détails supplémentaires pour l'adresse de livraison
  deliveryStreetNumber: z.string().optional(),
  deliveryStreetType: z.string().optional(),
  deliveryStreetName: z.string().optional(),
  deliveryComplement: z.string().optional(),
  deliveryPostalCode: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryCountry: z.string().optional(),
  
  // Informations complémentaires
  additionalInfo: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
