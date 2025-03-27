
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileData, ProfileFormData } from "./types";

interface ProfileFormProps {
  profile: ProfileData | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onLockField: (field: 'siret' | 'vat_number', value: string) => void;
}

const ProfileForm = ({ profile, onSubmit, onLockField }: ProfileFormProps) => {
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
        email: profile.email || "",
        phone: profile.phone || "",
        siret: profile.siret || "",
        vat_number: profile.vat_number || "",
        billing_address: profile.billing_address || ""
      });
    }
  }, [profile, form]);

  return (
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
                      onLockField('siret', field.value);
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
                      onLockField('vat_number', field.value);
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
  );
};

export default ProfileForm;
