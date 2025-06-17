
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PageContent } from '@/hooks/usePageContents';

interface UseFaviconUploadProps {
  uploadImage: (file: File, blockKey: string) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<PageContent>) => Promise<void>;
  refetch: () => Promise<void>;
  contents: PageContent[];
  onSuccess: () => void;
}

export const useFaviconUpload = ({
  uploadImage,
  updateContent,
  refetch,
  contents,
  onSuccess
}: UseFaviconUploadProps) => {
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const deleteOldFavicon = async (faviconUrl: string) => {
    try {
      if (faviconUrl && faviconUrl.includes('page-images')) {
        const fileName = faviconUrl.split('page-images/')[1];
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from('page-images')
            .remove([fileName]);
          
          if (deleteError) {
            console.error('Erreur lors de la suppression de l\'ancien favicon:', deleteError);
          } else {
            console.log('Ancien favicon supprimé avec succès');
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ancien favicon:', error);
    }
  };

  const updateFaviconInHtml = (faviconUrl: string) => {
    try {
      console.log('Updating favicon in HTML to:', faviconUrl);
      
      const existingFavicon = document.getElementById('favicon-link') as HTMLLinkElement;
      if (existingFavicon) {
        const timestamp = new Date().getTime();
        existingFavicon.href = `/lovable-uploads/favicon.png?v=${timestamp}`;
        console.log('Favicon updated successfully in existing link');
      } else {
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(link => link.remove());
        
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.type = 'image/png';
        faviconLink.id = 'favicon-link';
        
        document.head.appendChild(faviconLink);
        
        const timestamp = new Date().getTime();
        faviconLink.href = `/lovable-uploads/favicon.png?v=${timestamp}`;
        
        console.log('Favicon updated successfully in new link');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favicon dans le DOM:', error);
    }
  };

  const uploadFaviconToPublic = async (selectedFaviconFile: File) => {
    try {
      // Upload avec le nom fixe "favicon.png"
      const { error: uploadError } = await supabase.storage
        .from('page-images')
        .upload('public/favicon.png', selectedFaviconFile, {
          upsert: true // remplace le fichier s'il existe déjà
        });

      if (uploadError) {
        console.error('Erreur lors de l\'upload:', uploadError);
        throw uploadError;
      }

      return '/lovable-uploads/favicon.png';
    } catch (error) {
      console.error('Erreur lors de l\'upload du favicon:', error);
      throw error;
    }
  };

  const handleFaviconUpload = async (selectedFaviconFile: File, faviconContent: PageContent | undefined) => {
    // Vérifier que c'est un fichier PNG
    if (selectedFaviconFile.type !== 'image/png') {
      toast.error('Seuls les fichiers PNG sont acceptés pour le favicon');
      return;
    }

    setUploadingFavicon(true);
    try {
      console.log('Starting favicon upload...');
      
      const oldFaviconUrl = faviconContent?.content_value || '';
      
      // Upload le fichier avec le nom "favicon.png"
      const imageUrl = await uploadFaviconToPublic(selectedFaviconFile);
      console.log('Favicon uploaded successfully:', imageUrl);
      
      if (imageUrl) {
        if (faviconContent) {
          console.log('Updating existing favicon content...');
          await updateContent(faviconContent.id, { content_value: imageUrl });
        } else {
          console.log('Creating new favicon content entry...');
          const { error } = await supabase
            .from('page_contents')
            .insert({
              page_slug: 'navbar',
              block_key: 'favicon',
              block_type: 'image',
              content_value: imageUrl,
              display_order: 2,
              is_active: true
            });
            
          if (error) {
            console.error('Erreur lors de la création du favicon:', error);
            throw error;
          }
        }
        
        updateFaviconInHtml(imageUrl);
        
        if (oldFaviconUrl && oldFaviconUrl !== imageUrl) {
          await deleteOldFavicon(oldFaviconUrl);
        }
        
        onSuccess();
        await refetch();
        toast.success('Favicon mis à jour avec succès');
        
        setTimeout(() => {
          updateFaviconInHtml(imageUrl);
        }, 100);
        
      } else {
        toast.error('Erreur lors de la mise à jour du favicon');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload du favicon:', error);
      toast.error('Erreur lors de l\'upload du favicon');
    } finally {
      setUploadingFavicon(false);
    }
  };

  return {
    uploadingFavicon,
    handleFaviconUpload
  };
};
