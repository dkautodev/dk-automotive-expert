import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageContents } from '@/hooks/usePageContents';
import { Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const LogoEditor = () => {
  const { contents, isLoading, updateContent, uploadImage, refetch } = usePageContents('navbar');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [selectedFaviconFile, setSelectedFaviconFile] = useState<File | null>(null);

  // Find the logo content block
  const logoContent = contents.find(item => item.block_key === 'logo');
  const currentLogoUrl = logoContent?.content_value || '/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png';
  
  // Find the favicon content block
  const faviconContent = contents.find(item => item.block_key === 'favicon');
  const currentFaviconUrl = faviconContent?.content_value || '/lovable-uploads/7e8b2843-fdee-4445-992b-9078e0228e73.png';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier doit faire moins de 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleFaviconFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier doit faire moins de 5MB');
        return;
      }
      
      setSelectedFaviconFile(file);
    }
  };

  const deleteOldLogo = async (logoUrl: string) => {
    try {
      // Check if the logo is from our storage (contains 'page-images')
      if (logoUrl && logoUrl.includes('page-images')) {
        const fileName = logoUrl.split('page-images/')[1];
        if (fileName) {
          const { error: deleteError } = await supabase.storage
            .from('page-images')
            .remove([fileName]);
          
          if (deleteError) {
            console.error('Erreur lors de la suppression de l\'ancien logo:', deleteError);
          } else {
            console.log('Ancien logo supprimé avec succès');
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ancien logo:', error);
    }
  };

  const deleteOldFavicon = async (faviconUrl: string) => {
    try {
      // Check if the favicon is from our storage (contains 'page-images')
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
      
      // Update the existing favicon link with the ID
      const existingFavicon = document.getElementById('favicon-link') as HTMLLinkElement;
      if (existingFavicon) {
        // Force browser to reload favicon by adding a timestamp
        const timestamp = new Date().getTime();
        existingFavicon.href = `${faviconUrl}?v=${timestamp}`;
        console.log('Favicon updated successfully in existing link');
      } else {
        // Remove any existing favicon links without ID
        const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
        existingFavicons.forEach(link => link.remove());
        
        // Create new favicon link
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.type = 'image/png';
        faviconLink.id = 'favicon-link';
        
        // Add to document head
        document.head.appendChild(faviconLink);
        
        // Force browser to reload favicon by adding a timestamp
        const timestamp = new Date().getTime();
        faviconLink.href = `${faviconUrl}?v=${timestamp}`;
        
        console.log('Favicon updated successfully in new link');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favicon dans le DOM:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Store the old logo URL before uploading the new one
      const oldLogoUrl = currentLogoUrl;
      
      const imageUrl = await uploadImage(selectedFile, 'logo');
      
      if (imageUrl && logoContent) {
        // Update existing logo content
        await updateContent(logoContent.id, { content_value: imageUrl });
        
        // Delete the old logo after successful update
        if (oldLogoUrl && oldLogoUrl !== imageUrl) {
          await deleteOldLogo(oldLogoUrl);
        }
        
        setSelectedFile(null);
        // Refresh the contents to get the updated logo
        await refetch();
        toast.success('Logo mis à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour du logo');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
    }
  };

  const handleFaviconUpload = async () => {
    if (!selectedFaviconFile) return;

    setUploadingFavicon(true);
    try {
      console.log('Starting favicon upload...');
      
      // Store the old favicon URL before uploading the new one
      const oldFaviconUrl = currentFaviconUrl;
      
      const imageUrl = await uploadImage(selectedFaviconFile, 'favicon');
      console.log('Favicon uploaded successfully:', imageUrl);
      
      if (imageUrl) {
        if (faviconContent) {
          // Update existing favicon content
          console.log('Updating existing favicon content...');
          await updateContent(faviconContent.id, { content_value: imageUrl });
        } else {
          // Create new favicon content entry if it doesn't exist
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
        
        // Update favicon in the HTML head immediately
        updateFaviconInHtml(imageUrl);
        
        // Delete the old favicon after successful update
        if (oldFaviconUrl && oldFaviconUrl !== imageUrl) {
          await deleteOldFavicon(oldFaviconUrl);
        }
        
        setSelectedFaviconFile(null);
        // Refresh the contents to get the updated favicon
        await refetch();
        toast.success('Favicon mis à jour avec succès');
        
        // Additional DOM update after a short delay to ensure it takes effect
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Section Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-dk-navy">
            Gestion du Logo
          </CardTitle>
          <p className="text-sm text-gray-600">
            Changez le logo qui apparaît dans la barre de navigation
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Logo actuel */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dk-navy">Logo actuel</h3>
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border">
              <img 
                src={currentLogoUrl} 
                alt="Logo actuel" 
                className="max-h-16 max-w-48 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Upload nouveau logo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dk-navy">Changer le logo</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Sélectionner un fichier</span>
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="space-y-4">
                  {/* Aperçu du nouveau logo */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium mb-2">Aperçu :</p>
                    <div className="flex items-center justify-center p-4 bg-white rounded border">
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Aperçu du nouveau logo" 
                        className="max-h-16 max-w-48 object-contain"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-dk-navy hover:bg-dk-blue"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder le nouveau logo
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>• Formats acceptés : PNG, JPG, GIF, WebP</p>
              <p>• Taille maximale : 5MB</p>
              <p>• Dimensions recommandées : 200x50 pixels environ</p>
              <p>• L'ancien logo sera automatiquement supprimé</p>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Section Favicon */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-dk-navy">
            Gestion du Favicon
          </CardTitle>
          <p className="text-sm text-gray-600">
            Changez l'icône qui apparaît dans l'onglet du navigateur
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Favicon actuel */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dk-navy">Favicon actuel</h3>
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border">
              <img 
                src={currentFaviconUrl} 
                alt="Favicon actuel" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Upload nouveau favicon */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dk-navy">Changer le favicon</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="favicon-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Sélectionner un fichier</span>
                  </div>
                  <input
                    id="favicon-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconFileSelect}
                    className="hidden"
                  />
                </label>
                
                {selectedFaviconFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ImageIcon className="w-4 h-4" />
                    <span>{selectedFaviconFile.name}</span>
                  </div>
                )}
              </div>

              {selectedFaviconFile && (
                <div className="space-y-4">
                  {/* Aperçu du nouveau favicon */}
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium mb-2">Aperçu :</p>
                    <div className="flex items-center justify-center p-4 bg-white rounded border">
                      <img 
                        src={URL.createObjectURL(selectedFaviconFile)} 
                        alt="Aperçu du nouveau favicon" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleFaviconUpload}
                    disabled={uploadingFavicon}
                    className="bg-dk-navy hover:bg-dk-blue"
                  >
                    {uploadingFavicon ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder le nouveau favicon
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>• Formats acceptés : PNG, JPG, GIF, WebP</p>
              <p>• Taille maximale : 5MB</p>
              <p>• Dimensions recommandées : 32x32 ou 16x16 pixels</p>
              <p>• L'ancien favicon sera automatiquement supprimé</p>
              <p>• Le changement sera visible immédiatement dans l'onglet</p>
            </div>
          </div>

        </CardContent>
      </Card>
      
    </div>
  );
};

export default LogoEditor;
