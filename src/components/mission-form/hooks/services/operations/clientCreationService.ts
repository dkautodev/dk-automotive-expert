
import { supabase } from "@/integrations/supabase/client";
import { safeTable } from "@/utils/supabase-helper";
import { NewClientData } from "../../types/clientTypes";
import { toast } from "sonner";

/**
 * Client creation module
 */
export const clientCreationService = {
  /**
   * Creates a user in auth and profile tables using the unified model
   */
  createUserWithUnifiedProfile: async (newClientData: NewClientData): Promise<string | null> => {
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
      // Create unified user
      const { data: userData, error: userError } = await safeTable("unified_users")
        .insert({
          id: authData.user.id,
          email: newClientData.email,
          role: 'client',
          first_name: newClientData.first_name || '',
          last_name: newClientData.last_name || '',
          phone: newClientData.phone,
          company_name: newClientData.company,
          billing_address: newClientData.address || ''
        })
        .select();
      
      if (userError) {
        console.error("Erreur lors de l'ajout de l'utilisateur unifié:", userError);
        throw userError;
      }
      
      console.log("Utilisateur unifié créé avec succès");
      return authData.user.id;
    }
    
    return null;
  },

  /**
   * Creates a unified user profile without auth user
   */
  createUnifiedProfileOnly: async (newClientData: NewClientData): Promise<string | null> => {
    const { data: userData, error: userError } = await safeTable("unified_users")
      .insert({
        email: newClientData.email || 'client-' + Date.now() + '@example.com',
        role: 'client',
        first_name: newClientData.first_name || '',
        last_name: newClientData.last_name || '',
        phone: newClientData.phone,
        company_name: newClientData.company,
        billing_address: newClientData.address || ''
      })
      .select();
    
    if (userError) {
      console.error("Erreur lors de l'ajout de l'utilisateur unifié:", userError);
      throw userError;
    }
    
    console.log("Profil utilisateur unifié créé avec succès:", userData);
    return userData[0].id;
  },

  /**
   * Creates a user in auth and profile tables (legacy method)
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
          first_name: newClientData.first_name || '',
          last_name: newClientData.last_name || '',
          phone: newClientData.phone,
          company_name: newClientData.company,
          billing_address: newClientData.address || '',
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
   * Creates a profile without auth user (legacy method)
   */
  createProfileOnly: async (newClientData: NewClientData): Promise<string | null> => {
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        first_name: newClientData.first_name || '',
        last_name: newClientData.last_name || '',
        phone: newClientData.phone,
        company_name: newClientData.company,
        billing_address: newClientData.address || '',
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
      
      // Try to use the unified table first
      try {
        if (newClientData.email) {
          return await clientCreationService.createUserWithUnifiedProfile(newClientData);
        } else {
          return await clientCreationService.createUnifiedProfileOnly(newClientData);
        }
      } catch (unifiedError) {
        console.error("Erreur avec la méthode unifiée, fallback sur méthode legacy:", unifiedError);
        
        // Fallback to legacy method
        if (newClientData.email) {
          return await clientCreationService.createUserWithProfile(newClientData);
        } else {
          return await clientCreationService.createProfileOnly(newClientData);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du client:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du client');
      return null;
    }
  }
};
