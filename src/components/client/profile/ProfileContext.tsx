
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileData, ProfileFormData } from "./types";

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  submitForm: (data: ProfileFormData) => Promise<void>;
  handleLogoUpdate: (logoUrl: string) => Promise<void>;
  confirmLockField: (field: 'siret' | 'vat_number', value: string) => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  handleConfirmLock: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { profile: authProfile, user } = useAuthContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToLock, setFieldToLock] = useState<'siret' | 'vat_number' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localProfile, setLocalProfile] = useState<ProfileData | null>(null);
  
  // Sync profile from AuthContext
  useEffect(() => {
    if (authProfile) {
      setLocalProfile(authProfile);
    }
  }, [authProfile]);

  const handleLogoUpdate = async (logoUrl: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_picture: logoUrl
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local profile with new logo
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          profile_picture: logoUrl
        });
      }
      
      toast.success("Logo mis à jour avec succès");
    } catch (error) {
      console.error('Error updating logo:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du logo.");
    }
  };

  const confirmLockField = (field: 'siret' | 'vat_number', value: string) => {
    setFieldToLock(field);
    setTempValue(value);
    setShowConfirmDialog(true);
  };

  const handleConfirmLock = async () => {
    if (!fieldToLock || !user?.id) return;
    
    try {
      // Mapping between profile fields and database columns
      const fieldMapping: Record<string, string> = {
        siret: 'siret_number',
        vat_number: 'vat_number'
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          [fieldMapping[fieldToLock]]: tempValue,
          [`${fieldMapping[fieldToLock]}_locked`]: true
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local profile
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          [fieldToLock]: tempValue,
          [`${fieldToLock}_locked`]: true
        });
      }
      
      toast.success("Le champ a été mis à jour et verrouillé.");
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error locking field:', error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const submitForm = async (data: ProfileFormData) => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Mapping from form fields to database columns
      const updateData: Record<string, any> = {
        phone: data.phone,
        billing_address: data.billing_address
      };

      if (!localProfile?.siret_locked) {
        updateData.siret_number = data.siret;
      }
      if (!localProfile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local profile
      if (localProfile) {
        setLocalProfile({
          ...localProfile,
          phone: data.phone,
          billing_address: data.billing_address,
          siret: !localProfile.siret_locked ? data.siret : localProfile.siret,
          vat_number: !localProfile.vat_number_locked ? data.vat_number : localProfile.vat_number
        });
      }
      
      toast.success("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile: localProfile,
      isLoading,
      submitForm,
      handleLogoUpdate,
      confirmLockField,
      showConfirmDialog,
      setShowConfirmDialog,
      handleConfirmLock,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
