
import { supabase } from "@/integrations/supabase/client";
import { NewClientData } from "../../types/clientTypes";
import { toast } from "sonner";

/**
 * Client creation module
 */
export const clientCreationService = {
  /**
   * Creates a user in auth and profile tables
   */
  createUserWithProfile: async (newClientData: NewClientData): Promise<string | null> => {
    // Generate a random password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: newClientData.email,
      password: tempPassword,
      email_confirm: true
    });
    
    if (authError) {
      console.error("Erreur lors de la création de l'utilisateur:", authError);
      throw authError;
    }
    
    if (authData?.user) {
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          first_name: newClientData.first_name,
          last_name: newClientData.last_name,
          phone: newClientData.phone,
          company_name: newClientData.company,
          billing_address: newClientData.address,
          user_type: 'client'
        })
        .select();
      
      if (profileError) {
        console.error("Erreur lors de l'ajout du profil:", profileError);
        throw profileError;
      }
      
      console.log("Utilisateur et profil client créés avec succès");
      return authData.user.id;
    }
    
    return null;
  },

  /**
   * Creates a profile without auth user
   */
  createProfileOnly: async (newClientData: NewClientData): Promise<string | null> => {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        first_name: newClientData.first_name,
        last_name: newClientData.last_name,
        phone: newClientData.phone,
        company_name: newClientData.company,
        billing_address: newClientData.address,
        user_type: 'client'
      })
      .select();
    
    if (profileError) {
      console.error("Erreur lors de l'ajout du profil:", profileError);
      throw profileError;
    }
    
    console.log("Profil client créé avec succès:", profileData);
    return profileData[0].id;
  },

  /**
   * Adds a new client to the system
   */
  addClient: async (newClientData: NewClientData): Promise<string | null> => {
    try {
      console.log("Tentative d'ajout d'un nouveau client:", newClientData);
      
      // Create user in auth if email is provided
      if (newClientData.email) {
        return await clientCreationService.createUserWithProfile(newClientData);
      } else {
        // Just create a profile without auth user
        return await clientCreationService.createProfileOnly(newClientData);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du client:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du client');
      return null;
    }
  }
};
