
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

  const deleteOldImage = async (oldImageUrl: string) => {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const url = new URL(oldImageUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'page-images');
      
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        console.log('Suppression de l\'ancienne image:', filePath);
        
        const { error } = await supabase.storage
          .from('page-images')
          .remove([filePath]);

        if (error) {
          console.warn('Erreur lors de la suppression de l\'ancienne image:', error);
          // On ne fait que logger l'erreur, ça ne doit pas bloquer l'upload
        } else {
          console.log('Ancienne image supprimée avec succès:', filePath);
        }
      }
    } catch (error) {
      console.warn('Erreur lors de l\'extraction du chemin de l\'ancienne image:', error);
      // On continue même si on n'arrive pas à supprimer l'ancienne image
    }
  };

  const uploadImage = async (file: File, blockKey: string) => {
    try {
      // Récupérer l'ancienne URL avant l'upload
      const currentContent = contents.find(c => c.block_key === blockKey);
      const oldImageUrl = currentContent?.content_json?.url || currentContent?.content_value;

      const fileExt = file.name.split('.').pop();
      const fileName = `${pageSlug}/${blockKey}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('page-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Erreur lors de l\'upload:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('page-images')
        .getPublicUrl(fileName);

      // Supprimer l'ancienne image après l'upload réussi
      if (oldImageUrl) {
        await deleteOldImage(oldImageUrl);
      }

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
