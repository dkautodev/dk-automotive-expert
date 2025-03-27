
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProfileData, ProfileFormData } from "./types";
import { useProfileContext } from "./ProfileContext";
import { profileFormSchema } from "./schemas/profileFormSchema";
import ContactSection from "./form-sections/ContactSection";
import BusinessSection from "./form-sections/BusinessSection";
import AddressSection from "./form-sections/AddressSection";

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
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <ContactSection control={form.control} />
        <BusinessSection control={form.control} profile={profile} onLockField={onLockField} />
        <AddressSection control={form.control} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
