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
  const {
    contents,
    isLoading,
    updateContent,
    uploadImage
  } = useAboutPageContents();
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
          content_json: {
            url: imageUrl
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploadingImages(prev => prev.filter(key => key !== blockKey));
    }
  };
  const getContentByKey = (key: string) => {
    return contents.find(c => c.block_key === key);
  };
  const renderEditField = (content: any) => {
    const currentValue = editValues;
    const isEditing = editingBlock === content.block_key;
    if (content.block_type === 'image') {
      const imageUrl = content.content_json?.url;
      return <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-48 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
              {imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 text-gray-400" />}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`image-${content.block_key}`} className="cursor-pointer">
                <Button variant="outline" size="sm" asChild disabled={uploadingImages.includes(content.block_key)}>
                  <span>
                    {uploadingImages.includes(content.block_key) ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {imageUrl ? 'Changer l\'image' : 'Ajouter une image'}
                  </span>
                </Button>
              </Label>
              <input id={`image-${content.block_key}`} type="file" accept="image/*" onChange={e => handleImageUpload(e, content.block_key, content.id)} className="hidden" />
              {imageUrl && <p className="text-xs text-gray-500">Image actuelle chargée</p>}
            </div>
          </div>
        </div>;
    }
    if (isEditing) {
      const hasTitle = 'title' in currentValue;
      const hasSubtitle = 'subtitle' in currentValue;
      const hasContent = 'content' in currentValue;
      return <div className="space-y-4">
          {hasTitle && <div>
              <Label>Titre</Label>
              <Input value={currentValue.title || ''} onChange={e => setEditValues({
            ...currentValue,
            title: e.target.value
          })} placeholder="Titre" />
            </div>}
          {hasSubtitle && <div>
              <Label>Sous-titre</Label>
              <Input value={currentValue.subtitle || ''} onChange={e => setEditValues({
            ...currentValue,
            subtitle: e.target.value
          })} placeholder="Sous-titre" />
            </div>}
          {hasContent && <div>
              <Label>Contenu</Label>
              <Textarea value={currentValue.content || ''} onChange={e => setEditValues({
            ...currentValue,
            content: e.target.value
          })} placeholder="Contenu" rows={4} />
            </div>}
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
        </div>;
    }

    // Display mode
    const contentData = content.content_json || {};
    return <div className="space-y-2">
        {'title' in contentData && <div>
            <Label className="text-sm font-medium text-gray-600">Titre:</Label>
            <p className="text-sm">{contentData.title}</p>
          </div>}
        {'subtitle' in contentData && <div>
            <Label className="text-sm font-medium text-gray-600">Sous-titre:</Label>
            <p className="text-sm">{contentData.subtitle}</p>
          </div>}
        {'content' in contentData && <div>
            <Label className="text-sm font-medium text-gray-600">Contenu:</Label>
            <p className="text-sm whitespace-pre-wrap">{contentData.content}</p>
          </div>}
        <Button size="sm" variant="outline" onClick={() => handleEdit(content.block_key, contentData)}>
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>;
  };
  const renderContentBlock = (blockKey: string, title: string, description?: string) => {
    const content = getContentByKey(blockKey);
    if (!content) return null;
    return <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-dk-navy">{title}</h4>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        {renderEditField(content)}
        <Separator />
      </div>;
  };
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des contenus...</span>
      </div>;
  }
  return <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dk-navy mb-2">
          Gestion de la page À propos
        </h1>
        <p className="text-gray-600">
          Modifiez les textes et images de la page À propos de votre site.
        </p>
      </div>

      {/* Section Hero Principale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            
            Section Hero (Bannière principale)
          </CardTitle>
          <p className="text-sm text-gray-600">
            La première section visible par vos visiteurs
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContentBlock('hero_title', 'Titre principal "BIENVENUE CHEZ"')}
          {renderContentBlock('hero_main_title', 'Nom de l\'entreprise "DK AUTOMOTIVE"')}
          {renderContentBlock('hero_subtitle', 'Sous-titre de présentation')}
          {renderContentBlock('hero_description', 'Description détaillée')}
        </CardContent>
      </Card>

      {/* Section Pourquoi choisir DK Automotive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            
            Pourquoi choisir DK Automotive
          </CardTitle>
          <p className="text-sm text-gray-600">
            Arguments de vente et avantages concurrentiels
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContentBlock('why_choose_image', 'Image de section')}
          {renderContentBlock('why_choose_title', 'Titre de la section')}
          {renderContentBlock('why_choose_description', 'Description principale')}
          {renderContentBlock('why_choose_benefit_1', 'Avantage 1 - Équipe expérimentée')}
          {renderContentBlock('why_choose_benefit_2', 'Avantage 2 - Couverture géographique')}
          {renderContentBlock('why_choose_benefit_3', 'Avantage 3 - Services sur mesure')}
          {renderContentBlock('why_choose_benefit_4', 'Avantage 4 - Tarifs compétitifs')}
        </CardContent>
      </Card>

      {/* Section Chauffeurs Expérimentés */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            
            Chauffeurs Expérimentés
          </CardTitle>
          <p className="text-sm text-gray-600">
            Présentation de l'équipe et de l'expertise
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContentBlock('drivers_title', 'Titre "CHAUFFEURS EXPÉRIMENTÉS"')}
          {renderContentBlock('drivers_subtitle', 'Sous-titre de la section')}
          {renderContentBlock('drivers_description_1', 'Description 1 - Sélection rigoureuse')}
          {renderContentBlock('drivers_description_2', 'Description 2 - Formation continue')}
          {renderContentBlock('drivers_image', 'Image des chauffeurs')}
        </CardContent>
      </Card>

      {/* Section Nos Valeurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            
            Nos Valeurs (3 colonnes)
          </CardTitle>
          <p className="text-sm text-gray-600">
            Les trois valeurs principales de l'entreprise
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {renderContentBlock('values_section_title', 'Titre de la section valeurs')}
          
          {/* Valeur 1 - Écoconduite */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold mb-4 text-dk-navy">Valeur 1 - Écoconduite</h4>
            <div className="space-y-4">
              {renderContentBlock('value_ecoconduite_image', 'Image écoconduite')}
              {renderContentBlock('value_ecoconduite_title', 'Titre "ÉCOCONDUITE"')}
              {renderContentBlock('value_ecoconduite_content', 'Description écoconduite')}
            </div>
          </div>

          {/* Valeur 2 - Expertise technique */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold mb-4 text-dk-navy">Valeur 2 - Expertise Technique</h4>
            <div className="space-y-4">
              {renderContentBlock('value_expertise_image', 'Image expertise')}
              {renderContentBlock('value_expertise_title', 'Titre "EXPERTISE TECHNIQUE"')}
              {renderContentBlock('value_expertise_content', 'Description expertise')}
            </div>
          </div>

          {/* Valeur 3 - Service sur-mesure */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold mb-4 text-dk-navy">Valeur 3 - Service Sur-mesure</h4>
            <div className="space-y-4">
              {renderContentBlock('value_service_image', 'Image service')}
              {renderContentBlock('value_service_title', 'Titre "SERVICE SUR-MESURE"')}
              {renderContentBlock('value_service_content', 'Description service')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Expertise en Convoyage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            
            Expertise en Convoyage
          </CardTitle>
          <p className="text-sm text-gray-600">
            Section détaillant l'expertise de l'entreprise
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContentBlock('expertise_image', 'Image expertise convoyage')}
          {renderContentBlock('expertise_title', 'Titre "EXPERTISE EN CONVOYAGE AUTOMOBILE"')}
          {renderContentBlock('expertise_subtitle', 'Sous-titre de la section')}
          {renderContentBlock('expertise_description', 'Description de l\'expertise')}
        </CardContent>
      </Card>

      {/* Section Finale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            
            Section Finale (Call-to-Action)
          </CardTitle>
          <p className="text-sm text-gray-600">
            Conclusion et appel à l'action final
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContentBlock('final_title', 'Titre "FAITES LE CHOIX DE L\'EXPERTISE"')}
          {renderContentBlock('final_main_title', 'Titre principal "DK AUTOMOTIVE"')}
          {renderContentBlock('final_subtitle', 'Sous-titre final')}
          {renderContentBlock('final_description', 'Description finale et CTA')}
        </CardContent>
      </Card>
    </div>;
};
export default AboutPageEditor;