
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const pickupFormSchema = z.object({
  companyName: z.string().min(1, "Le nom de la société est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  pickupDate: z.date({
    required_error: "La date d'enlèvement est requise",
  }),
});

type PickupFormValues = z.infer<typeof pickupFormSchema>;

interface PickupFormProps {
  onPrevious: () => void;
}

const PickupForm = ({ onPrevious }: PickupFormProps) => {
  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupFormSchema),
  });

  const onSubmit = (data: PickupFormValues) => {
    console.log('Pickup details:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  NOM DE LA SOCIÉTÉ <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nom de la société" {...field} className="bg-[#EEF1FF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  NOM <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} className="bg-[#EEF1FF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  PRÉNOM <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" {...field} className="bg-[#EEF1FF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  ADRESSE <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Adresse complète" {...field} className="bg-[#EEF1FF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  EMAIL <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="votre@email.com" {...field} className="bg-[#EEF1FF]" />
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
                <FormLabel className="text-dk-navy font-semibold">
                  TÉLÉPHONE <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Votre numéro" {...field} className="bg-[#EEF1FF]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-dk-navy font-semibold">
                  DATE D'ENLÈVEMENT <span className="text-blue-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-[#EEF1FF]",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date()
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            type="button" 
            variant="outline"
            onClick={onPrevious}
            className="bg-white"
          >
            RETOUR
          </Button>
          <Button type="submit" className="bg-[#1a237e] hover:bg-[#3f51b5]">
            ENVOYER
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PickupForm;
