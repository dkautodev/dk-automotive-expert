import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Plus, Trash2, Edit } from 'lucide-react';
import { useCguContent } from '@/hooks/useCguContent';
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

const CguEditor = () => {
  const { cguContentSections, isLoading, updateCguContentSection, addCguContentSection, deleteCguContentSection } = useCguContent();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editKey, setEditKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setEditContent(section.section_content || '');
    setEditTitle(section.section_title || '');
    setEditKey(section.section_key || '');
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    setIsSaving(true);
    const success = await updateCguContentSection(editingSection, {
      section_content: editContent,
      section_title: editTitle,
      section_key: editKey
    });
    
    if (success) {
      setEditingSection(null);
      setEditContent('');
      setEditTitle('');
      setEditKey('');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditContent('');
    setEditTitle('');
    setEditKey('');
  };

  const handleAddSection = async () => {
    setIsAdding(true);
    await addCguContentSection();
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCguContentSection(id);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des sections CGU...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-dk-navy mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-sm text-muted-foreground">
            Gérez le contenu de vos CGU. Cliquez sur une section pour la modifier.
          </p>
        </div>
        <Button onClick={handleAddSection} disabled={isAdding} className="flex items-center gap-2">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Ajouter
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['sections']} className="space-y-3">
        <AccordionItem value="sections" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-dk-navy" />
              <span className="font-semibold">Sections CGU ({cguContentSections.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {cguContentSections.map((section) => (
              <div key={section.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{section.section_title}</p>
                    <p className="text-xs text-muted-foreground">
                      Clé: {section.section_key} • Ordre: {section.display_order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {editingSection !== section.id && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(section)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette section ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action est irréversible. La section "{section.section_title}" sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(section.id)}
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

                {editingSection === section.id ? (
                  <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Titre</Label>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="mt-1"
                          placeholder="Titre de la section"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Clé</Label>
                        <Input
                          value={editKey}
                          onChange={(e) => setEditKey(e.target.value)}
                          className="mt-1"
                          placeholder="Clé unique"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Contenu</Label>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[150px] mt-1"
                        placeholder="Contenu de la section..."
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Sauvegarder
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {section.section_content || 'Aucun contenu défini'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CguEditor;
