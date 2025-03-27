
import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { SignUpFormData } from "../schemas/signUpSchema";

export const useSignUpSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${window.location.origin}/api/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          company: data.company
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue lors de l\'inscription');
      }
      
      toast.success("Inscription réussie ! Vous allez être redirigé vers la page de connexion.");
      
      setTimeout(() => {
        navigate('/auth', { state: { email: data.email } });
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
