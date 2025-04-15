
import React from "react";
import { format, isBefore, isAfter, addDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Control, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { MissionFormValues } from "./missionFormSchema";
import { toast } from "sonner";

interface DatePickerFieldProps {
  control: Control<MissionFormValues>;
  name: "pickup_date" | "delivery_date"; // Restrict to valid date fields
  label: string;
}

const DatePickerField = ({ control, name, label }: DatePickerFieldProps) => {
  const { watch } = useFormContext<MissionFormValues>();
  
  const pickupDate = watch("pickup_date");
  const deliveryDate = watch("delivery_date");
  const today = new Date();
  const tomorrow = addDays(today, 1);
  tomorrow.setHours(0, 0, 0, 0); // Définir à minuit pour la comparaison

  // Fonction pour désactiver les dates selon les contraintes
  const isDateDisabled = (date: Date) => {
    // Désactiver les dates avant demain
    if (isBefore(date, tomorrow)) {
      return true;
    }

    // Pour la date de livraison, désactiver les dates avant la date de prise en charge
    if (name === "delivery_date" && pickupDate && isBefore(date, pickupDate)) {
      return true;
    }

    return false;
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;

    // Vérifier que la date n'est pas avant demain
    if (isBefore(date, tomorrow)) {
      toast.error("La date ne peut pas être antérieure à demain");
      return;
    }

    // Si c'est la date de livraison, vérifier qu'elle n'est pas avant la date de prise en charge
    if (name === "delivery_date" && pickupDate && isBefore(date, pickupDate)) {
      toast.error("La date de livraison doit être postérieure à la date de prise en charge");
      return;
    }

    // Si c'est la date de prise en charge, vérifier l'impact sur la date de livraison
    if (name === "pickup_date" && deliveryDate && isAfter(date, deliveryDate)) {
      // Mettre à jour automatiquement la date de livraison
      const formContext = useFormContext<MissionFormValues>();
      formContext.setValue("delivery_date", date);
      toast.info("La date de livraison a été ajustée pour correspondre à la date de prise en charge");
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value as Date, "PPP")
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value as Date}
                onSelect={(date) => {
                  field.onChange(date);
                  handleSelectDate(date);
                }}
                disabled={isDateDisabled}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
