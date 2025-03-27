
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogoUpload } from "./LogoUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormData {
  email: string;
  phone: string;
  siret: string;
  vat_number: string;
  billing_address: string;
}

const Profile = () => {
  const { profile } = useAuthContext();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fieldToLock, setFieldToLock] = useState<'siret' | 'vat_number' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const form = useForm<ProfileFormData>({
    defaultValues: {
      email: profile?.email || "",
      phone: profile?.phone || "",
      siret: profile?.siret || "",
      vat_number: profile?.vat_number || "",
      billing_address: profile?.billing_address || ""
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        email: profile.email,
        phone: profile.phone || "",
        siret: profile.siret || "",
        vat_number: profile.vat_number || "",
        billing_address: profile.billing_address || ""
      });
    }
  }, [profile, form]);

  const handleLogoUpdate = async (logoUrl: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          profile_picture: logoUrl
        })
        .eq('id', profile?.id);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating logo:', error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour du logo.",
        variant: "destructive"
      });
    }
  };

  const confirmLockField = (field: 'siret' | 'vat_number', value: string) => {
    setFieldToLock(field);
    setTempValue(value);
    setShowConfirmDialog(true);
  };

  const handleConfirmLock = async () => {
    if (!fieldToLock || !profile?.id) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          [fieldToLock]: tempValue,
          [`${fieldToLock}_locked`]: true
        })
        .eq('id', profile.id);
      if (error) throw error;
      toast("Succès", {
        description: "Le champ a été mis à jour et verrouillé."
      });
      setShowConfirmDialog(false);
    } catch (error) {
      console.error('Error locking field:', error);
      toast("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updateData: any = {
        email: data.email,
        phone: data.phone,
        billing_address: data.billing_address
      };

      if (!profile?.siret_locked) {
        updateData.siret = data.siret;
      }
      if (!profile?.vat_number_locked) {
        updateData.vat_number = data.vat_number;
      }

      const { error } = await supabase.from('user_profiles').update(updateData).eq('id', profile?.id);
      if (error) throw error;
      toast("Profil mis à jour", {
        description: "Vos informations ont été mises à jour avec succès."
      });
    } catch (error: any) {
      toast("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/dashboard/client">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LogoUpload currentLogo={profile?.profile_picture} onUploadSuccess={handleLogoUpdate} />

          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={profile?.last_name || ""} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Prénom</Label>
              <Input value={profile?.first_name || ""} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Société</Label>
              <Input value={profile?.company || ""} disabled className="bg-gray-50" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <Label>Numéro de téléphone</Label>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <Label>Numéro SIRET</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={profile?.siret_locked}
                        onBlur={() => {
                          if (field.value && !profile?.siret_locked) {
                            confirmLockField('siret', field.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vat_number"
                render={({ field }) => (
                  <FormItem>
                    <Label>Numéro de TVA intracommunautaire</Label>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={profile?.vat_number_locked}
                        onBlur={() => {
                          if (field.value && !profile?.vat_number_locked) {
                            confirmLockField('vat_number', field.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_address"
                render={({ field }) => (
                  <FormItem>
                    <Label>Adresse de facturation</Label>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="Adresse complète pour facturation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Mettre à jour
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le verrouillage</DialogTitle>
            <DialogDescription>
              Cette information ne pourra plus être modifiée après confirmation. Êtes-vous sûr de vouloir continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmLock}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
