import { useState } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { CompleteSignUpType } from "../schemas/signUpStepSchema";
import { extendedSupabase } from '@/services/mockSupabaseClient';

export const useMultiStepSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: CompleteSignUpType) => {
    setIsLoading(true);
    
    try {
      // Format the complete address
      const formattedAddress = `${data.street}, ${data.postalCode} ${data.city}, ${data.country}`;
      
      console.log("Sending registration request with data:", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        phone: data.phone,
        address: formattedAddress,
        siret: data.siret,
        vatNumber: data.vatNumber
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
        phone: data.phone,
        billing_address: formattedAddress,
        siret_number: data.siret,
        vat_number: data.vatNumber
      });
          
      toast.success("Registration successful! Please check your email to confirm your account.");
      
      // Redirect to authentication page
      navigate('/auth', { state: { email: data.email } });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
