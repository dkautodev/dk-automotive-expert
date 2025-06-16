
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CgvContentSection {
  id: string;
  section_key: string;
  section_title: string;
  section_content: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCgvContent = () => {
  const [cgvContentSections, setCgvContentSections] = useState<CgvContentSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCgvContentSections = async () => {
    try {
      const { data, error } = await supabase
        .from('cgv_content')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching CGV content sections:', error);
        toast.error('Erreur lors du chargement des sections CGV');
        return;
      }

      setCgvContentSections(data || []);
    } catch (error) {
      console.error('Error fetching CGV content sections:', error);
      toast.error('Erreur lors du chargement des sections CGV');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCgvContentSection = async (id: string, section_content: string) => {
    try {
      const { error } = await supabase
        .from('cgv_content')
        .update({ section_content })
        .eq('id', id);

      if (error) {
        console.error('Error updating CGV content section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setCgvContentSections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, section_content } : item
        )
      );
      toast.success('Section mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating CGV content section:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  useEffect(() => {
    fetchCgvContentSections();
  }, []);

  return {
    cgvContentSections,
    isLoading,
    updateCgvContentSection,
    refreshCgvContentSections: fetchCgvContentSections
  };
};
