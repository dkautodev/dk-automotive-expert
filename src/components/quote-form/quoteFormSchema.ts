
import * as z from 'zod';

export const quoteFormSchema = z.object({
  // Détails du véhicule
  vehicleType: z.string({
    required_error: "Le type de véhicule est requis",
  }).min(1, "Le type de véhicule est requis"),
  suggested_vehicle: z.string().optional(),
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
  
  // Adresse de prise en charge
  pickupStreetNumber: z.string({
    required_error: "Le numéro de rue est requis",
  }).min(1, "Le numéro de rue est requis"),
  pickupStreetType: z.string({
    required_error: "Le type de voie est requis", 
  }).min(1, "Le type de voie est requis"),
  pickupStreetName: z.string({
    required_error: "Le nom de la voie est requis",
  }).min(1, "Le nom de la voie est requis"),
  pickupComplement: z.string().default("aucun"),
  pickupPostalCode: z.string({
    required_error: "Le code postal est requis",
  }).min(5, "Le code postal doit contenir au moins 5 caractères"),
  pickupCity: z.string({
    required_error: "La ville est requise",
  }).min(1, "La ville est requise"),
  pickupCountry: z.string({
    required_error: "Le pays est requis",
  }).default("France"),
  
  // Adresse de livraison
  deliveryStreetNumber: z.string({
    required_error: "Le numéro de rue est requis",
  }).min(1, "Le numéro de rue est requis"),
  deliveryStreetType: z.string({
    required_error: "Le type de voie est requis",
  }).min(1, "Le type de voie est requis"),
  deliveryStreetName: z.string({
    required_error: "Le nom de la voie est requis",
  }).min(1, "Le nom de la voie est requis"),
  deliveryComplement: z.string().default("aucun"),
  deliveryPostalCode: z.string({
    required_error: "Le code postal est requis",
  }).min(5, "Le code postal doit contenir au moins 5 caractères"),
  deliveryCity: z.string({
    required_error: "La ville est requise", 
  }).min(1, "La ville est requise"),
  deliveryCountry: z.string({
    required_error: "Le pays est requis",
  }).default("France"),
  
  // Pour maintenir la compatibilité avec le reste du code
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  
  // Coordonnées de contact
  company: z.string({
    required_error: "La société est requise",
  }).min(1, "La société est requise"),
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
