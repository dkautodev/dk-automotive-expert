
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PageContent {
  id: string;
  page_slug: string;
  block_key: string;
  block_type: 'text' | 'image' | 'html';
  content_value?: string;
  content_json?: any;
  display_order: number;
  is_active: boolean;
}

export const usePageContents = (pageSlug: string) => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      
      // Type assertion pour s'assurer que block_type correspond à nos types attendus
      const typedData: PageContent[] = (data || []).map(item => ({
        ...item,
        block_type: item.block_type as 'text' | 'image' | 'html'
      }));
      
      setContents(typedData);
    } catch (error) {
      console.error('Erreur lors du chargement des contenus:', error);
      toast.error('Erreur lors du chargement des contenus');
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (id: string, updates: Partial<PageContent>) => {
    try {
      const { error } = await supabase
        .from('page_contents')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchContents();
      toast.success('Contenu mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const uploadImage = async (file: File, blockKey: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}/${blockKey}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('page-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('page-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      return null;
    }
  };

  useEffect(() => {
    fetchContents();
  }, [pageSlug]);

  return {
    contents,
    isLoading,
    updateContent,
    uploadImage,
    refetch: fetchContents
  };
};
