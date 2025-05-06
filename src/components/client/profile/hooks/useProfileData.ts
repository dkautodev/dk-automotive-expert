
import { useState, useEffect } from "react";
import { ProfileData } from "../types";
import { extendedSupabase } from "@/integrations/supabase/extended-client";

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
        
        // Mock user data since we're not connecting to the real database
        const mockUserData = {
          user: {
            email: 'user@example.com',
            user_metadata: {
              firstName: 'John',
              lastName: 'Doe',
              company: 'ACME Corp',
              phone: '+33123456789'
            }
          }
        };
        
        const userMetadata = mockUserData?.user?.user_metadata || {};
        console.log("User metadata from Auth:", userMetadata);
        
        // Mock profile data
        const mockProfileData = {
          id: userId,
          user_id: userId,
          first_name: 'John',
          last_name: 'Doe',
          company_name: 'ACME Corp',
          phone: '+33123456789',
          profile_picture: 'https://example.com/avatar.jpg',
          billing_address: '123 Street, 75000 Paris, France',
          siret_number: '12345678901234',
          vat_number: 'FR12345678901'
        };
        
        // This is how we would fetch data using our extended client
        await extendedSupabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId);
          
        // Since we're mocking the data, we'll just use the mock data
        const data = mockProfileData;
        
        console.log("Profile data from database:", data);
        
        if (!data) {
          // If no profile exists, create a default profile based on the metadata
          const defaultProfile: ProfileData = {
            id: userId,
            email: mockUserData?.user?.email || '',
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
            billing_address_country: 'France'
          };
          
          setProfile(defaultProfile);
          setIsLoading(false);
          return;
        }
        
        // Get the email of the user from auth
        const userEmail = mockUserData?.user?.email || '';
        
        // Parse the billing address if it exists
        let billingStreet = '';
        let billingCity = '';
        let billingPostalCode = '';
        let billingCountry = 'France';
        
        if (data.billing_address) {
          console.log("Parsing billing address:", data.billing_address);
          try {
            // Format expected: "street, postal_code city, country"
            const addressParts = data.billing_address.split(',').map(part => part.trim());
            
            if (addressParts.length >= 1) {
              billingStreet = addressParts[0];
            }
            
            if (addressParts.length >= 2) {
              // Extract postal code and city
              const cityPart = addressParts[1].trim();
              const postalMatch = cityPart.match(/^(\d{5})\s+(.+)$/);
              
              if (postalMatch) {
                billingPostalCode = postalMatch[1];
                billingCity = postalMatch[2];
              } else {
                billingCity = cityPart;
              }
            }
            
            if (addressParts.length >= 3) {
              billingCountry = addressParts[2];
            }
          } catch (err) {
            console.error("Error parsing address:", err);
          }
        }
        
        // Default to false for locked fields
        const siretLocked = false;
        const vatNumberLocked = false;
        
        // Get the phone number with handling for null values
        const phoneNumber = data.phone || userMetadata.phone || '';
        
        // Create a profile using both profile data and metadata
        const formattedProfile: ProfileData = {
          id: data.id,
          first_name: data.first_name || userMetadata.firstName || '',
          last_name: data.last_name || userMetadata.lastName || '',
          email: userEmail,
          phone: phoneNumber,
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
