import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { CalendarIcon, Clock, Mail } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { useQuoteManagement } from '@/hooks/useQuoteManagement';
import { useNavigate } from 'react-router-dom';
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
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const deliveryFormSchema = z.object({
  companyName: z.string().min(1, "Le nom de la société est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  firstName: z.string().min(1, "Le prénom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  deliveryDate: z.date({
    required_error: "La date de livraison est requise",
  }),
  deliveryTime: z.string().min(1, "L'heure de livraison est requise"),
  additionalMessage: z.string().optional(),
});

type DeliveryFormValues = z.infer<typeof deliveryFormSchema>;

interface DeliveryFormProps {
  onPrevious: () => void;
  vehicleData: {
    pickupAddress: string;
    deliveryAddress: string;
    vehicles: any[];
    priceHT: number;
  };
}

const DeliveryForm = ({ onPrevious, vehicleData }: DeliveryFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { saveQuote } = useQuoteManagement();
  const navigate = useNavigate();
  
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
  });

  const onSubmit = async (data: DeliveryFormValues) => {
    try {
      const quoteData = {
        id: crypto.randomUUID(),
        pickupAddress: vehicleData.pickupAddress,
        deliveryAddress: data.address,
        vehicles: vehicleData.vehicles,
        totalPriceHT: vehicleData.priceHT,
        status: 'pending' as const,
        dateCreated: new Date()
      };

      await saveQuote(quoteData);
      
      toast({
        title: "Devis envoyé",
        description: "Votre devis a été envoyé avec succès",
      });
      
      navigate("/dashboard/client/pending-quotes");
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du devis",
      });
    }
  };

  const libraries = ['places'];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });

  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const initAutocomplete = (input: HTMLInputElement) => {
    if (!isLoaded || !input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'fr' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        form.setValue('address', place.formatted_address);
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Alert className="bg-[#F2FCE2] border-green-200">
          <AlertTitle className="text-2xl font-bold text-[#40B058] mb-4">
            NOUS AVONS BIEN REÇU VOTRE DEMANDE DE DEVIS.
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-blue-700">
              Pour toute question, n'hésitez pas à nous contacter à l'adresse suivante : {" "}
              <a href="mailto:dkautomotive70@gmail.com" className="underline">
                dkautomotive70@gmail.com
              </a>
            </p>
            <p className="text-gray-700 text-center mt-4">
              En vous remerciant de votre confiance.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold text-dk-navy mb-6">Coordonnées de livraison</h2>
        
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
                  <Input
                    placeholder="Commencez à taper une adresse..."
                    {...field}
                    className="bg-[#EEF1FF]"
                    ref={(e) => {
                      addressInputRef.current = e;
                      if (e) initAutocomplete(e);
                    }}
                  />
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
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  DATE DE LIVRAISON <span className="text-blue-500">*</span>
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

          <FormField
            control={form.control}
            name="deliveryTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  HEURE DE LIVRAISON <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="time"
                      placeholder="Choisir une heure" 
                      {...field} 
                      className="bg-[#EEF1FF] pl-10" 
                    />
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additionalMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  MESSAGE COMPLÉMENTAIRE
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ajoutez des informations complémentaires à votre demande..."
                    className="bg-[#EEF1FF] min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2 h-[300px] rounded-lg overflow-hidden">
            {!isLoaded ? (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                Chargement de la carte...
              </div>
            ) : (
              <GoogleMap
                zoom={5}
                center={{ lat: 46.603354, lng: 1.888334 }}
                mapContainerClassName="w-full h-full"
              />
            )}
          </div>
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
            <Mail className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DeliveryForm;
