
import * as z from 'zod';

export const quoteFormSchema = z.object({
  // Détails du véhicule
  vehicleType: z.string({
    required_error: "Le type de véhicule est requis",
  }),
  brand: z.string({
    required_error: "La marque est requise",
  }).min(1, "La marque est requise")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "La marque ne doit contenir que des lettres, espaces et tirets"),
  model: z.string({
    required_error: "Le modèle est requis",
  }).min(1, "Le modèle est requis")
    .regex(/^[a-zA-Z0-9À-ÿ\s-]+$/, "Le modèle ne doit contenir que des lettres, chiffres, espaces et tirets"),
  year: z.string({
    required_error: "L'année est requise",
  }).min(4, "L'année est requise")
    .regex(/^\d{4}$/, "L'année doit être composée exactement de 4 chiffres"),
  licensePlate: z.string({
    required_error: "L'immatriculation est requise",
  }).min(1, "L'immatriculation est requise")
    .regex(/^[A-Z0-9-]+$/, "L'immatriculation ne doit contenir que des lettres majuscules, chiffres et tirets"),
  fuelType: z.string({
    required_error: "Le type de carburant est requis",
  }),
  
  // Adresse de prise en charge
  pickupStreetNumber: z.string({
    required_error: "Le numéro de rue est requis",
  }).min(1, "Le numéro de rue est requis")
    .regex(/^\d+$/, "Le numéro de rue doit contenir uniquement des chiffres"),
  pickupStreetType: z.string({
    required_error: "Le type de voie est requis", 
  }).min(1, "Le type de voie est requis"),
  pickupStreetName: z.string({
    required_error: "Le nom de la voie est requis",
  }).min(1, "Le nom de la voie est requis")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s-']+$/, "Le nom de la voie ne doit contenir que des lettres, chiffres, espaces, apostrophes et tirets"),
  pickupComplement: z.string().default("aucun")
    .regex(/^[a-zA-Z0-9À-ÿ\s-',.]*$/, "Le complément ne doit contenir que des lettres, chiffres, espaces et caractères spéciaux basiques"),
  pickupPostalCode: z.string({
    required_error: "Le code postal est requis",
  }).min(5, "Le code postal doit contenir au moins 5 caractères")
    .regex(/^\d{5}$/, "Le code postal doit être composé exactement de 5 chiffres"),
  pickupCity: z.string({
    required_error: "La ville est requise",
  }).min(1, "La ville est requise")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "La ville ne doit contenir que des lettres, espaces, apostrophes et tirets"),
  pickupCountry: z.string({
    required_error: "Le pays est requis",
  }).default("France"),
  
  // Adresse de livraison
  deliveryStreetNumber: z.string({
    required_error: "Le numéro de rue est requis",
  }).min(1, "Le numéro de rue est requis")
    .regex(/^\d+$/, "Le numéro de rue doit contenir uniquement des chiffres"),
  deliveryStreetType: z.string({
    required_error: "Le type de voie est requis",
  }).min(1, "Le type de voie est requis"),
  deliveryStreetName: z.string({
    required_error: "Le nom de la voie est requis",
  }).min(1, "Le nom de la voie est requis")
    .regex(/^[a-zA-ZÀ-ÿ0-9\s-']+$/, "Le nom de la voie ne doit contenir que des lettres, chiffres, espaces, apostrophes et tirets"),
  deliveryComplement: z.string().default("aucun")
    .regex(/^[a-zA-Z0-9À-ÿ\s-',.]*$/, "Le complément ne doit contenir que des lettres, chiffres, espaces et caractères spéciaux basiques"),
  deliveryPostalCode: z.string({
    required_error: "Le code postal est requis",
  }).min(5, "Le code postal doit contenir au moins 5 caractères")
    .regex(/^\d{5}$/, "Le code postal doit être composé exactement de 5 chiffres"),
  deliveryCity: z.string({
    required_error: "La ville est requise", 
  }).min(1, "La ville est requise")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "La ville ne doit contenir que des lettres, espaces, apostrophes et tirets"),
  deliveryCountry: z.string({
    required_error: "Le pays est requis",
  }).default("France"),
  
  // Pour maintenir la compatibilité avec le reste du code
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  
  // Coordonnées de contact
  company: z.string({
    required_error: "La société est requise",
  }).min(1, "La société est requise")
    .regex(/^[a-zA-Z0-9À-ÿ\s-'&.]+$/, "La société ne doit contenir que des lettres, chiffres, espaces et caractères spéciaux basiques"),
  firstName: z.string({
    required_error: "Le prénom est requis",
  }).min(1, "Le prénom est requis")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le prénom ne doit contenir que des lettres, espaces, apostrophes et tirets"),
  lastName: z.string({
    required_error: "Le nom est requis",
  }).min(1, "Le nom est requis")
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le nom ne doit contenir que des lettres, espaces, apostrophes et tirets"),
  email: z.string({
    required_error: "L'email est requis",
  }).email("Format d'email invalide"),
  phone: z.string({
    required_error: "Le téléphone est requis",
  }).min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone français invalide"),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
