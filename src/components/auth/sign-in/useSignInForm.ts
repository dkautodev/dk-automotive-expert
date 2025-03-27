
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { SignInFormData, signInFormSchema } from "./types";

export const useSignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuthContext();
  const navigate = useNavigate();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      console.log("Tentative de connexion avec", data.email);
      
      // Check if this is the admin account
      if (data.email === 'dkautomotive70@gmail.com') {
        console.log("Connexion administrateur");
        try {
          await signIn(data.email, data.password);
          toast.success("Connexion administrateur réussie");
          navigate('/dashboard/admin');
          return;
        } catch (error: any) {
          console.error("Erreur connexion admin:", error);
          toast.error("Identifiants administrateur incorrects");
          setIsLoading(false);
          return;
        }
      }
      
      // For regular users
      try {
        await signIn(data.email, data.password);
        toast.success("Connexion réussie");
        navigate('/dashboard/client');
      } catch (error: any) {
        console.error("Erreur connexion:", error);
        toast.error("Identifiants incorrects");
      } finally {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Erreur générale:", error);
      toast.error("Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    showPassword,
    setShowPassword,
    onSubmit,
  };
};
