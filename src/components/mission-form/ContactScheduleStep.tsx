
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./missionFormSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatePickerField from "./DatePickerField";
import AttachmentsField from "./AttachmentsField";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface ContactScheduleStepProps {
  form: UseFormReturn<MissionFormValues>;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  termsAccepted?: boolean;
  onTermsChange?: (value: boolean) => void;
}

const ContactScheduleStep = ({ 
  form, 
  onSubmit, 
  onPrevious, 
  isSubmitting,
  termsAccepted = false,
  onTermsChange
}: ContactScheduleStepProps) => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="pickup" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="pickup">Contact prise en charge</TabsTrigger>
          <TabsTrigger value="delivery">Contact livraison</TabsTrigger>
        </TabsList>

        <TabsContent value="pickup" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Input type="email" placeholder="Email du contact" {...field} />
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
                    <Input placeholder="Téléphone du contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Input type="email" placeholder="Email du contact" {...field} />
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
                    <Input placeholder="Téléphone du contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Planning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              form={form}
              name="pickup_date"
              label="Date de prise en charge"
            />
            <FormField
              control={form.control}
              name="pickup_time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Heure</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" className="pl-10 w-full" {...field} />
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 h-5 w-5 text-gray-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField
              form={form}
              name="delivery_date"
              label="Date de livraison"
            />
            <FormField
              control={form.control}
              name="delivery_time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Heure</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="time" className="pl-10 w-full" {...field} />
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-2.5 h-5 w-5 text-gray-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="additional_info"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Informations supplémentaires</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ajoutez toute information complémentaire qui pourrait être utile"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AttachmentsField form={form} />

      <div className="flex items-start space-x-2 my-4">
        <Checkbox 
          id="terms" 
          checked={termsAccepted} 
          onCheckedChange={(checked) => onTermsChange?.(checked === true)}
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
          En cliquant sur "Créer la mission", vous reconnaissez avoir lu et accepté les{" "}
          <Link to="/cgv" target="_blank" className="text-blue-500 hover:underline">
            Conditions Générales de Vente
          </Link>
        </label>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button 
          type="button" 
          onClick={onSubmit}
          disabled={isSubmitting || !termsAccepted}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Créer la mission"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContactScheduleStep;
