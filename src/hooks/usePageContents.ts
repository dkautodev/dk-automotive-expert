
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

      if (error) {
        console.error('Erreur lors du chargement des contenus:', error);
        throw error;
      }
      
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

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }
      
      await fetchContents();
      toast.success('Contenu mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      if (error.message?.includes('row-level security')) {
        toast.error('Vous devez être administrateur pour effectuer cette modification');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    }
  };

  const uploadImage = async (file: File, blockKey: string) => {
    try {
      // Récupérer l'ancienne URL de l'image pour la supprimer
      const currentContent = contents.find(c => c.block_key === blockKey);
      const oldImageUrl = currentContent?.content_json?.url;
      
      // First ensure the bucket exists by calling our setup function
      await fetch('/api/setup-storage', { method: 'POST' });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}/${blockKey}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('page-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erreur lors de l\'upload:', uploadError);
        throw uploadError;
      }

      // Supprimer l'ancienne image si elle existe
      if (oldImageUrl && oldImageUrl.includes('page-images')) {
        const oldFileName = oldImageUrl.split('page-images/')[1];
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from('page-images')
            .remove([oldFileName]);
          
          if (deleteError) {
            console.error('Erreur lors de la suppression de l\'ancienne image:', deleteError);
            // Ne pas bloquer le processus si la suppression échoue
          }
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('page-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      if (error.message?.includes('row-level security')) {
        toast.error('Vous devez être administrateur pour uploader des images');
      } else {
        toast.error('Erreur lors de l\'upload de l\'image');
      }
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
