
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageContents } from '@/hooks/usePageContents';
import { Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const LogoEditor = () => {
  const { contents, isLoading, updateContent, uploadImage } = usePageContents('navbar');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Find the logo content block
  const logoContent = contents.find(item => item.block_key === 'logo');
  const currentLogoUrl = logoContent?.content_value || '/lovable-uploads/64b69a10-c303-48f4-9b56-7bee8e58a109.png';

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(selectedFile, 'logo');
      
      if (imageUrl) {
        if (logoContent) {
          // Update existing logo content
          await updateContent(logoContent.id, { content_value: imageUrl });
        } else {
          // Create new logo content block (this would need a separate function)
          toast.error('Impossible de créer le bloc logo. Contactez un développeur.');
        }
        setSelectedFile(null);
        toast.success('Logo mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload du logo');
    } finally {
      setUploading(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default LogoEditor;
