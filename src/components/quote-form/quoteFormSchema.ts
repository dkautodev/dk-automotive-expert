
import * as z from 'zod';

export const quoteFormSchema = z.object({
  // Détails du véhicule
  vehicleType: z.string({
    required_error: "Le type de véhicule est requis",
  }),
  brand: z.string({
    required_error: "La marque est requise",
  }).min(1, "La marque est requise"),
  model: z.string({
    required_error: "Le modèle est requis",
  }).min(1, "Le modèle est requis"),
  year: z.string({
    required_error: "L'année est requise",
  }).min(4, "L'année est requise"),
  licensePlate: z.string({
    required_error: "L'immatriculation est requise",
  }).min(1, "L'immatriculation est requise"),
  fuelType: z.string({
    required_error: "Le type de carburant est requis",
  }),
  
  // Adresses
  pickupAddress: z.string({
    required_error: "L'adresse de prise en charge est requise",
  }).min(5, "L'adresse de prise en charge doit contenir au moins 5 caractères"),
  deliveryAddress: z.string({
    required_error: "L'adresse de livraison est requise",
  }).min(5, "L'adresse de livraison doit contenir au moins 5 caractères"),
  
  // Coordonnées de contact
  company: z.string().optional(),
  firstName: z.string({
    required_error: "Le prénom est requis",
  }).min(1, "Le prénom est requis"),
  lastName: z.string({
    required_error: "Le nom est requis",
  }).min(1, "Le nom est requis"),
  email: z.string({
    required_error: "L'email est requis",
  }).email("Format d'email invalide"),
  phone: z.string({
    required_error: "Le téléphone est requis",
  }).min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
