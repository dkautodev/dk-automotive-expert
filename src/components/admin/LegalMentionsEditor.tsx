
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLegalMentions } from '@/hooks/useLegalMentions';
import { Save, Loader2 } from 'lucide-react';

const LegalMentionsEditor = () => {
  const { legalMentions, isLoading, updateLegalMention } = useLegalMentions();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [savingItems, setSavingItems] = useState<Set<string>>(new Set());

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
    
    const success = await updateLegalMention(id, newValue);
    
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

  const getCurrentValue = (item: any) => {
    return editedValues[item.field_key] !== undefined 
      ? editedValues[item.field_key] 
      : (item.field_value || '');
  };

  const hasChanges = (fieldKey: string) => {
    return editedValues[fieldKey] !== undefined;
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
        <CardContent>
          <div className="space-y-6">
            {legalMentions.map((item) => (
              <div key={item.id} className="space-y-2">
                <Label htmlFor={item.field_key} className="text-sm font-medium">
                  {item.field_label}
                </Label>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalMentionsEditor;
