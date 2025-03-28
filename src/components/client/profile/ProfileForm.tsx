
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProfileData } from "./types";
import { useProfileContext } from "./ProfileContext";
import { profileFormSchema, ProfileFormSchemaType } from "./schemas/profileFormSchema";
import ContactSection from "./form-sections/ContactSection";
import BusinessSection from "./form-sections/BusinessSection";
import AddressSection from "./form-sections/AddressSection";
import { toast } from "sonner";

interface ProfileFormProps {
  profile: ProfileData | null;
  onSubmit: (data: ProfileFormSchemaType) => Promise<void>;
  onLockField: (field: 'siret' | 'vat_number', value: string) => void;
}

const ProfileForm = ({ profile, onSubmit, onLockField }: ProfileFormProps) => {
  const { isLoading } = useProfileContext();
  const [editingSections, setEditingSections] = useState<{
    contact: boolean;
    business: boolean;
    address: boolean;
  }>({
    contact: false,
    business: false,
    address: false
  });
  
  const form = useForm<ProfileFormSchemaType>({
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

  const handleSubmitSection = async (section: 'contact' | 'business' | 'address') => {
    try {
      const values = form.getValues();
      await onSubmit(values);
      setEditingSections(prev => ({ ...prev, [section]: false }));
      toast.success(`Section ${getSectionName(section)} mise à jour avec succès`);
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const getSectionName = (section: 'contact' | 'business' | 'address'): string => {
    switch (section) {
      case 'contact': return 'Contact';
      case 'business': return 'Informations fiscales';
      case 'address': return 'Adresse';
    }
  };

  const toggleEditSection = (section: 'contact' | 'business' | 'address') => {
    setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <ContactSection 
          control={form.control} 
          emailDisabled={!!profile?.email}
          isEditing={editingSections.contact}
          onToggleEdit={() => toggleEditSection('contact')}
          onSave={() => handleSubmitSection('contact')}
        />
        
        <BusinessSection 
          control={form.control} 
          profile={profile}
          onLockField={onLockField} 
          isEditing={editingSections.business}
          onToggleEdit={() => toggleEditSection('business')}
          onSave={() => handleSubmitSection('business')}
        />
        
        <AddressSection 
          control={form.control}
          isEditing={editingSections.address}
          onToggleEdit={() => toggleEditSection('address')}
          onSave={() => handleSubmitSection('address')}
        />
      </form>
    </Form>
  );
};

export default ProfileForm;
