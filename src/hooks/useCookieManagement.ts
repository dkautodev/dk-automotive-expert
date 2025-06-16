
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

  const updateCookieManagementSection = async (id: string, section_content: string) => {
    try {
      const { error } = await supabase
        .from('cookie_management')
        .update({ section_content })
        .eq('id', id);

      if (error) {
        console.error('Error updating cookie management section:', error);
        toast.error('Erreur lors de la mise à jour');
        return false;
      }

      setCookieManagementSections(prev => 
        prev.map(item => 
          item.id === id ? { ...item, section_content } : item
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

  useEffect(() => {
    fetchCookieManagementSections();
  }, []);

  return {
    cookieManagementSections,
    isLoading,
    updateCookieManagementSection,
    refreshCookieManagementSections: fetchCookieManagementSections
  };
};
