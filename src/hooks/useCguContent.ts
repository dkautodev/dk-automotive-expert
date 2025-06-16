
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CguContentSection {
  id: string;
  section_key: string;
  section_title: string;  
  section_content: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCguContent = () => {
  const [cguContentSections, setCguContentSections] = useState<CguContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCguContentSections = async () => {
    try {
      const { data, error } = await supabase
        .from('cgu_content')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching CGU content sections:', error);
        toast.error('Erreur lors du chargement des sections CGU');
        return;
      }

      setCguContentSections(data || []);
    } catch (error) {
      console.error('Error fetching CGU content sections:', error);
      toast.error('Erreur lors du chargement des sections CGU');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCguContentSection = async (id: string, section_content: string) => {
    try {
      const { error } = await supabase
        .from('cgu_content')
        .update({ section_content })
        .eq('id', id);

      if (error) {
        console.error('Error updating CGU content section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setCguContentSections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, section_content } : item
        )
      );
      toast.success('Section mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating CGU content section:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  useEffect(() => {
    fetchCguContentSections();
  }, []);

  return {
    cguContentSections,
    isLoading,
    updateCguContentSection,
    refreshCguContentSections: fetchCguContentSections
  };
};
