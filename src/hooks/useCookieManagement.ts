
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CookieManagementSection {
  id: string;
  section_key: string;
  section_title: string;
  section_content: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCookieManagement = () => {
  const [cookieManagementSections, setCookieManagementSections] = useState<CookieManagementSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCookieManagementSections = async () => {
    try {
      const { data, error } = await supabase
        .from('cookie_management')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching cookie management sections:', error);
        toast.error('Erreur lors du chargement des sections de gestion des cookies');
        return;
      }

      setCookieManagementSections(data || []);
    } catch (error) {
      console.error('Error fetching cookie management sections:', error);
      toast.error('Erreur lors du chargement des sections de gestion des cookies');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCookieManagementSection = async (id: string, updates: { section_content?: string; section_title?: string; section_key?: string }) => {
    try {
      const { error } = await supabase
        .from('cookie_management')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating cookie management section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setCookieManagementSections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      toast.success('Section mise à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating cookie management section:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  const addCookieManagementSection = async () => {
    try {
      const nextOrder = cookieManagementSections.length > 0 
        ? Math.max(...cookieManagementSections.map(s => s.display_order)) + 1 
        : 1;
      
      const newSection = {
        section_key: `section_${nextOrder}`,
        section_title: `Nouvelle section ${nextOrder}`,
        section_content: '',
        display_order: nextOrder,
        is_active: true
      };

      const { data, error } = await supabase
        .from('cookie_management')
        .insert(newSection)
        .select()
        .single();

      if (error) {
        console.error('Error adding cookie management section:', error);
        toast.error('Erreur lors de l\'ajout de la section');
        return false;
      }

      setCookieManagementSections(prev => [...prev, data]);
      toast.success('Section ajoutée avec succès');
      return true;
    } catch (error) {
      console.error('Error adding cookie management section:', error);
      toast.error('Erreur lors de l\'ajout de la section');
      return false;
    }
  };

  const deleteCookieManagementSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cookie_management')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting cookie management section:', error);
        toast.error('Erreur lors de la suppression');
        return false;
      }

      setCookieManagementSections(prev => prev.filter(item => item.id !== id));
      toast.success('Section supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting cookie management section:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  useEffect(() => {
    fetchCookieManagementSections();
  }, []);

  return {
    cookieManagementSections,
    isLoading,
    updateCookieManagementSection,
    addCookieManagementSection,
    deleteCookieManagementSection,
    refreshCookieManagementSections: fetchCookieManagementSections
  };
};
