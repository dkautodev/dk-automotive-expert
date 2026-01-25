
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

  const updatePrivacyPolicySection = async (id: string, updates: { section_content?: string; section_title?: string; section_key?: string }) => {
    try {
      const { error } = await supabase
        .from('privacy_policy')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating privacy policy section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setPrivacyPolicySections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
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

  const addPrivacyPolicySection = async () => {
    try {
      const nextOrder = privacyPolicySections.length > 0 
        ? Math.max(...privacyPolicySections.map(s => s.display_order)) + 1 
        : 1;
      
      const newSection = {
        section_key: `section_${nextOrder}`,
        section_title: `Nouvelle section ${nextOrder}`,
        section_content: '',
        display_order: nextOrder,
        is_active: true
      };

      const { data, error } = await supabase
        .from('privacy_policy')
        .insert(newSection)
        .select()
        .single();

      if (error) {
        console.error('Error adding privacy policy section:', error);
        toast.error('Erreur lors de l\'ajout de la section');
        return false;
      }

      setPrivacyPolicySections(prev => [...prev, data]);
      toast.success('Section ajoutée avec succès');
      return true;
    } catch (error) {
      console.error('Error adding privacy policy section:', error);
      toast.error('Erreur lors de l\'ajout de la section');
      return false;
    }
  };

  const deletePrivacyPolicySection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('privacy_policy')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting privacy policy section:', error);
        toast.error('Erreur lors de la suppression');
        return false;
      }

      setPrivacyPolicySections(prev => prev.filter(item => item.id !== id));
      toast.success('Section supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting privacy policy section:', error);
      toast.error('Erreur lors de la suppression');
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
    addPrivacyPolicySection,
    deletePrivacyPolicySection,
    refreshPrivacyPolicySections: fetchPrivacyPolicySections
  };
};
