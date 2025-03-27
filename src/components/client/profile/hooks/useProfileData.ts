
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
        
        console.log("Fetching profile for user ID:", userId);
        
        // Récupérer d'abord les métadonnées de l'utilisateur
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user metadata:', userError);
        }
        
        const userMetadata = userData?.user?.user_metadata || {};
        console.log("User metadata from Auth:", userMetadata);
        
        // Récupérer le profil utilisateur
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*, users(email)')
          .eq('id', userId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching profile:', error);
          setError("Impossible de charger les données du profil. Veuillez réessayer plus tard.");
          return;
        }

        console.log("Profile data from database:", data);
        
        if (!data) {
          // Si aucun profil n'existe, créer un profil par défaut basé sur les métadonnées
          const defaultProfile: ProfileData = {
            id: userId,
            email: userMetadata.email || '',
            first_name: userMetadata.firstName || '',
            last_name: userMetadata.lastName || '',
            phone: userMetadata.phone || '',
            company: userMetadata.company || '',
            profile_picture: '',
            siret: '',
            vat_number: '',
            siret_locked: false,
            vat_number_locked: false,
            billing_address_street: '',
            billing_address_city: '',
            billing_address_postal_code: '',
            billing_address_country: ''
          };
          
          setProfile(defaultProfile);
          setIsLoading(false);
          return;
        }
        
        // Extraire l'email de la relation users
        const userEmail = data.users ? (data.users as any).email : (userMetadata.email || '');
        
        // Décomposer l'adresse de facturation si elle existe
        let billingStreet = '';
        let billingCity = '';
        let billingPostalCode = '';
        let billingCountry = 'France';
        
        if (data.billing_address) {
          console.log("Parsing billing address:", data.billing_address);
          const addressParts = data.billing_address.split(',').map(part => part.trim());
          if (addressParts.length >= 1) billingStreet = addressParts[0];
          if (addressParts.length >= 2) {
            const cityAndPostal = addressParts[1].split(' ');
            if (cityAndPostal.length >= 2) {
              billingPostalCode = cityAndPostal[0];
              billingCity = cityAndPostal.slice(1).join(' ');
            } else {
              billingCity = addressParts[1];
            }
          }
          if (addressParts.length >= 3) billingCountry = addressParts[2];
        }
        
        // Check for locked fields in the database
        // The columns might not exist yet in the database, so use default values
        const siretLocked = false; // We'll default to false since the column doesn't exist yet
        const vatNumberLocked = false; // We'll default to false since the column doesn't exist yet
        
        // Créer un profil en utilisant à la fois les données du profil et les métadonnées
        const formattedProfile: ProfileData = {
          id: data.id,
          first_name: data.first_name || userMetadata.firstName || '',
          last_name: data.last_name || userMetadata.lastName || '',
          email: userEmail,
          phone: data.phone || userMetadata.phone || '',
          company: data.company_name || userMetadata.company || '',
          profile_picture: data.profile_picture || '',
          siret: data.siret_number || '',
          vat_number: data.vat_number || '',
          siret_locked: siretLocked,
          vat_number_locked: vatNumberLocked,
          billing_address_street: billingStreet,
          billing_address_city: billingCity,
          billing_address_postal_code: billingPostalCode,
          billing_address_country: billingCountry
        };
        
        console.log("Formatted profile:", formattedProfile);
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
