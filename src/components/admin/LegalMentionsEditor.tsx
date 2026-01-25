
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLegalMentions } from '@/hooks/useLegalMentions';
import { Save, Loader2, Plus, Trash2, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const LegalMentionsEditor = () => {
  const { legalMentions, isLoading, updateLegalMention, addLegalMention, deleteLegalMention } = useLegalMentions();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [editingMeta, setEditingMeta] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editKey, setEditKey] = useState('');
  const [savingItems, setSavingItems] = useState<Set<string>>(new Set());
  const [isAddingBasic, setIsAddingBasic] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);

  const handleValueChange = (fieldKey: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleSave = async (id: string, fieldKey: string) => {
    const newValue = editedValues[fieldKey];
    if (newValue === undefined) return;

    setSavingItems(prev => new Set(prev).add(id));
    
    const success = await updateLegalMention(id, { field_value: newValue });
    
    if (success) {
      setEditedValues(prev => {
        const newValues = { ...prev };
        delete newValues[fieldKey];
        return newValues;
      });
    }
    
    setSavingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleEditMeta = (item: any) => {
    setEditingMeta(item.id);
    setEditLabel(item.field_label);
    setEditKey(item.field_key);
  };

  const handleSaveMeta = async (id: string) => {
    setSavingItems(prev => new Set(prev).add(id));
    
    const success = await updateLegalMention(id, { 
      field_label: editLabel, 
      field_key: editKey 
    });
    
    if (success) {
      setEditingMeta(null);
      setEditLabel('');
      setEditKey('');
    }
    
    setSavingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleCancelMeta = () => {
    setEditingMeta(null);
    setEditLabel('');
    setEditKey('');
  };

  const handleAddBasic = async () => {
    setIsAddingBasic(true);
    await addLegalMention('basic');
    setIsAddingBasic(false);
  };

  const handleAddSection = async () => {
    setIsAddingSection(true);
    await addLegalMention('section');
    setIsAddingSection(false);
  };

  const getCurrentValue = (item: any) => {
    return editedValues[item.field_key] !== undefined 
      ? editedValues[item.field_key] 
      : (item.field_value || '');
  };

  const hasChanges = (fieldKey: string) => {
    return editedValues[fieldKey] !== undefined;
  };

  // Group mentions by sections (titre/contenu pairs)
  const groupedMentions = () => {
    const basicFields = legalMentions.filter(item => 
      !item.field_key.includes('_titre') && !item.field_key.includes('_contenu')
    );

    // Find all unique section keys
    const sectionKeys = new Set<string>();
    legalMentions.forEach(item => {
      if (item.field_key.includes('_titre')) {
        sectionKeys.add(item.field_key.replace('_titre', ''));
      }
    });

    const sections = Array.from(sectionKeys).map(sectionKey => {
      const titre = legalMentions.find(item => item.field_key === `${sectionKey}_titre`);
      const contenu = legalMentions.find(item => item.field_key === `${sectionKey}_contenu`);
      return { key: sectionKey, titre, contenu };
    }).filter(section => section.titre || section.contenu);

    return { basicFields, sections };
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des mentions légales...</p>
        </div>
      </div>
    );
  }

  const { basicFields, sections } = groupedMentions();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-dk-navy">
            Éditeur des Mentions Légales
          </CardTitle>
          <p className="text-sm text-gray-600">
            Modifiez les informations légales de votre entreprise
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Informations de base */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-dk-navy">Informations légales de base</h3>
              <Button onClick={handleAddBasic} disabled={isAddingBasic} size="sm" className="flex items-center gap-2">
                {isAddingBasic ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Ajouter un champ
              </Button>
            </div>
            <div className="space-y-4">
              {basicFields.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    {editingMeta === item.id ? (
                      <div className="flex-1 grid grid-cols-2 gap-2 mr-2">
                        <div>
                          <Label className="text-xs">Label</Label>
                          <Input
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Label du champ"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Clé</Label>
                          <Input
                            value={editKey}
                            onChange={(e) => setEditKey(e.target.value)}
                            placeholder="Clé unique"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor={item.field_key} className="text-sm font-medium">
                          {item.field_label}
                        </Label>
                        <p className="text-xs text-gray-500">Clé: {item.field_key}</p>
                      </div>
                    )}
                    <div className="flex gap-1">
                      {editingMeta === item.id ? (
                        <>
                          <Button
                            onClick={() => handleSaveMeta(item.id)}
                            disabled={savingItems.has(item.id)}
                            size="sm"
                            variant="outline"
                          >
                            {savingItems.has(item.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </Button>
                          <Button onClick={handleCancelMeta} size="sm" variant="ghost">
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => handleEditMeta(item)} size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer ce champ ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Le champ "{item.field_label}" sera définitivement supprimé.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteLegalMention(item.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id={item.field_key}
                      type="text"
                      value={getCurrentValue(item)}
                      onChange={(e) => handleValueChange(item.field_key, e.target.value)}
                      placeholder={`Entrez ${item.field_label.toLowerCase()}...`}
                      className="flex-1"
                    />
                    {hasChanges(item.field_key) && (
                      <Button
                        onClick={() => handleSave(item.id, item.field_key)}
                        disabled={savingItems.has(item.id)}
                        size="sm"
                        className="bg-dk-navy hover:bg-dk-blue"
                      >
                        {savingItems.has(item.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sections avec titre et contenu */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-dk-navy">Sections thématiques</h3>
              <Button onClick={handleAddSection} disabled={isAddingSection} size="sm" className="flex items-center gap-2">
                {isAddingSection ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Ajouter une section
              </Button>
            </div>
            
            {sections.map((section) => (
              <Card key={section.key} className="mb-4 p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-md font-medium text-dk-navy">
                    {section.titre?.field_value || section.titre?.field_label || 'Nouvelle section'}
                  </h4>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette section ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. La section entière (titre et contenu) sera définitivement supprimée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteLegalMention('', true, section.key)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                <div className="space-y-4">
                  {/* Titre de la section */}
                  {section.titre && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        {editingMeta === section.titre.id ? (
                          <div className="flex-1 grid grid-cols-2 gap-2 mr-2">
                            <div>
                              <Label className="text-xs">Label</Label>
                              <Input
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                placeholder="Label du champ"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Clé</Label>
                              <Input
                                value={editKey}
                                onChange={(e) => setEditKey(e.target.value)}
                                placeholder="Clé unique"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor={section.titre.field_key} className="text-sm font-medium">
                              {section.titre.field_label}
                            </Label>
                            <p className="text-xs text-gray-500">Clé: {section.titre.field_key}</p>
                          </div>
                        )}
                        {editingMeta === section.titre.id ? (
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleSaveMeta(section.titre!.id)}
                              disabled={savingItems.has(section.titre!.id)}
                              size="sm"
                              variant="outline"
                            >
                              {savingItems.has(section.titre!.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                            <Button onClick={handleCancelMeta} size="sm" variant="ghost">
                              Annuler
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={() => handleEditMeta(section.titre)} size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id={section.titre.field_key}
                          type="text"
                          value={getCurrentValue(section.titre)}
                          onChange={(e) => handleValueChange(section.titre!.field_key, e.target.value)}
                          placeholder={`Entrez ${section.titre.field_label.toLowerCase()}...`}
                          className="flex-1"
                        />
                        {hasChanges(section.titre.field_key) && (
                          <Button
                            onClick={() => handleSave(section.titre!.id, section.titre!.field_key)}
                            disabled={savingItems.has(section.titre!.id)}
                            size="sm"
                            className="bg-dk-navy hover:bg-dk-blue"
                          >
                            {savingItems.has(section.titre!.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contenu de la section */}
                  {section.contenu && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        {editingMeta === section.contenu.id ? (
                          <div className="flex-1 grid grid-cols-2 gap-2 mr-2">
                            <div>
                              <Label className="text-xs">Label</Label>
                              <Input
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                placeholder="Label du champ"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Clé</Label>
                              <Input
                                value={editKey}
                                onChange={(e) => setEditKey(e.target.value)}
                                placeholder="Clé unique"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Label htmlFor={section.contenu.field_key} className="text-sm font-medium">
                              {section.contenu.field_label}
                            </Label>
                            <p className="text-xs text-gray-500">Clé: {section.contenu.field_key}</p>
                          </div>
                        )}
                        {editingMeta === section.contenu.id ? (
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleSaveMeta(section.contenu!.id)}
                              disabled={savingItems.has(section.contenu!.id)}
                              size="sm"
                              variant="outline"
                            >
                              {savingItems.has(section.contenu!.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            </Button>
                            <Button onClick={handleCancelMeta} size="sm" variant="ghost">
                              Annuler
                            </Button>
                          </div>
                        ) : (
                          <Button onClick={() => handleEditMeta(section.contenu)} size="icon" variant="ghost" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          id={section.contenu.field_key}
                          value={getCurrentValue(section.contenu)}
                          onChange={(e) => handleValueChange(section.contenu!.field_key, e.target.value)}
                          placeholder={`Entrez ${section.contenu.field_label.toLowerCase()}...`}
                          className="flex-1 min-h-[100px]"
                        />
                        {hasChanges(section.contenu.field_key) && (
                          <Button
                            onClick={() => handleSave(section.contenu!.id, section.contenu!.field_key)}
                            disabled={savingItems.has(section.contenu!.id)}
                            size="sm"
                            className="bg-dk-navy hover:bg-dk-blue self-start"
                          >
                            {savingItems.has(section.contenu!.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalMentionsEditor;
