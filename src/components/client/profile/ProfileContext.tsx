
import { createContext, useContext, ReactNode, useState } from "react";
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
  const { profile: authProfile } = useAuthContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToLock, setFieldToLock] = useState<'siret' | 'vat_number' | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_picture: logoUrl
        })
        .eq('id', authProfile?.id);
      if (error) throw error;
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
    if (!fieldToLock || !authProfile?.id) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          [fieldToLock]: tempValue,
          [`${fieldToLock}_locked`]: true
        })
        .eq('id', authProfile.id);
      if (error) throw error;
      toast.success("Le champ a été mis à jour et verrouillé.");
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error locking field:', error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const submitForm = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const updateData: any = {
        email: data.email,
        phone: data.phone,
        billing_address: data.billing_address
      };

      if (!authProfile?.siret_locked) {
        updateData.siret = data.siret;
      }
      if (!authProfile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', authProfile?.id);
      
      if (error) throw error;
      toast.success("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      toast.error("Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{
      profile: authProfile,
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
