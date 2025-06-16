
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PrivacyPolicySection {
  id: string;
  section_key: string;
  section_title: string;
  section_content: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePrivacyPolicy = () => {
  const [privacyPolicySections, setPrivacyPolicySections] = useState<PrivacyPolicySection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrivacyPolicySections = async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_policy')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching privacy policy sections:', error);
        toast.error('Erreur lors du chargement des sections de politique de confidentialité');
        return;
      }

      setPrivacyPolicySections(data || []);
    } catch (error) {
      console.error('Error fetching privacy policy sections:', error);
      toast.error('Erreur lors du chargement des sections de politique de confidentialité');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrivacyPolicySection = async (id: string, section_content: string) => {
    try {
      const { error } = await supabase
        .from('privacy_policy')
        .update({ section_content })
        .eq('id', id);

      if (error) {
        console.error('Error updating privacy policy section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setPrivacyPolicySections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, section_content } : item
        )
      );
      toast.success('Section mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating privacy policy section:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  useEffect(() => {
    fetchPrivacyPolicySections();
  }, []);

  return {
    privacyPolicySections,
    isLoading,
    updatePrivacyPolicySection,
    refreshPrivacyPolicySections: fetchPrivacyPolicySections
  };
};
