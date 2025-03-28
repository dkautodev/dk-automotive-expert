
import * as z from "zod";

// Étape 1: Nom et Prénom
export const nameStepSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
});

// Étape 2: Coordonnées
export const contactStepSchema = z.object({
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
});

// Étape 3: Coordonnées de facturation
export const billingStepSchema = z.object({
  company: z.string().min(1, "Le nom de la société est requis"),
  street: z.string().min(1, "L'adresse est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis").default("France"),
});

// Étape 4: Mot de passe
export const passwordStepSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Schéma complet pour le formulaire final
export const completeSignUpSchema = nameStepSchema
  .merge(contactStepSchema)
  .merge(billingStepSchema)
  .merge(passwordStepSchema);

export type NameStepType = z.infer<typeof nameStepSchema>;
export type ContactStepType = z.infer<typeof contactStepSchema>;
export type BillingStepType = z.infer<typeof billingStepSchema>;
export type PasswordStepType = z.infer<typeof passwordStepSchema>;
export type CompleteSignUpType = z.infer<typeof completeSignUpSchema>;
