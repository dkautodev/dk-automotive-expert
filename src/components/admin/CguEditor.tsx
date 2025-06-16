
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useCguContent } from '@/hooks/useCguContent';
import { Separator } from '@/components/ui/separator';

const CguEditor = () => {
  const { cguContentSections, isLoading, updateCguContentSection } = useCguContent();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (section: any) => {
    setEditingSection(section.id);
    setEditContent(section.section_content || '');
  };

  const handleSave = async () => {
    if (!editingSection) return;
    
    setIsSaving(true);
    const success = await updateCguContentSection(editingSection, editContent);
    
    if (success) {
      setEditingSection(null);
      setEditContent('');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditContent('');
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dk-navy mb-2">Éditeur - Conditions Générales d'Utilisation</h2>
        <p className="text-gray-600">Gérez le contenu de vos CGU</p>
      </div>

      <div className="space-y-6">
        {cguContentSections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.section_title}</CardTitle>
              <CardDescription>
                Clé: {section.section_key} • Ordre: {section.display_order}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingSection === section.id ? (
                <div className="space-y-4">
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
