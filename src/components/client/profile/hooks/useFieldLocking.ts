
import { useState } from "react";
import { ProfileData } from "../types";
import { toast } from "sonner";
import { extendedSupabase } from "@/integrations/supabase/extended-client";

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
      // Mapping between form fields and database columns
      const fieldMapping: Record<string, string> = {
        siret: 'siret_number',
        vat_number: 'vat_number'
      };
      
      // Use the extendedSupabase client which mocks database operations
      const { error } = await extendedSupabase
        .from('user_profiles')
        .update({
          [fieldMapping[fieldToLock]]: tempValue,
          [`${fieldMapping[fieldToLock]}_locked`]: true
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local profile
      if (profile) {
        setProfile({
          ...profile,
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

  return { 
    showConfirmDialog, 
    setShowConfirmDialog, 
    confirmLockField, 
    handleConfirmLock 
  };
};
