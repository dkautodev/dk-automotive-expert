import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Upload, Image as ImageIcon, Edit, Save, X, AlertCircle } from 'lucide-react';
import { useAboutPageContents } from '@/hooks/useAboutPageContents';

const AboutPageEditor = () => {
  const { contents, isLoading, updateContent, uploadImage } = useAboutPageContents();
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  const handleEdit = (blockKey: string, currentData: any) => {
    setEditingBlock(blockKey);
    setEditValues(currentData || {});
  };

  const handleSave = async (blockId: string, blockKey: string) => {
    try {
      await updateContent(blockId, { content_json: editValues });
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
    setImageLoadErrors(prev => ({ ...prev, [blockKey]: false }));
    
    try {
      const imageUrl = await uploadImage(file, blockKey);
      if (imageUrl) {
        await updateContent(blockId, { content_json: { url: imageUrl } });
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploadingImages(prev => prev.filter(key => key !== blockKey));
    }
  };

  const handleImageError = (blockKey: string) => {
    setImageLoadErrors(prev => ({ ...prev, [blockKey]: true }));
  };

  const getContentByKey = (key: string) => {
    return contents.find(c => c.block_key === key);
  };

  const getBlockLabel = (blockKey: string): string => {
    const labels: Record<string, string> = {
      // Hero
      'hero_title': 'Titre "BIENVENUE CHEZ"',
      'hero_main_title': 'Nom entreprise "DK AUTOMOTIVE"',
      'hero_subtitle': 'Sous-titre de présentation',
      'hero_description': 'Description détaillée',
      // Why choose
      'why_choose_image': 'Image',
      'why_choose_title': 'Titre',
      'why_choose_description': 'Description',
      'why_choose_benefit_1': 'Avantage 1',
      'why_choose_benefit_2': 'Avantage 2',
      'why_choose_benefit_3': 'Avantage 3',
      'why_choose_benefit_4': 'Avantage 4',
      // Drivers
      'drivers_title': 'Titre',
      'drivers_subtitle': 'Sous-titre',
      'drivers_description_1': 'Description 1',
      'drivers_description_2': 'Description 2',
      'drivers_image': 'Image',
      // Values
      'values_section_title': 'Titre de section',
      'value_ecoconduite_image': 'Image',
      'value_ecoconduite_title': 'Titre',
      'value_ecoconduite_content': 'Description',
      'value_expertise_image': 'Image',
      'value_expertise_title': 'Titre',
      'value_expertise_content': 'Description',
      'value_service_image': 'Image',
      'value_service_title': 'Titre',
      'value_service_content': 'Description',
      // Expertise
      'expertise_image': 'Image',
      'expertise_title': 'Titre',
      'expertise_subtitle': 'Sous-titre',
      'expertise_description': 'Description',
      // Final
      'final_title': 'Titre',
      'final_main_title': 'Titre principal',
      'final_subtitle': 'Sous-titre',
      'final_description': 'Description',
    };
    return labels[blockKey] || blockKey.replace(/_/g, ' ');
  };

  const renderImageField = (content: any) => {
    const imageUrl = content.content_json?.url;
    const hasError = imageLoadErrors[content.block_key];
    const isUploading = uploadingImages.includes(content.block_key);

    return (
      <div className="flex items-start gap-4">
        <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden border">
          {imageUrl && !hasError ? (
            <img 
              src={imageUrl} 
              alt="Aperçu" 
              className="w-full h-full object-cover"
              onError={() => handleImageError(content.block_key)}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              {hasError ? (
                <>
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="text-xs">Erreur</span>
                </>
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor={`image-${content.block_key}`} className="cursor-pointer">
            <Button variant="outline" size="sm" asChild disabled={isUploading}>
              <span>
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {imageUrl ? "Changer" : "Ajouter"}
              </span>
            </Button>
          </Label>
          <input 
            id={`image-${content.block_key}`} 
            type="file" 
            accept="image/*" 
            onChange={e => handleImageUpload(e, content.block_key, content.id)} 
            className="hidden" 
          />
        </div>
      </div>
    );
  };

  const renderEditField = (content: any) => {
    const currentValue = editValues;
    const isEditing = editingBlock === content.block_key;

    if (content.block_type === 'image') {
      return renderImageField(content);
    }

    if (isEditing) {
      const hasTitle = 'title' in currentValue;
      const hasSubtitle = 'subtitle' in currentValue;
      const hasContent = 'content' in currentValue;

      return (
        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
          {hasTitle && (
            <div>
              <Label className="text-sm">Titre</Label>
              <Input 
                value={currentValue.title || ''} 
                onChange={e => setEditValues({ ...currentValue, title: e.target.value })} 
                className="mt-1"
              />
            </div>
          )}
          {hasSubtitle && (
            <div>
              <Label className="text-sm">Sous-titre</Label>
              <Input 
                value={currentValue.subtitle || ''} 
                onChange={e => setEditValues({ ...currentValue, subtitle: e.target.value })} 
                className="mt-1"
              />
            </div>
          )}
          {hasContent && (
            <div>
              <Label className="text-sm">Contenu</Label>
              <Textarea 
                value={currentValue.content || ''} 
                onChange={e => setEditValues({ ...currentValue, content: e.target.value })} 
                rows={3}
                className="mt-1"
              />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={() => handleSave(content.id, content.block_key)}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
          </div>
        </div>
      );
    }

    // Display mode - compact
    const contentData = content.content_json || {};
    const displayValue = contentData.title || contentData.subtitle || contentData.content || '';
    const truncatedValue = displayValue.length > 60 ? displayValue.substring(0, 60) + '...' : displayValue;

    return (
      <div className="flex items-center justify-between gap-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground flex-1 truncate">
          {truncatedValue || <span className="italic">Aucun contenu</span>}
        </p>
        <Button size="sm" variant="ghost" onClick={() => handleEdit(content.block_key, contentData)} className="shrink-0">
          <Edit className="w-4 h-4 mr-1" />
          Modifier
        </Button>
      </div>
    );
  };

  const renderContentBlock = (blockKey: string) => {
    const content = getContentByKey(blockKey);
    if (!content) return null;
    
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{getBlockLabel(blockKey)}</Label>
        {renderEditField(content)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dk-navy mb-2">Édition de la page À propos</h1>
        <p className="text-sm text-muted-foreground">
          Modifiez les textes et images. Cliquez sur une section pour la déplier.
        </p>
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
            {renderContentBlock('hero_title')}
            {renderContentBlock('hero_main_title')}
            {renderContentBlock('hero_subtitle')}
            {renderContentBlock('hero_description')}
          </AccordionContent>
        </AccordionItem>

        {/* Pourquoi choisir */}
        <AccordionItem value="why_choose" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="font-semibold">Pourquoi choisir DK Automotive</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {renderContentBlock('why_choose_image')}
            {renderContentBlock('why_choose_title')}
            {renderContentBlock('why_choose_description')}
            <Separator className="my-2" />
            {renderContentBlock('why_choose_benefit_1')}
            {renderContentBlock('why_choose_benefit_2')}
            {renderContentBlock('why_choose_benefit_3')}
            {renderContentBlock('why_choose_benefit_4')}
          </AccordionContent>
        </AccordionItem>

        {/* Chauffeurs */}
        <AccordionItem value="drivers" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-semibold">Chauffeurs expérimentés</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {renderContentBlock('drivers_title')}
            {renderContentBlock('drivers_subtitle')}
            {renderContentBlock('drivers_description_1')}
            {renderContentBlock('drivers_description_2')}
            {renderContentBlock('drivers_image')}
          </AccordionContent>
        </AccordionItem>

        {/* Valeurs */}
        <AccordionItem value="values" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="font-semibold">Nos Valeurs (3 colonnes)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-6">
            {renderContentBlock('values_section_title')}
            
            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase">Valeur 1 - Écoconduite</h4>
              {renderContentBlock('value_ecoconduite_image')}
              {renderContentBlock('value_ecoconduite_title')}
              {renderContentBlock('value_ecoconduite_content')}
            </div>

            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase">Valeur 2 - Expertise</h4>
              {renderContentBlock('value_expertise_image')}
              {renderContentBlock('value_expertise_title')}
              {renderContentBlock('value_expertise_content')}
            </div>

            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase">Valeur 3 - Service</h4>
              {renderContentBlock('value_service_image')}
              {renderContentBlock('value_service_title')}
              {renderContentBlock('value_service_content')}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Expertise */}
        <AccordionItem value="expertise" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="font-semibold">Expertise en convoyage</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {renderContentBlock('expertise_image')}
            {renderContentBlock('expertise_title')}
            {renderContentBlock('expertise_subtitle')}
            {renderContentBlock('expertise_description')}
          </AccordionContent>
        </AccordionItem>

        {/* Section finale */}
        <AccordionItem value="final" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-semibold">Section finale (CTA)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {renderContentBlock('final_title')}
            {renderContentBlock('final_main_title')}
            {renderContentBlock('final_subtitle')}
            {renderContentBlock('final_description')}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutPageEditor;
