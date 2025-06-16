
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, ExternalLink } from 'lucide-react';
import { useProfessionalSpaceSettings } from '@/hooks/useProfessionalSpaceSettings';

const ProfessionalSpaceEditor = () => {
  const { professionalSpaceSettings, isLoading, updateProfessionalSpaceSetting } = useProfessionalSpaceSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (settingId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const handleSave = async (settingId: string) => {
    const value = formData[settingId];
    if (value === undefined) return;

    setIsSaving(true);
    await updateProfessionalSpaceSetting(settingId, value);
    setIsSaving(false);
    
    // Clear the form data for this setting
    setFormData(prev => {
      const newData = { ...prev };
      delete newData[settingId];
      return newData;
    });
  };

  const getCurrentValue = (setting: any) => {
    return formData[setting.id] !== undefined ? formData[setting.id] : (setting.setting_value || '');
  };

  const hasUnsavedChanges = (setting: any) => {
    return formData[setting.id] !== undefined && formData[setting.id] !== setting.setting_value;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dk-navy">Gestion de l'Espace Professionnel</h2>
        <p className="text-gray-600 mt-2">
          Configurez le lien vers votre espace professionnel qui apparaît dans la navigation du site.
        </p>
      </div>

      <div className="space-y-6">
        {professionalSpaceSettings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <CardTitle className="text-lg">{setting.setting_label}</CardTitle>
              <CardDescription>
                Modifiez l'URL de votre espace professionnel. Cette URL sera utilisée pour le bouton de navigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`setting-${setting.id}`}>URL</Label>
                <div className="flex gap-2">
                  <Input
                    id={`setting-${setting.id}`}
                    type="url"
                    value={getCurrentValue(setting)}
                    onChange={(e) => handleInputChange(setting.id, e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSave(setting.id)}
                    disabled={!hasUnsavedChanges(setting) || isSaving}
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {setting.setting_value && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  <span>URL actuelle : </span>
                  <a 
                    href={setting.setting_value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dk-navy hover:underline"
                  >
                    {setting.setting_value}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSpaceEditor;
