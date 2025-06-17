
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, Image, Type, Edit, Save, X } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';
import { toast } from 'sonner';

const AboutPageEditor = () => {
  const { contents, isLoading, updateContent, uploadImage } = useAboutPageContents();
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);

  const handleEdit = (blockKey: string, currentData: any) => {
    setEditingBlock(blockKey);
    setEditValues(currentData || {});
  };

  const handleSave = async (blockId: string, blockKey: string) => {
    try {
      await updateContent(blockId, {
        content_json: editValues
      });
      setEditingBlock(null);
      setEditValues({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setEditingBlock(null);
    setEditValues({});
  };

  const handleImageUpload = async (file: File, blockKey: string, blockId: string) => {
    setUploadingImages(prev => [...prev, blockKey]);
    
    try {
      const imageUrl = await uploadImage(file, blockKey);
      if (imageUrl) {
        await updateContent(blockId, {
          content_json: { url: imageUrl }
        });
        toast.success('Image mise à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImages(prev => prev.filter(key => key !== blockKey));
    }
  };

  const renderBlockEditor = (block: any) => {
    const isEditing = editingBlock === block.block_key;
    const currentData = block.content_json || {};

    if (block.block_type === 'image') {
      return (
        <Card key={block.id} className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              {block.block_key.replace(/_/g, ' ').toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentData.url && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={currentData.url} 
                    alt={block.block_key}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file, block.block_key, block.id);
                    }
                  }}
                  disabled={uploadingImages.includes(block.block_key)}
                  className="flex-1"
                />
                {uploadingImages.includes(block.block_key) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={block.id} className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            {block.block_key.replace(/_/g, ' ').toUpperCase()}
          </CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(block.block_key, currentData)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              {currentData.title !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Titre</label>
                  <Input
                    value={editValues.title || ''}
                    onChange={(e) => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titre"
                  />
                </div>
              )}
              
              {currentData.subtitle !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Sous-titre</label>
                  <Input
                    value={editValues.subtitle || ''}
                    onChange={(e) => setEditValues(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Sous-titre"
                  />
                </div>
              )}
              
              {currentData.content !== undefined && (
                <div>
                  <label className="block text-sm font-medium mb-2">Contenu</label>
                  <Textarea
                    value={editValues.content || ''}
                    onChange={(e) => setEditValues(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Contenu"
                    rows={4}
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={() => handleSave(block.id, block.block_key)}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {currentData.title && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Titre:</span>
                  <p className="text-base">{currentData.title}</p>
                </div>
              )}
              {currentData.subtitle && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Sous-titre:</span>
                  <p className="text-base">{currentData.subtitle}</p>
                </div>
              )}
              {currentData.content && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Contenu:</span>
                  <p className="text-base whitespace-pre-wrap">{currentData.content}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des contenus...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dk-navy mb-2">
          Gestion de la page À propos
        </h1>
        <p className="text-gray-600">
          Modifiez les textes et images de la page À propos de votre site.
        </p>
      </div>

      <div className="space-y-4">
        {contents.map(renderBlockEditor)}
      </div>
    </div>
  );
};

export default AboutPageEditor;
