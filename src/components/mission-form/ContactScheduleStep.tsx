import React from "react";
import { UseFormReturn } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ClientSelector from "./ClientSelector";
import { useClients } from "./hooks/useClients";
import { MissionFormValues } from "./missionFormSchema";
import DatePickerField from "./DatePickerField";
import { useAuthContext } from "@/context/AuthContext";

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
  isSubmitting,
}: ContactScheduleStepProps) => {
  const { clients, isLoading: clientsLoading } = useClients();
  const { role } = useAuthContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Informations de contact et planning</h2>

      {/* Sélecteur de client (uniquement visible pour les administrateurs) */}
      {role === "admin" && (
        <ClientSelector form={form} clients={clients} loading={clientsLoading} />
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact d'enlèvement</h3>
          <FormField
            control={form.control}
            name="pickup_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input type="email" {...field} />
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
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact de livraison</h3>
          <FormField
            control={form.control}
            name="delivery_first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input type="email" {...field} />
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
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Planning d'enlèvement</h3>
          <DatePickerField
            form={form}
            name="pickup_date"
            label="Date d'enlèvement"
          />
          <FormField
            control={form.control}
            name="pickup_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure d'enlèvement</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Planning de livraison</h3>
          <DatePickerField
            form={form}
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
        <h3 className="text-lg font-medium">Informations complémentaires</h3>
        <FormField
          control={form.control}
          name="additional_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes additionnelles</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informations supplémentaires pour la mission"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
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
