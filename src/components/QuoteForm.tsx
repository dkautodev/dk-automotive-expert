import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import PickupForm from './PickupForm';
import DeliveryForm from './DeliveryForm';
import { Form } from '@/components/ui/form';
import VehicleDetailsForm from './quote-form/VehicleDetailsForm';
import { quoteFormSchema, type QuoteFormValues } from './quote-form/quoteFormSchema';

const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [vehicleData, setVehicleData] = useState<QuoteFormValues | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
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
    setVehicleData(data);
    setStep(2);
    toast({
      title: "Première étape validée",
      description: "Veuillez remplir les informations d'enlèvement",
    });
  };

  if (step === 3) {
    return <DeliveryForm onPrevious={() => setStep(2)} vehicleData={vehicleData} />;
  }

  if (step === 2) {
    return <PickupForm onPrevious={() => setStep(1)} onNext={() => setStep(3)} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <VehicleDetailsForm form={form} />

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
