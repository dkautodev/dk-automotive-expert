
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Upload, Image as ImageIcon, Edit, Save, X } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, blockKey: string, blockId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImages(prev => [...prev, blockKey]);
    
    try {
      const imageUrl = await uploadImage(file, blockKey);
      if (imageUrl) {
        await updateContent(blockId, {
          content_json: { url: imageUrl }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploadingImages(prev => prev.filter(key => key !== blockKey));
    }
  };

  const renderEditField = (content: any) => {
    const currentValue = editValues;
    const isEditing = editingBlock === content.block_key;

    if (content.block_type === 'image') {
      const imageUrl = content.content_json?.url;
      
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`image-${content.block_key}`} className="cursor-pointer">
                <Button variant="outline" size="sm" asChild disabled={uploadingImages.includes(content.block_key)}>
                  <span>
                    {uploadingImages.includes(content.block_key) ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {imageUrl ? 'Changer l\'image' : 'Ajouter une image'}
                  </span>
                </Button>
              </Label>
              <input
                id={`image-${content.block_key}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, content.block_key, content.id)}
                className="hidden"
              />
              {imageUrl && (
                <p className="text-xs text-gray-500">Image actuelle chargée</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (isEditing) {
      const hasTitle = 'title' in currentValue;
      const hasSubtitle = 'subtitle' in currentValue;
      const hasContent = 'content' in currentValue;

      return (
        <div className="space-y-4">
          {hasTitle && (
            <div>
              <Label>Titre</Label>
              <Input
                value={currentValue.title || ''}
                onChange={(e) => setEditValues({ ...currentValue, title: e.target.value })}
                placeholder="Titre"
              />
            </div>
          )}
          {hasSubtitle && (
            <div>
              <Label>Sous-titre</Label>
              <Input
                value={currentValue.subtitle || ''}
                onChange={(e) => setEditValues({ ...currentValue, subtitle: e.target.value })}
                placeholder="Sous-titre"
              />
            </div>
          )}
          {hasContent && (
            <div>
              <Label>Contenu</Label>
              <Textarea
                value={currentValue.content || ''}
                onChange={(e) => setEditValues({ ...currentValue, content: e.target.value })}
                placeholder="Contenu"
                rows={4}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSave(content.id, content.block_key)}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        </div>
      );
    }

    // Display mode
    const contentData = content.content_json || {};
    return (
      <div className="space-y-2">
        {'title' in contentData && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Titre:</Label>
            <p className="text-sm">{contentData.title}</p>
          </div>
        )}
        {'subtitle' in contentData && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Sous-titre:</Label>
            <p className="text-sm">{contentData.subtitle}</p>
          </div>
        )}
        {'content' in contentData && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Contenu:</Label>
            <p className="text-sm whitespace-pre-wrap">{contentData.content}</p>
          </div>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleEdit(content.block_key, contentData)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>
    );
  };

  // Group contents by sections for better organization
  const groupedContents = {
    hero: contents.filter(c => c.block_key.startsWith('hero')),
    intro: contents.filter(c => c.block_key.startsWith('intro')),
    team: contents.filter(c => c.block_key.startsWith('team')),
    values: contents.filter(c => c.block_key.startsWith('value')),
    services: contents.filter(c => c.block_key.startsWith('services')),
    contact: contents.filter(c => c.block_key.startsWith('contact'))
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dk-navy mb-2">
          Gestion de la page À propos
        </h1>
        <p className="text-gray-600">
          Modifiez les textes et images de la page À propos de votre site.
        </p>
      </div>

      {/* Section Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section Hero (Bannière principale)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.hero.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3 capitalize">
                {content.block_key.replace('hero_', '').replace('_', ' ')}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.intro.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key.includes('title') ? 'Titre' : 'Contenu'}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section Équipe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section Équipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.team.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key.includes('title') ? 'Titre' : 
                 content.block_key.includes('content') ? 'Contenu' : 'Image équipe'}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section Valeurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nos Valeurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Titre des valeurs */}
          {contents.filter(c => c.block_key === 'values_title').map((content) => (
            <div key={content.id}>
              <h4 className="font-semibold mb-4 text-dk-navy">Titre de la section</h4>
              {renderEditField(content)}
            </div>
          ))}
          
          {/* Valeurs individuelles */}
          {[1, 2, 3].map((valueNum) => {
            const valueContent = groupedContents.values.find(c => 
              c.block_key === `value_${valueNum}`
            );
            
            if (!valueContent) return null;
            
            return (
              <div key={valueNum} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-dk-navy">
                  Valeur {valueNum}
                </h4>
                {renderEditField(valueContent)}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Section Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.services.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key.includes('title') ? 'Titre' : 'Contenu'}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.contact.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key.includes('title') ? 'Titre' : 'Contenu'}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPageEditor;
