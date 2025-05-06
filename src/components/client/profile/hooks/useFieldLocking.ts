
import { useState } from "react";
import { ProfileData } from "../types";
import { toast } from "sonner";
import { mockProfileService } from "@/services/profile/mockProfileService";

export const useFieldLocking = (userId: string | undefined, profile: ProfileData | null, setProfile: (profile: ProfileData | null) => void) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToLock, setFieldToLock] = useState<'siret' | 'vat_number' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const confirmLockField = (field: 'siret' | 'vat_number', value: string) => {
    setFieldToLock(field);
    setTempValue(value);
    setShowConfirmDialog(true);
  };

  const handleConfirmLock = async () => {
    if (!fieldToLock || !userId) return;
    
    try {
      const updatedProfile = await mockProfileService.lockField(userId, fieldToLock, tempValue);
      
      // Update local profile
      setProfile(updatedProfile);
      
      toast.success("Le champ a été mis à jour et verrouillé.");
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error locking field:', error);
      toast.error("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return { 
    showConfirmDialog, 
    setShowConfirmDialog, 
    confirmLockField, 
    handleConfirmLock 
  };
};
