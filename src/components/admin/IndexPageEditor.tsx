import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePageContents, PageContent } from '@/hooks/usePageContents';
import { Edit, Save, Upload, Image as ImageIcon } from 'lucide-react';

const IndexPageEditor = () => {
  const { contents, isLoading, updateContent, uploadImage } = usePageContents('index');
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});

  const getContentValue = (content: PageContent) => {
    if (content.content_json) {
      return content.content_json;
    }
    return { value: content.content_value };
  };

  const handleEdit = (blockKey: string, content: PageContent) => {
    setEditingBlock(blockKey);
    setEditValues({ [blockKey]: getContentValue(content) });
  };

  const handleSave = async (content: PageContent) => {
    const newValue = editValues[content.block_key];
    await updateContent(content.id, {
      content_json: newValue,
      content_value: null
    });
    setEditingBlock(null);
    setEditValues({});
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, content: PageContent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImage(file, content.block_key);
    if (imageUrl) {
      await updateContent(content.id, {
        content_json: { url: imageUrl }
      });
    }
  };

  const renderEditField = (content: PageContent) => {
    const currentValue = editValues[content.block_key] || getContentValue(content);
    const isEditing = editingBlock === content.block_key;

    if (content.block_type === 'image') {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              {currentValue?.url ? (
                <img src={currentValue.url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <Label htmlFor={`image-${content.block_key}`} className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Changer l'image
                  </span>
                </Button>
              </Label>
              <input
                id={`image-${content.block_key}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, content)}
                className="hidden"
              />
            </div>
          </div>
        </div>
      );
    }

    if (isEditing) {
      const hasTitle = 'title' in currentValue;
      const hasSubtitle = 'subtitle' in currentValue;
      const hasDescription = 'description' in currentValue;
      const hasContent = 'content' in currentValue;
      const hasText = 'text' in currentValue;

      return (
        <div className="space-y-4">
          {hasTitle && (
            <div>
              <Label>Titre</Label>
              <Input
                value={currentValue.title || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, title: e.target.value }
                })}
              />
            </div>
          )}
          {hasSubtitle && (
            <div>
              <Label>Sous-titre</Label>
              <Input
                value={currentValue.subtitle || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, subtitle: e.target.value }
                })}
              />
            </div>
          )}
          {hasDescription && (
            <div>
              <Label>Description</Label>
              <Textarea
                value={currentValue.description || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, description: e.target.value }
                })}
                rows={3}
              />
            </div>
          )}
          {hasContent && (
            <div>
              <Label>Contenu</Label>
              <Textarea
                value={currentValue.content || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, content: e.target.value }
                })}
                rows={4}
              />
            </div>
          )}
          {hasText && (
            <div>
              <Label>Texte</Label>
              <Input
                value={currentValue.text || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, text: e.target.value }
                })}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSave(content)}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setEditingBlock(null)}
            >
              Annuler
            </Button>
          </div>
        </div>
      );
    }

    // Display mode
    return (
      <div className="space-y-2">
        {'title' in currentValue && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Titre:</Label>
            <p className="text-sm">{currentValue.title}</p>
          </div>
        )}
        {'subtitle' in currentValue && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Sous-titre:</Label>
            <p className="text-sm">{currentValue.subtitle}</p>
          </div>
        )}
        {'description' in currentValue && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Description:</Label>
            <p className="text-sm">{currentValue.description}</p>
          </div>
        )}
        {'content' in currentValue && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Contenu:</Label>
            <p className="text-sm">{currentValue.content}</p>
          </div>
        )}
        {'text' in currentValue && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Texte:</Label>
            <p className="text-sm">{currentValue.text}</p>
          </div>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleEdit(content.block_key, content)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>
    );
  };

  const groupedContents = {
    hero: contents.filter(c => c.block_key.startsWith('hero')),
    trust_points: contents.filter(c => c.block_key.startsWith('trust_point')),
    trust_section: contents.filter(c => c.block_key.startsWith('trust_section')),
    sections: contents.filter(c => c.block_key.startsWith('section_')),
    engagement: contents.filter(c => c.block_key.startsWith('engagement')),
    steps: contents.filter(c => c.block_key.startsWith('step_')),
    how_it_works: contents.filter(c => c.block_key.startsWith('how_it_works'))
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dk-navy mb-2">Édition de la page d'accueil</h1>
        <p className="text-gray-600">Modifiez les textes et images de votre page d'accueil</p>
      </div>

      {/* Section Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section Hero (Bannière principale)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.hero
            .sort((a, b) => a.display_order - b.display_order)
            .map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key === 'hero_main_title' ? 'Titre principal' :
                 content.block_key === 'hero_point_1' ? 'Point 1 (Checkmark)' :
                 content.block_key === 'hero_point_2' ? 'Point 2 (Checkmark)' :
                 content.block_key === 'hero_point_3' ? 'Point 3 (Checkmark)' :
                 content.block_key === 'hero_description' ? 'Description' :
                 content.block_key === 'hero_background_image' ? 'Image de fond' :
                 content.block_key.replace('hero_', '').replace('_', ' ')}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section de confiance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section "Faites confiance à DK Automotive"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.trust_section.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key.includes('title') ? 'Titre' : 
                 content.block_key.includes('subtitle') ? 'Sous-titre' : 'Description'}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sections principales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sections principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {['expertise', 'delais', 'tarification'].map((sectionName) => {
            const sectionContents = groupedContents.sections.filter(c => 
              c.block_key.includes(sectionName)
            );
            
            return (
              <div key={sectionName} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 capitalize text-dk-navy">
                  Section {sectionName}
                </h4>
                <div className="space-y-6">
                  {sectionContents.map((content) => (
                    <div key={content.id}>
                      <h5 className="font-medium mb-3">
                        {content.block_key.includes('title') ? 'Titre' : 
                         content.block_key.includes('content') ? 'Contenu' : 
                         content.block_key.includes('subtitle') ? 'Sous-titre' :
                         content.block_key.includes('image') ? 'Image' :
                         content.block_key.includes('point') ? `Point ${content.block_key.slice(-1)}` :
                         content.block_key.includes('cta') ? 'Call-to-Action' : 'Contenu'}
                      </h5>
                      {renderEditField(content)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Points de confiance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Points de confiance (Checkmarks)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.trust_points.map((content, index) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">Point {index + 1}</h4>
              {renderEditField(content)}
              {index < groupedContents.trust_points.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Section "Votre confiance, notre engagement"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {groupedContents.engagement.map((content) => (
            <div key={content.id}>
              <h4 className="font-medium mb-3">
                {content.block_key.includes('title') && !content.block_key.includes('card') ? 'Titre principal' :
                 content.block_key.includes('subtitle') ? 'Sous-titre' :
                 content.block_key.includes('card_1') ? 'Carte 1 - Fiabilité' :
                 content.block_key.includes('card_2') ? 'Carte 2 - Expertise' :
                 content.block_key.includes('card_3') ? 'Carte 3 - Satisfaction' : 'Contenu'}
              </h4>
              {renderEditField(content)}
              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Étapes du processus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Étapes du processus (Comment ça marche)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Titre et sous-titre de la section */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-4 text-dk-navy">
              Titre de la section
            </h4>
            <div className="space-y-6">
              {groupedContents.how_it_works.map((content) => (
                <div key={content.id}>
                  <h5 className="font-medium mb-3">
                    {content.block_key.includes('title') && !content.block_key.includes('cta') ? 'Titre principal' :
                     content.block_key.includes('subtitle') ? 'Sous-titre' :
                     content.block_key.includes('cta_title') ? 'Titre CTA' :
                     content.block_key.includes('cta_button') ? 'Texte bouton CTA' : 'Contenu'}
                  </h5>
                  {renderEditField(content)}
                </div>
              ))}
            </div>
          </div>

          {/* Étapes individuelles */}
          {[1, 2, 3].map((stepNum) => {
            const stepContents = groupedContents.steps.filter(c => 
              c.block_key.includes(`step_${stepNum}`)
            );
            
            return (
              <div key={stepNum} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-4 text-dk-navy">
                  Étape {stepNum}
                </h4>
                <div className="space-y-6">
                  {stepContents.map((content) => (
                    <div key={content.id}>
                      <h5 className="font-medium mb-3">
                        {content.block_key.includes('title') ? 'Titre' : 'Description'}
                      </h5>
                      {renderEditField(content)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndexPageEditor;
