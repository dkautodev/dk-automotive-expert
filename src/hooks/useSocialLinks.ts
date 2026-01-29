import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SocialLink {
  id: string;
  platform: string;
  platform_label: string;
  url: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSocialLinks((data as SocialLink[]) || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast.error('Erreur lors du chargement des liens sociaux');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Lien mis à jour avec succès');
      await fetchSocialLinks();
      return true;
    } catch (error) {
      console.error('Error updating social link:', error);
      toast.error('Erreur lors de la mise à jour');
      return false;
    }
  };

  const addSocialLink = async () => {
    try {
      const maxOrder = Math.max(...socialLinks.map(s => s.display_order), 0);
      
      const { error } = await supabase
        .from('social_links')
        .insert({
          platform: `social_${Date.now()}`,
          platform_label: 'Nouveau réseau',
          url: '',
          icon: 'link',
          display_order: maxOrder + 1
        });

      if (error) throw error;
      
      toast.success('Réseau social ajouté');
      await fetchSocialLinks();
      return true;
    } catch (error) {
      console.error('Error adding social link:', error);
      toast.error('Erreur lors de l\'ajout');
      return false;
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Réseau social supprimé');
      await fetchSocialLinks();
      return true;
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  return {
    socialLinks,
    isLoading,
    updateSocialLink,
    addSocialLink,
    deleteSocialLink,
    refetch: fetchSocialLinks
  };
};
