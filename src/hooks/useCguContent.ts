
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

  const updateCguContentSection = async (id: string, updates: { section_content?: string; section_title?: string; section_key?: string }) => {
    try {
      const { error } = await supabase
        .from('cgu_content')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating CGU content section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setCguContentSections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
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

  const addCguContentSection = async () => {
    try {
      const nextOrder = cguContentSections.length > 0 
        ? Math.max(...cguContentSections.map(s => s.display_order)) + 1 
        : 1;
      
      const newSection = {
        section_key: `section_${nextOrder}`,
        section_title: `Nouvelle section ${nextOrder}`,
        section_content: '',
        display_order: nextOrder,
        is_active: true
      };

      const { data, error } = await supabase
        .from('cgu_content')
        .insert(newSection)
        .select()
        .single();

      if (error) {
        console.error('Error adding CGU content section:', error);
        toast.error('Erreur lors de l\'ajout de la section');
        return false;
      }

      setCguContentSections(prev => [...prev, data]);
      toast.success('Section ajoutée avec succès');
      return true;
    } catch (error) {
      console.error('Error adding CGU content section:', error);
      toast.error('Erreur lors de l\'ajout de la section');
      return false;
    }
  };

  const deleteCguContentSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cgu_content')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting CGU content section:', error);
        toast.error('Erreur lors de la suppression');
        return false;
      }

      setCguContentSections(prev => prev.filter(item => item.id !== id));
      toast.success('Section supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting CGU content section:', error);
      toast.error('Erreur lors de la suppression');
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
    addCguContentSection,
    deleteCguContentSection,
    refreshCguContentSections: fetchCguContentSections
  };
};
