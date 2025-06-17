
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useFaviconUpload } from '@/hooks/useFaviconUpload';
import { PageContent } from '@/hooks/usePageContents';

interface FaviconSectionProps {
  contents: PageContent[];
  uploadImage: (file: File, blockKey: string) => Promise<string | null>;
  updateContent: (id: string, updates: Partial<PageContent>) => Promise<void>;
  refetch: () => Promise<void>;
}

const FaviconSection = ({ contents, uploadImage, updateContent, refetch }: FaviconSectionProps) => {
  const [selectedFaviconFile, setSelectedFaviconFile] = useState<File | null>(null);
  const { uploadingFavicon, handleFaviconUpload } = useFaviconUpload({
    uploadImage,
    updateContent,
    refetch,
    contents,
    onSuccess: () => setSelectedFaviconFile(null)
  });

  const faviconContent = contents.find(item => item.block_key === 'favicon');
  const currentFaviconUrl = faviconContent?.content_value || '/lovable-uploads/favicon.png';

  const handleFaviconFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'image/png') {
        toast.error('Seuls les fichiers PNG sont acceptés pour le favicon');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier doit faire moins de 5MB');
        return;
      }
      
      setSelectedFaviconFile(file);
    }
  };

  const onFaviconUpload = () => {
    if (selectedFaviconFile) {
      handleFaviconUpload(selectedFaviconFile, faviconContent);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-dk-navy">
          Gestion du Favicon
        </CardTitle>
        <p className="text-sm text-gray-600">
          Changez l'icône qui apparaît dans l'onglet du navigateur (format PNG uniquement)
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
                  <span>Sélectionner un fichier PNG</span>
                </div>
                <input
                  id="favicon-upload"
                  type="file"
                  accept="image/png"
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
                  onClick={onFaviconUpload}
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
            <p>• Format accepté : PNG uniquement</p>
            <p>• Taille maximale : 5MB</p>
            <p>• Dimensions recommandées : 32x32 ou 16x16 pixels</p>
            <p>• Le fichier sera renommé "favicon.png"</p>
            <p>• L'ancien favicon sera automatiquement remplacé</p>
            <p>• Le changement sera visible immédiatement dans l'onglet</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default FaviconSection;
