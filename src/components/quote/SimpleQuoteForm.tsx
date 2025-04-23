
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader } from '@/components/ui/loader';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { vehicleTypes } from '@/lib/vehicleTypes';

const quoteFormSchema = z.object({
  vehicle_type: z.string().min(1, "Le type de véhicule est requis"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  licensePlate: z.string().optional(),
  
  pickup_address: z.string().min(1, "L'adresse de départ est requise"),
  delivery_address: z.string().min(1, "L'adresse d'arrivée est requise"),
  
  company: z.string().min(1, "La société est requise"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Format d'email invalide"),
  phone: z.string().min(1, "Le téléphone est requis"),
  
  additionalInfo: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const SimpleQuoteForm = () => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      vehicle_type: '',
      brand: '',
      model: '',
      licensePlate: '',
      pickup_address: '',
      delivery_address: '',
      company: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      additionalInfo: '',
    }
  });

  const onSubmit = async (data: QuoteFormValues) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-quote-request', {
        body: {
          ...data,
          mission_type: 'livraison',
          pickup_contact: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
          },
          delivery_contact: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous 24h",
        variant: "default"
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast({
        title: "Erreur",
        description: error.message || 'Une erreur est survenue lors de l\'envoi de votre demande',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section véhicule */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dk-navy">Informations du véhicule</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de véhicule <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#EEF1FF]">
                            <SelectValue placeholder="Choisir un type de véhicule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
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
                      <FormLabel>Marque <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Renault, Peugeot..." {...field} className="bg-[#EEF1FF]" />
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
                      <FormLabel>Modèle <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Clio, 208..." {...field} className="bg-[#EEF1FF]" />
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
                      <FormLabel>Immatriculation</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AB-123-CD" {...field} className="bg-[#EEF1FF]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Section adresses */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dk-navy">Adresses</h2>
              
              <FormField
                control={form.control}
                name="pickup_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de départ <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse complète de prise en charge" {...field} className="bg-[#EEF1FF]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="delivery_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse d'arrivée <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse complète de livraison" {...field} className="bg-[#EEF1FF]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Section contact */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-dk-navy">Vos coordonnées</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Société <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de votre entreprise" {...field} className="bg-[#EEF1FF]" />
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
                      <FormLabel>Prénom <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} className="bg-[#EEF1FF]" />
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
                      <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} className="bg-[#EEF1FF]" />
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
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Votre adresse email" {...field} className="bg-[#EEF1FF]" />
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
                      <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Votre numéro de téléphone" {...field} className="bg-[#EEF1FF]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Section information complémentaire */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informations complémentaires</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ajouter des détails supplémentaires sur votre demande"
                        {...field}
                        className="bg-[#EEF1FF] min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-[#1a237e] hover:bg-[#3f51b5] min-w-[200px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ENVOI EN COURS...
                  </>
                ) : 'DEMANDER MON DEVIS'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
