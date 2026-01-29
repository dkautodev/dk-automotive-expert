import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePageContents, PageContent } from '@/hooks/usePageContents';
import { Edit, Save, Upload, Image as ImageIcon, Info, AlertCircle } from 'lucide-react';

const IndexPageEditor = () => {
  const { contents, isLoading, updateContent, uploadImage } = usePageContents('index');
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

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

    // Reset error state for this image
    setImageLoadErrors(prev => ({ ...prev, [content.block_key]: false }));

    const imageUrl = await uploadImage(file, content.block_key);
    if (imageUrl) {
      await updateContent(content.id, {
        content_json: { url: imageUrl }
      });
    }
  };

  const handleImageError = (blockKey: string) => {
    setImageLoadErrors(prev => ({ ...prev, [blockKey]: true }));
  };

  const renderImageField = (content: PageContent) => {
    const currentValue = getContentValue(content);
    const hasError = imageLoadErrors[content.block_key];
    const hasUrl = currentValue?.url;

    return (
      <div className="space-y-3">
        <div className="flex items-start gap-4">
          <div className="w-40 h-24 bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
            {hasUrl && !hasError ? (
              <img 
                src={currentValue.url} 
                alt="Aperçu" 
                className="w-full h-full object-cover"
                onError={() => handleImageError(content.block_key)}
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                {hasError ? (
                  <>
                    <AlertCircle className="w-6 h-6 text-destructive" />
                    <span className="text-xs">Erreur de chargement</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs">Aucune image</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor={`image-${content.block_key}`} className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {hasUrl ? "Changer l'image" : "Ajouter une image"}
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
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" />
              Format recommandé : 1280×720 px (paysage, 16:9)
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderEditField = (content: PageContent) => {
    const currentValue = editValues[content.block_key] || getContentValue(content);
    const isEditing = editingBlock === content.block_key;

    if (content.block_type === 'image') {
      return renderImageField(content);
    }

    if (isEditing) {
      const hasTitle = 'title' in currentValue;
      const hasSubtitle = 'subtitle' in currentValue;
      const hasDescription = 'description' in currentValue;
      const hasContent = 'content' in currentValue;
      const hasText = 'text' in currentValue;

      return (
        <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
          {hasTitle && (
            <div>
              <Label className="text-sm">Titre</Label>
              <Input
                value={currentValue.title || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, title: e.target.value }
                })}
                className="mt-1"
              />
            </div>
          )}
          {hasSubtitle && (
            <div>
              <Label className="text-sm">Sous-titre</Label>
              <Input
                value={currentValue.subtitle || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, subtitle: e.target.value }
                })}
                className="mt-1"
              />
            </div>
          )}
          {hasDescription && (
            <div>
              <Label className="text-sm">Description</Label>
              <Textarea
                value={currentValue.description || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, description: e.target.value }
                })}
                rows={3}
                className="mt-1"
              />
            </div>
          )}
          {hasContent && (
            <div>
              <Label className="text-sm">Contenu</Label>
              <Textarea
                value={currentValue.content || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, content: e.target.value }
                })}
                rows={4}
                className="mt-1"
              />
            </div>
          )}
          {hasText && (
            <div>
              <Label className="text-sm">Texte</Label>
              <Input
                value={currentValue.text || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  [content.block_key]: { ...currentValue, text: e.target.value }
                })}
                className="mt-1"
              />
            </div>
          )}
          <div className="flex gap-2 pt-2">
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

    // Display mode - compact view
    const displayValue = currentValue.title || currentValue.subtitle || currentValue.description || currentValue.content || currentValue.text || '';
    const truncatedValue = displayValue.length > 80 ? displayValue.substring(0, 80) + '...' : displayValue;

    return (
      <div className="flex items-center justify-between gap-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground flex-1 truncate">
          {truncatedValue || <span className="italic">Aucun contenu</span>}
        </p>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => handleEdit(content.block_key, content)}
          className="shrink-0"
        >
          <Edit className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      </div>
    );
  };

  const getBlockLabel = (blockKey: string): string => {
    const labels: Record<string, string> = {
      // Hero
      'hero_title': 'Titre principal',
      'hero_background': 'Image de fond',
      'hero_description': 'Description',
      // Trust points
      'trust_point_1': 'Point 1',
      'trust_point_2': 'Point 2',
      'trust_point_3': 'Point 3',
      // Trust section
      'trust_section_title': 'Titre',
      'trust_section_subtitle': 'Sous-titre',
      'trust_section_description': 'Description',
      // Sections
      'section_expertise_title': 'Titre',
      'section_expertise_content': 'Contenu',
      'section_expertise_subtitle': 'Sous-titre',
      'section_expertise_image': 'Image',
      'section_delais_title': 'Titre',
      'section_delais_content': 'Contenu',
      'section_delais_point_1': 'Point 1',
      'section_delais_point_2': 'Point 2',
      'section_delais_point_3': 'Point 3',
      'section_delais_image': 'Image',
      'section_tarification_title': 'Titre',
      'section_tarification_content': 'Contenu',
      'section_tarification_point_1': 'Point 1',
      'section_tarification_point_2': 'Point 2',
      'section_tarification_point_3': 'Point 3',
      'section_tarification_image': 'Image',
      'section_tarification_cta_text': 'Texte CTA',
      // Engagement
      'engagement_title': 'Titre principal',
      'engagement_subtitle': 'Sous-titre',
      'engagement_card_1_title': 'Carte 1 - Titre',
      'engagement_card_1_content': 'Carte 1 - Contenu',
      'engagement_card_2_title': 'Carte 2 - Titre',
      'engagement_card_2_content': 'Carte 2 - Contenu',
      'engagement_card_3_title': 'Carte 3 - Titre',
      'engagement_card_3_content': 'Carte 3 - Contenu',
      // Steps
      'step_1_title': 'Titre',
      'step_1_description': 'Description',
      'step_2_title': 'Titre',
      'step_2_description': 'Description',
      'step_3_title': 'Titre',
      'step_3_description': 'Description',
      // How it works
      'how_it_works_title': 'Titre section',
      'how_it_works_subtitle': 'Sous-titre section',
      'how_it_works_cta_title': 'Titre CTA',
      'how_it_works_cta_button': 'Texte bouton',
    };
    return labels[blockKey] || blockKey.replace(/_/g, ' ');
  };

  const groupedContents = {
    hero: contents.filter(c => c.block_key.startsWith('hero')),
    trust_points: contents.filter(c => c.block_key.startsWith('trust_point')),
    trust_section: contents.filter(c => c.block_key.startsWith('trust_section')),
    expertise: contents.filter(c => c.block_key.includes('expertise')),
    delais: contents.filter(c => c.block_key.includes('delais')),
    tarification: contents.filter(c => c.block_key.includes('tarification')),
    engagement: contents.filter(c => c.block_key.startsWith('engagement')),
    steps: contents.filter(c => c.block_key.startsWith('step_')),
    how_it_works: contents.filter(c => c.block_key.startsWith('how_it_works'))
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dk-navy mb-2">Édition de la page d'accueil</h1>
        <p className="text-sm text-muted-foreground">
          Modifiez les textes et images de votre page d'accueil. Cliquez sur une section pour la déplier.
        </p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-800">
            <strong>Conseil :</strong> Pour les images, utilisez des fichiers au format <strong>1280×720 pixels</strong> (paysage, ratio 16:9) pour un affichage optimal.
          </p>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['hero']} className="space-y-3">
        {/* Section Hero */}
        <AccordionItem value="hero" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-dk-navy" />
              <span className="font-semibold">Bannière principale (Hero)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.hero.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Points de confiance */}
        <AccordionItem value="trust_points" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-semibold">Points de confiance (✓ checkmarks)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.trust_points.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Section Confiance */}
        <AccordionItem value="trust_section" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold">Section "Faites confiance"</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.trust_section.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Section Expertise */}
        <AccordionItem value="expertise" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="font-semibold">Section Expertise chauffeurs</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.expertise.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Section Délais */}
        <AccordionItem value="delais" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-semibold">Section Délais de livraison</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.delais.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Section Tarification */}
        <AccordionItem value="tarification" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold">Section Tarification</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.tarification.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Section Engagement */}
        <AccordionItem value="engagement" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-semibold">Section "Votre confiance, notre engagement"</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {groupedContents.engagement.map((content) => (
              <div key={content.id} className="space-y-2">
                <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                {renderEditField(content)}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Comment ça marche */}
        <AccordionItem value="how_it_works" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="font-semibold">Section "Comment ça marche"</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-6">
            {/* Titre section */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Titre de section</h4>
              {groupedContents.how_it_works.map((content) => (
                <div key={content.id} className="space-y-2">
                  <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                  {renderEditField(content)}
                </div>
              ))}
            </div>
            
            <Separator />
            
            {/* Étapes */}
            {[1, 2, 3].map((stepNum) => {
              const stepContents = groupedContents.steps.filter(c => 
                c.block_key.includes(`step_${stepNum}`)
              );
              
              return (
                <div key={stepNum} className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Étape {stepNum}
                  </h4>
                  {stepContents.map((content) => (
                    <div key={content.id} className="space-y-2">
                      <Label className="text-sm font-medium">{getBlockLabel(content.block_key)}</Label>
                      {renderEditField(content)}
                    </div>
                  ))}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default IndexPageEditor;
