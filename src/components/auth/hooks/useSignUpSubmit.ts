
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuthContext } from "@/context/AuthContext";
import type { SignUpFormData } from "../schemas/signUpSchema";
import type { UserRole } from "@/hooks/useAuth";

export const useSignUpSubmit = () => {
  const { signUp } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (data: SignUpFormData) => {
    try {
      const { error: signUpError } = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        company: data.company,
        role: 'client' as UserRole
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès."
      });
      
      navigate('/dashboard/client');
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      
      if (error.message.includes("Email rate limit exceeded")) {
        errorMessage = "Veuillez attendre quelques secondes avant de réessayer.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      }

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return { handleSubmit };
};
