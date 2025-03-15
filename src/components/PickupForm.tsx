import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { pickupFormSchema, type PickupFormValues } from './pickup-form/pickupFormSchema';
import ContactSection from './pickup-form/ContactSection';
import PickupDetailsSection from './pickup-form/PickupDetailsSection';
import MapSection from './pickup-form/MapSection';

interface PickupFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

const PickupForm = ({ onPrevious, onNext }: PickupFormProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [vehicleData, setVehicleData] = useState({});
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  
  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupFormSchema),
  });

  const onSubmit = async (data: PickupFormValues) => {
    console.log('Pickup details:', data);
    try {
      setVehicleData(prev => ({
        ...prev,
        pickupAddress: data.address
      }));
      
      toast({
        title: "Première étape validée",
        description: "Veuillez remplir les informations de livraison",
      });
      onNext();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du formulaire",
      });
    }
  };

  if (isSubmitted) {
    return (
      <Alert className="bg-[#F2FCE2] border-green-200">
        <AlertTitle className="text-2xl font-bold text-[#40B058] mb-4">
          NOUS AVONS BIEN REÇU VOTRE DEMANDE DE DEVIS.
        </AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-blue-700">
            Pour toute question, n'hésitez pas à nous contacter à l'adresse suivante : {" "}
            <a href="mailto:contact@dkautomotive.fr" className="underline">
              contact@dkautomotive.fr
            </a>
          </p>
          <p className="text-gray-700 text-center mt-4">
            En vous remerciant de votre confiance.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold text-dk-navy mb-6">Coordonnées d'enlèvement</h2>
        
        <ContactSection form={form} />
        <PickupDetailsSection form={form} addressInputRef={addressInputRef} />
        <MapSection />

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
            SUIVANT
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PickupForm;
