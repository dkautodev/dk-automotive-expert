
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfessionalSpaceSetting {
  id: string;
  setting_key: string;
  setting_label: string;
  setting_value: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfessionalSpaceSettings = () => {
  const [professionalSpaceSettings, setProfessionalSpaceSettings] = useState<ProfessionalSpaceSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfessionalSpaceSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_space_settings')
        .select('*')
        .eq('is_active', true)
        .order('setting_key', { ascending: true });

      if (error) {
        console.error('Error fetching professional space settings:', error);
        toast.error('Erreur lors du chargement des paramètres');
        return;
      }

      setProfessionalSpaceSettings(data || []);
    } catch (error) {
      console.error('Error fetching professional space settings:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfessionalSpaceSetting = async (id: string, setting_value: string) => {
    try {
      const { error } = await supabase
        .from('professional_space_settings')
        .update({ setting_value })
        .eq('id', id);

      if (error) {
        console.error('Error updating professional space setting:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setProfessionalSpaceSettings(prev => 
        prev.map(item => 
          item.id === id ? { ...item, setting_value } : item
        )
      );
      toast.success('Paramètre mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating professional space setting:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  const getProfessionalSpaceUrl = () => {
    const urlSetting = professionalSpaceSettings.find(
      setting => setting.setting_key === 'professional_space_url'
    );
    return urlSetting?.setting_value || 'https://app-private.dkautomotive.fr';
  };

  useEffect(() => {
    fetchProfessionalSpaceSettings();
  }, []);

  return {
    professionalSpaceSettings,
    isLoading,
    updateProfessionalSpaceSetting,
    refreshProfessionalSpaceSettings: fetchProfessionalSpaceSettings,
    getProfessionalSpaceUrl
  };
};
