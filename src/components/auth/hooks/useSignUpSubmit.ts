
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
      const { data: authData, error: signUpError } = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        company: data.company,
        role: 'client' as UserRole
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès."
        });
        
        navigate('/dashboard/client');
      }
    } catch (error: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";
      
      if (error.message.includes("over_email_send_rate_limit")) {
        errorMessage = "Veuillez attendre quelques secondes avant de réessayer.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Cette adresse email est déjà utilisée.";
      } else if (error.message.includes("Email address is invalid")) {
        errorMessage = "L'adresse email n'est pas valide.";
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
