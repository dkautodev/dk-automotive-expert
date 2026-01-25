
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

  const updateCgvContentSection = async (id: string, updates: { section_content?: string; section_title?: string; section_key?: string }) => {
    try {
      const { error } = await supabase
        .from('cgv_content')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating CGV content section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setCgvContentSections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
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

  const addCgvContentSection = async () => {
    try {
      const nextOrder = cgvContentSections.length > 0 
        ? Math.max(...cgvContentSections.map(s => s.display_order)) + 1 
        : 1;
      
      const newSection = {
        section_key: `section_${nextOrder}`,
        section_title: `Nouvelle section ${nextOrder}`,
        section_content: '',
        display_order: nextOrder,
        is_active: true
      };

      const { data, error } = await supabase
        .from('cgv_content')
        .insert(newSection)
        .select()
        .single();

      if (error) {
        console.error('Error adding CGV content section:', error);
        toast.error('Erreur lors de l\'ajout de la section');
        return false;
      }

      setCgvContentSections(prev => [...prev, data]);
      toast.success('Section ajoutée avec succès');
      return true;
    } catch (error) {
      console.error('Error adding CGV content section:', error);
      toast.error('Erreur lors de l\'ajout de la section');
      return false;
    }
  };

  const deleteCgvContentSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cgv_content')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting CGV content section:', error);
        toast.error('Erreur lors de la suppression');
        return false;
      }

      setCgvContentSections(prev => prev.filter(item => item.id !== id));
      toast.success('Section supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting CGV content section:', error);
      toast.error('Erreur lors de la suppression');
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
    addCgvContentSection,
    deleteCgvContentSection,
    refreshCgvContentSections: fetchCgvContentSections
  };
};
