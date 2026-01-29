import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, ExternalLink, Edit } from 'lucide-react';
import { useProfessionalSpaceSettings } from '@/hooks/useProfessionalSpaceSettings';

const ProfessionalSpaceEditor = () => {
  const { professionalSpaceSettings, isLoading, updateProfessionalSpaceSetting } = useProfessionalSpaceSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (setting: any) => {
    setEditingId(setting.id);
    setEditValue(setting.setting_value || '');
  };

  const handleSave = async (settingId: string) => {
    setIsSaving(true);
    await updateProfessionalSpaceSetting(settingId, editValue);
    setEditingId(null);
    setEditValue('');
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dk-navy mb-2">Espace Professionnel</h1>
        <p className="text-sm text-muted-foreground">
          Configurez le lien vers votre espace professionnel affiché dans la navigation.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['settings']} className="space-y-3">
        <AccordionItem value="settings" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-dk-navy" />
              <span className="font-semibold">Paramètres ({professionalSpaceSettings.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {professionalSpaceSettings.map((setting) => {
              const isEditing = editingId === setting.id;

              return (
                <div key={setting.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{setting.setting_label}</p>
                      {setting.setting_value && !isEditing && (
                        <a 
                          href={setting.setting_value} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-dk-navy flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {setting.setting_value}
                        </a>
                      )}
                    </div>
                    {!isEditing && (
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(setting)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                      <div>
                        <Label className="text-sm">URL</Label>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="mt-1"
                          placeholder="https://example.com"
                          type="url"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={() => handleSave(setting.id)} disabled={isSaving}>
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                          Sauvegarder
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProfessionalSpaceEditor;
