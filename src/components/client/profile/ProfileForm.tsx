
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProfileData, ProfileFormData } from "./types";
import { useProfileContext } from "./ProfileContext";
import { profileFormSchema } from "./schemas/profileFormSchema";

interface ProfileFormProps {
  profile: ProfileData | null;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onLockField: (field: 'siret' | 'vat_number', value: string) => void;
}

const ProfileForm = ({ profile, onSubmit, onLockField }: ProfileFormProps) => {
  const { isLoading } = useProfileContext();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: profile?.email || "",
      phone: profile?.phone || "",
      siret: profile?.siret || "",
      vat_number: profile?.vat_number || "",
      billing_address_street: profile?.billing_address_street || "",
      billing_address_city: profile?.billing_address_city || "",
      billing_address_postal_code: profile?.billing_address_postal_code || "",
      billing_address_country: profile?.billing_address_country || "France"
    }
  });

  useEffect(() => {
    if (profile) {
      console.log("Resetting form with profile data:", profile);
      form.reset({
        email: profile.email || "",
        phone: profile.phone || "",
        siret: profile.siret || "",
        vat_number: profile.vat_number || "",
        billing_address_street: profile?.billing_address_street || "",
        billing_address_city: profile?.billing_address_city || "",
        billing_address_postal_code: profile?.billing_address_postal_code || "",
        billing_address_country: profile?.billing_address_country || "France"
      });
    }
  }, [profile, form]);

  const handleFormSubmit = async (data: ProfileFormData) => {
    console.log("Form submitted with data:", data);
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                  placeholder="14 chiffres"
                  maxLength={14}
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
                  placeholder="FR12345678912"
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

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Adresse de facturation</h3>
          
          <FormField
            control={form.control}
            name="billing_address_street"
            render={({ field }) => (
              <FormItem>
                <Label>Rue et numéro</Label>
                <FormControl>
                  <Input {...field} placeholder="123 rue de Paris" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billing_address_postal_code"
              render={({ field }) => (
                <FormItem>
                  <Label>Code postal</Label>
                  <FormControl>
                    <Input {...field} placeholder="75001" maxLength={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billing_address_city"
              render={({ field }) => (
                <FormItem>
                  <Label>Ville</Label>
                  <FormControl>
                    <Input {...field} placeholder="Paris" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="billing_address_country"
            render={({ field }) => (
              <FormItem>
                <Label>Pays</Label>
                <FormControl>
                  <Input {...field} placeholder="France" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
