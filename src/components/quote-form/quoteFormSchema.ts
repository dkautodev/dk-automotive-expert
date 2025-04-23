
import { z } from "zod";

// Regex pour la validation
const PHONE_REGEX = /^(?:\+33|0)[1-9](?:[\s.-]?[0-9]{2}){4}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const LICENSE_PLATE_REGEX = /^[A-Z0-9]{1,9}$/;

// Type de mission (enum strict)
const missionTypeEnum = z.enum(["livraison", "restitution"]);

// Schéma pour l'adresse complète
const addressSchema = z.object({
  streetNumber: z.string().optional(),
  streetType: z.string().optional().default("Rue"),
  streetName: z.string().optional(),
  complement: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().default("France"),
});

export const quoteFormSchema = z.object({
  // Type de mission (livraison ou restitution)
  mission_type: missionTypeEnum,
  
  // Informations du véhicule avec validation renforcée
  vehicle_type: z.string().trim().min(1, "Le type de véhicule est requis"),
  brand: z.string().trim()
    .min(2, "La marque doit comporter au moins 2 caractères")
    .max(50, "La marque ne peut pas dépasser 50 caractères")
    .optional(),
  model: z.string().trim()
    .min(2, "Le modèle doit comporter au moins 2 caractères")
    .max(50, "Le modèle ne peut pas dépasser 50 caractères")
    .optional(),
  year: z.string().trim()
    .regex(/^(19|20)\d{2}$/, "L'année doit être au format YYYY")
    .optional(),
  fuel: z.string().trim()
    .min(2, "Le type de carburant doit comporter au moins 2 caractères")
    .max(20, "Le type de carburant ne peut pas dépasser 20 caractères")
    .optional(),
  licensePlate: z.string().trim()
    .regex(LICENSE_PLATE_REGEX, "Format d'immatriculation invalide")
    .optional(),
  
  // Adresses
  pickup_address: z.string().trim().min(3, "L'adresse de prise en charge est requise"),
  delivery_address: z.string().trim().min(3, "L'adresse de livraison est requise"),
  
  // Fields for structured address entry - Rendus optionnels
  pickupStreetNumber: z.string().trim().optional(),
  pickupStreetType: z.string().trim().optional().default("Rue"),
  pickupStreetName: z.string().trim().optional(),
  pickupComplement: z.string().trim().optional(),
  pickupPostalCode: z.string().trim().optional(),
  pickupCity: z.string().trim().optional(),
  pickupCountry: z.string().trim().default("France"),
  
  deliveryStreetNumber: z.string().trim().optional(),
  deliveryStreetType: z.string().trim().optional().default("Rue"),
  deliveryStreetName: z.string().trim().optional(),
  deliveryComplement: z.string().trim().optional(),
  deliveryPostalCode: z.string().trim().optional(),
  deliveryCity: z.string().trim().optional(),
  deliveryCountry: z.string().trim().default("France"),
  
  // Contact avec validation renforcée
  firstName: z.string().trim()
    .min(2, "Le prénom est requis (min. 2 caractères)")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne doit contenir que des lettres, espaces, apostrophes et tirets"),
  lastName: z.string().trim()
    .min(2, "Le nom est requis (min. 2 caractères)")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne doit contenir que des lettres, espaces, apostrophes et tirets"),
  email: z.string().trim()
    .email("Format d'email invalide")
    .regex(EMAIL_REGEX, "Format d'email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  phone: z.string().trim()
    .min(10, "Le téléphone est requis")
    .regex(PHONE_REGEX, "Format de téléphone invalide"),
  company: z.string().trim()
    .min(2, "La société est requise (min. 2 caractères)")
    .max(100, "Le nom de société ne peut pas dépasser 100 caractères"),
  
  // Champs calculés (en lecture seule)
  distance: z.string().optional(),
  price_ht: z.string().optional(),
  price_ttc: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
