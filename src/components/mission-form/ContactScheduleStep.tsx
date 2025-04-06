
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MissionFormValues } from "./missionFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Clock } from "lucide-react";
import DatePickerField from "./DatePickerField";
import AttachmentsField from "./AttachmentsField";

interface ContactScheduleStepProps {
  form: UseFormReturn<MissionFormValues>;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

const ContactScheduleStep = ({
  form,
  onSubmit,
  onPrevious,
  isSubmitting
}: ContactScheduleStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Contacts et planning</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact de prise en charge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pickup_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
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
                    <Input placeholder="Nom" {...field} />
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
                    <Input type="email" placeholder="Email" {...field} />
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
                    <Input placeholder="Téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact de livraison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="delivery_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
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
                    <Input placeholder="Nom" {...field} />
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
                    <Input type="email" placeholder="Email" {...field} />
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
                    <Input placeholder="Téléphone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Planning prise en charge</h3>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField form={form} name="pickup_date" label="Date" />
            <FormField
              control={form.control}
              name="pickup_time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Heure</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" className="pl-10 w-full" {...field} />
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Planning livraison</h3>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField form={form} name="delivery_date" label="Date" />
            <FormField
              control={form.control}
              name="delivery_time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Heure</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" className="pl-10 w-full" {...field} />
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="additional_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compléments d'information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Précisez vos éventuelles demandes particulières..."
                    className="resize-none min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:col-span-2">
          <AttachmentsField form={form} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </span>
          ) : (
            "Créer la mission"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactScheduleStep;
