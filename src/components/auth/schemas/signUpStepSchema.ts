
import * as z from "zod";

// Étape 1: Nom et Prénom
export const nameStepSchema = z.object({
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
});

// Étape 2: Coordonnées
export const contactStepSchema = z.object({
  phone: z.string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Format de téléphone invalide"),
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis"),
});

// Étape 3: Coordonnées de facturation
export const billingStepSchema = z.object({
  company: z.string().min(1, "Le nom de la société est requis"),
  street: z.string().min(1, "L'adresse est requise"),
  postalCode: z.string().min(1, "Le code postal est requis"),
  city: z.string().min(1, "La ville est requise"),
  country: z.string().min(1, "Le pays est requis").default("France"),
  siret: z.string()
    .min(14, "Le SIRET doit contenir 14 chiffres")
    .max(14, "Le SIRET doit contenir 14 chiffres")
    .regex(/^\d{14}$/, "Format de SIRET invalide"),
  vatNumber: z.string()
    .min(1, "Le numéro de TVA est requis")
    .regex(/^(FR){0,1}[0-9A-Z]{2}[0-9]{9}$/, "Format de TVA invalide (ex: FR12345678912)"),
});

// Étape 4: Mot de passe
export const passwordStepSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe")
}).refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
);

// Créons un objet de base sans la validation refine
const baseCompleteSchema = nameStepSchema
  .merge(contactStepSchema)
  .merge(billingStepSchema)
  .merge(z.object({
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe")
  }));

// Puis appliquons la validation refine séparément
export const completeSignUpSchema = baseCompleteSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  }
);

export type NameStepType = z.infer<typeof nameStepSchema>;
export type ContactStepType = z.infer<typeof contactStepSchema>;
export type BillingStepType = z.infer<typeof billingStepSchema>;
export type PasswordStepType = z.infer<typeof passwordStepSchema>;
export type CompleteSignUpType = z.infer<typeof completeSignUpSchema>;
