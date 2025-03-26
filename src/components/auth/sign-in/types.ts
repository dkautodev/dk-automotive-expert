
import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;
