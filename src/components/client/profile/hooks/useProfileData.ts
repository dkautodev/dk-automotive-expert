
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData } from "../types";

export const useProfileData = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if the locked fields columns exist in the user_profiles table
        const { data: columnsData, error: columnsError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(1);
        
        if (columnsError) {
          console.error('Error checking columns:', columnsError);
          setError("Impossible de vérifier les colonnes de la table utilisateur.");
          return;
        }
        
        // Check if the locked fields exist in the schema
        const hasLockedFields = columnsData && columnsData.length > 0 && 
          ('siret_number_locked' in columnsData[0] || 'vat_number_locked' in columnsData[0]);
        
        console.log("Columns data sample:", columnsData);
        console.log("Has locked fields:", hasLockedFields);
        
        // Now fetch the user profile
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*, users(email)')
          .eq('id', userId)
          .maybeSingle();  // Use maybeSingle instead of single to avoid errors when no profile is found
          
        if (error) {
          console.error('Error fetching profile:', error);
          setError("Impossible de charger les données du profil. Veuillez réessayer plus tard.");
          return;
        }
        
        if (!data) {
          // Create a default profile since none exists
          const defaultProfile: ProfileData = {
            id: userId,
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            company: '',
            profile_picture: '',
            siret: '',
            vat_number: '',
            siret_locked: false,
            vat_number_locked: false,
            billing_address: ''
          };
          
          setProfile(defaultProfile);
          setIsLoading(false);
          return;
        }
        
        // Extraire l'email de la relation users
        const userEmail = data.users ? (data.users as any).email : '';
        
        // Check if the locked fields exist or use defaults
        const siretLocked = hasLockedFields && 'siret_number_locked' in data 
          ? !!data.siret_number_locked 
          : false;
          
        const vatLocked = hasLockedFields && 'vat_number_locked' in data 
          ? !!data.vat_number_locked 
          : false;
        
        // Créer un objet de profil formaté
        const formattedProfile: ProfileData = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: userEmail,
          phone: data.phone || '',
          company: data.company_name || '',
          profile_picture: data.profile_picture || '',
          siret: data.siret_number || '',
          vat_number: data.vat_number || '',
          siret_locked: siretLocked,
          vat_number_locked: vatLocked,
          billing_address: data.billing_address || ''
        };
        
        setProfile(formattedProfile);
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setError("Une erreur est survenue lors du chargement du profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, setProfile, isLoading, error };
};
