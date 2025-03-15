
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  vehicleType: z.string({
    required_error: "Le type de véhicule est requis",
  }),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().min(4, "L'année est requise"),
  licensePlate: z.string().min(1, "L'immatriculation est requise"),
  fuelType: z.string({
    required_error: "Le type de carburant est requis",
  }),
});

type QuoteFormValues = z.infer<typeof formSchema>;

const QuoteForm = () => {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: '',
      brand: '',
      model: '',
      year: '',
      licensePlate: '',
      fuelType: '',
    },
  });

  const onSubmit = (data: QuoteFormValues) => {
    console.log(data);
    toast({
      title: "Formulaire soumis",
      description: "Vos informations ont été enregistrées",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  TYPE DE VÉHICULE <span className="text-blue-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#EEF1FF]">
                      <SelectValue placeholder="Choix du véhicule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="citadine">Citadine</SelectItem>
                    <SelectItem value="berline">Berline</SelectItem>
                    <SelectItem value="suv">4x4 (ou SUV)</SelectItem>
                    <SelectItem value="utilitaire-3-5">Utilitaire 3-5m3</SelectItem>
                    <SelectItem value="utilitaire-6-12">Utilitaire 6-12m3</SelectItem>
                    <SelectItem value="utilitaire-12-15">Utilitaire 12-15m3</SelectItem>
                    <SelectItem value="utilitaire-15-20">Utilitaire 15-20m3</SelectItem>
                    <SelectItem value="utilitaire-20plus">Utilitaire + de 20m3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  MARQUE DU VÉHICULE <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Exemple : Citroën" 
                    {...field} 
                    className="bg-[#EEF1FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  MODÈLE DU VÉHICULE <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="exemple : Jumper" 
                    {...field} 
                    className="bg-[#EEF1FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  ANNÉE DU VÉHICULE <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Exemple : 2024" 
                    {...field} 
                    className="bg-[#EEF1FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  IMMATRICULATION <span className="text-blue-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Exemple : AA-000-AA" 
                    {...field} 
                    className="bg-[#EEF1FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dk-navy font-semibold">
                  TYPE DE CARBURANT <span className="text-blue-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#EEF1FF]">
                      <SelectValue placeholder="Choix du carburant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="gasoline">Essence</SelectItem>
                    <SelectItem value="electric">Électrique</SelectItem>
                    <SelectItem value="hybrid">Hybride</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-sm text-gray-600 mt-6">
          Nous tenons à vous informer que notre service de convoyage est exclusivement dédié aux véhicules en état de marche, car nos experts convoyeurs assurent le transport en conduisant personnellement chaque véhicule. Nous ne faisons pas appel à des plateaux ou des camions pour ce service.
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-[#1a237e] hover:bg-[#3f51b5]">
            SUIVANT
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuoteForm;
