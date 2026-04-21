
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { PageContent } from '@/hooks/usePageContents';

interface LogoSectionProps {
  contents: PageContent[];
  uploadImage: (file: File, blockKey: string) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<PageContent>) => Promise<void>;
  refetch: () => Promise<void>;
}

const LogoSection = ({ contents, uploadImage, updateContent, refetch }: LogoSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploading, handleUpload } = useLogoUpload({
    uploadImage,
    updateContent,
    refetch,
    contents,
    onSuccess: () => setSelectedFile(null)
  });

  const logoContent = contents.find(item => item.block_key === 'logo');
  const currentLogoUrl = logoContent?.content_value || '/upload/64b69a10-c303-48f4-9b56-7bee8e58a109.png';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier doit faire moins de 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const onUpload = () => {
    if (selectedFile && logoContent) {
      handleUpload(selectedFile, logoContent);
    }
  };

  return (
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
                  onClick={onUpload}
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
  );
};

export default LogoSection;
