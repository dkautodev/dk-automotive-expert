
import { useState, useEffect } from "react";
import { ProfileData } from "../types";
import { mockProfileService } from "@/services/profile/mockProfileService";

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
        
        const profileData = await mockProfileService.getProfile(userId);
        
        if (!profileData) {
          // Profil par défaut si aucun n'est trouvé
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
            billing_address_street: '',
            billing_address_city: '',
            billing_address_postal_code: '',
            billing_address_country: 'France'
          };
          
          setProfile(defaultProfile);
        } else {
          setProfile(profileData);
        }
      } catch (err: any) {
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
