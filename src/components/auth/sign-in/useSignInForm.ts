
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { SignInFormSchemaType, signInFormSchema } from "../schemas/signInSchema";

export function useSignInForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthContext();
  
  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormSchemaType) {
    try {
      setLoading(true);
      
      await signIn(values.email, values.password);
      
      toast.success("Connexion réussie !");
      navigate("/");
    } catch (error) {
      // The error is already handled in the signIn function
      console.log("Sign in failed", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    onSubmit,
    loading,
  };
}
