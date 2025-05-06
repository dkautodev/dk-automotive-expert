
import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { SignUpFormData } from "../schemas/signUpSchema";
import { extendedSupabase } from '@/integrations/supabase/extended-client';

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
      // Log the registration data for debugging
      console.log("Sending registration request with data:", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        phone: data.phone
      });
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await extendedSupabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { 
            role: 'client',
            firstName: data.firstName,
            lastName: data.lastName,
            company: data.company,
            phone: data.phone
          }
        }
      });
      
      if (authError) {
        console.error("Error creating Auth user:", authError);
        throw new Error("Error creating account: " + authError.message);
      }
      
      console.log("User created successfully in Supabase Auth:", authData);
      
      if (!authData.user) {
        throw new Error("Could not create user");
      }
      
      // Mock user profile creation instead of database access
      console.log("User profile that would be created:", {
        user_id: authData.user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        company_name: data.company,
        phone: data.phone
      });
          
      toast.success("Registration successful! You will be redirected to the login page.");
      
      setTimeout(() => {
        navigate('/auth', { state: { email: data.email } });
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
