
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { MissionFormValues } from "./missionFormSchema";
import DatePickerField from "./DatePickerField";
import { Button } from "../ui/button";
import ContactSelector from "@/components/client/address-book/ContactSelector";
import { ContactEntry } from "@/types/addressBook";

interface ContactScheduleStepProps {
  form: UseFormReturn<MissionFormValues>;
}

const ContactScheduleStep = ({ form }: ContactScheduleStepProps) => {
  // Fonction pour gérer la sélection d'un contact pour le pickup
  const handlePickupContactSelect = (contact: ContactEntry) => {
    form.setValue('pickup_first_name', contact.firstName, { shouldValidate: true });
    form.setValue('pickup_last_name', contact.lastName, { shouldValidate: true });
    form.setValue('pickup_email', contact.email, { shouldValidate: true });
    form.setValue('pickup_phone', contact.phone, { shouldValidate: true });
  };

  // Fonction pour gérer la sélection d'un contact pour la livraison
  const handleDeliveryContactSelect = (contact: ContactEntry) => {
    form.setValue('delivery_first_name', contact.firstName, { shouldValidate: true });
    form.setValue('delivery_last_name', contact.lastName, { shouldValidate: true });
    form.setValue('delivery_email', contact.email, { shouldValidate: true });
    form.setValue('delivery_phone', contact.phone, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-medium">Contact pour la prise en charge</h3>
          <ContactSelector 
            onSelectContact={handlePickupContactSelect}
            buttonClassName="h-8 text-xs px-2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pickup_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom du contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickup_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickup_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemple.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickup_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="06 xx xx xx xx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            control={form.control}
            name="pickup_date"
            label="Date de prise en charge"
          />
          <FormField
            control={form.control}
            name="pickup_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de prise en charge</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-medium">Contact pour la livraison</h3>
          <ContactSelector 
            onSelectContact={handleDeliveryContactSelect}
            buttonClassName="h-8 text-xs px-2"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="delivery_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom du contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="delivery_last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="delivery_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemple.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="delivery_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="06 xx xx xx xx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            control={form.control}
            name="delivery_date"
            label="Date de livraison"
          />
          <FormField
            control={form.control}
            name="delivery_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure de livraison</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">
          Informations supplémentaires
        </h3>
        <FormField
          control={form.control}
          name="additional_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Précisions ou instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informations supplémentaires..."
                  rows={4}
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactScheduleStep;
