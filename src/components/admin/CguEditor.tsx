
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { useCguContent } from '@/hooks/useCguContent';
import { Separator } from '@/components/ui/separator';
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
    setIsDeleting(id);
    await deleteCguContentSection(id);
    setIsDeleting(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des sections CGU...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-dk-navy mb-2">Éditeur - Conditions Générales d'Utilisation</h2>
          <p className="text-gray-600">Gérez le contenu de vos CGU</p>
        </div>
        <Button onClick={handleAddSection} disabled={isAdding} className="flex items-center gap-2">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Ajouter un paragraphe
        </Button>
      </div>

      <div className="space-y-6">
        {cguContentSections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">{section.section_title}</CardTitle>
                <CardDescription>
                  Clé: {section.section_key} • Ordre: {section.display_order}
                </CardDescription>
              </div>
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
                      Cette action est irréversible. La section "{section.section_title}" sera définitivement supprimée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(section.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting === section.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent>
              {editingSection === section.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${section.id}`}>Titre</Label>
                      <Input
                        id={`title-${section.id}`}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-2"
                        placeholder="Titre de la section"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`key-${section.id}`}>Clé</Label>
                      <Input
                        id={`key-${section.id}`}
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                        className="mt-2"
                        placeholder="Clé unique de la section"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`content-${section.id}`}>Contenu</Label>
                    <Textarea
                      id={`content-${section.id}`}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[150px] mt-2"
                      placeholder="Saisissez le contenu de cette section..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {section.section_content || 'Aucun contenu défini'}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleEdit(section)}>
                    Modifier
                  </Button>
                </div>
              )}
            </CardContent>
            {index < cguContentSections.length - 1 && <Separator className="mt-4" />}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CguEditor;
