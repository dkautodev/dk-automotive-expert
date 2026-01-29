import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Save, Plus, Trash2, Edit, Facebook, Instagram, Linkedin, Twitter, Youtube, Link } from 'lucide-react';
import { useSocialLinks, SocialLink } from '@/hooks/useSocialLinks';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const iconOptions = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter / X', icon: Twitter },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'link', label: 'Lien générique', icon: Link },
];

const getIconComponent = (iconName: string | null) => {
  const option = iconOptions.find(o => o.value === iconName);
  return option?.icon || Link;
};

const SocialLinksEditor = () => {
  const { socialLinks, isLoading, updateSocialLink, addSocialLink, deleteSocialLink } = useSocialLinks();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<SocialLink>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setEditValues({
      platform_label: link.platform_label,
      url: link.url || '',
      icon: link.icon || 'link'
    });
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    await updateSocialLink(id, editValues);
    setEditingId(null);
    setEditValues({});
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleAdd = async () => {
    setIsAdding(true);
    await addSocialLink();
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSocialLink(id);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Chargement des réseaux sociaux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-dk-navy mb-2">Réseaux sociaux</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les liens vers vos réseaux sociaux affichés dans la barre de navigation.
          </p>
        </div>
        <Button onClick={handleAdd} disabled={isAdding} className="flex items-center gap-2">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Ajouter
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['social-links']} className="space-y-3">
        <AccordionItem value="social-links" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-dk-navy" />
              <span className="font-semibold">Liens sociaux ({socialLinks.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-4">
            {socialLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun réseau social configuré.
              </p>
            ) : (
              socialLinks.map((link) => {
                const IconComponent = getIconComponent(link.icon);
                const isEditing = editingId === link.id;

                return (
                  <div key={link.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{link.platform_label}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {link.url || 'Aucun lien défini'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!isEditing && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(link)}>
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
                                  <AlertDialogTitle>Supprimer ce réseau ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible. Le lien "{link.platform_label}" sera définitivement supprimé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(link.id)}
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

                    {isEditing && (
                      <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm">Nom du réseau</Label>
                            <Input
                              value={editValues.platform_label || ''}
                              onChange={(e) => setEditValues({ ...editValues, platform_label: e.target.value })}
                              className="mt-1"
                              placeholder="Facebook, Instagram..."
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Icône</Label>
                            <Select
                              value={editValues.icon || 'link'}
                              onValueChange={(value) => setEditValues({ ...editValues, icon: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {iconOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                      <option.icon className="w-4 h-4" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">URL du lien</Label>
                          <Input
                            value={editValues.url || ''}
                            onChange={(e) => setEditValues({ ...editValues, url: e.target.value })}
                            className="mt-1"
                            placeholder="https://facebook.com/votre-page"
                            type="url"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" onClick={() => handleSave(link.id)} disabled={isSaving}>
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
              })
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SocialLinksEditor;
