import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MapPin, Car, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import VehicleCategorySelector from '../VehicleCategorySelector';

// Hooks & Components
import { useQuoteFlow } from '../hooks/useQuoteFlow';
import AddressSection from './components/AddressSection';
import PriceResultsCard from './components/PriceResultsCard';

interface NewAddressVehicleStepProps {
  form: UseFormReturn<QuoteFormValues>;
  onNext: (data: Partial<QuoteFormValues>) => void;
  distance: number | null;
  priceHT: string | null;
  priceTTC: string | null;
  setDistance: (distance: number | null) => void;
  setPriceHT: (price: string | null) => void;
  setPriceTTC: (price: string | null) => void;
}

const NewAddressVehicleStep = ({
  form,
  onNext,
  distance,
  priceHT,
  priceTTC,
  setDistance,
  setPriceHT,
  setPriceTTC
}: NewAddressVehicleStepProps) => {
  const {
    isCalculating,
    pickupInputRef,
    deliveryInputRef,
    pickupAuto,
    deliveryAuto,
    handleSwitchAddresses,
    handleCalculate,
    pickupAddress,
    deliveryAddress,
    vehicleType
  } = useQuoteFlow({ form, setDistance, setPriceHT, setPriceTTC });

  const handleNext = () => {
    if (!distance) {
      toast.error('Veuillez d\'abord calculer la distance et le prix');
      return;
    }
    onNext({
      pickup_address: form.getValues('pickup_address'),
      delivery_address: form.getValues('delivery_address'),
      vehicle_type: form.getValues('vehicle_type')
    });
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-dk-navy/10 rounded-lg flex items-center justify-center">
          <MapPin className="w-5 h-5 text-dk-navy" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-dk-navy">Adresses et catégorie de véhicule</h2>
          <p className="text-sm text-muted-foreground">Renseignez les lieux de prise en charge et de livraison</p>
        </div>
      </div>

      {/* 1. Address Section (Extracted) */}
      <AddressSection 
        form={form}
        pickupInputRef={pickupInputRef}
        deliveryInputRef={deliveryInputRef}
        pickupAuto={pickupAuto}
        deliveryAuto={deliveryAuto}
        onSwitch={handleSwitchAddresses}
      />

      {/* 2. Vehicle Category Section */}
      <div className="pt-2">
        <FormField control={form.control} name="vehicle_type" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold flex items-center gap-2 mb-3">
              <Car className="w-4 h-4" />
              CATÉGORIE DE VÉHICULE <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <VehicleCategorySelector 
                value={field.value} 
                onChange={field.onChange} 
                disabled={isCalculating}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* 3. Loading Indicator */}
      {isCalculating && (
        <div className="flex justify-center items-center py-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-dk-navy animate-pulse">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            <span className="text-sm font-semibold italic">Calcul en cours...</span>
          </div>
        </div>
      )}

      {/* 4. Results Card (Extracted) */}
      <PriceResultsCard 
        distance={distance}
        priceHT={priceHT}
        priceTTC={priceTTC}
      />

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button 
          type="button" 
          onClick={handleNext} 
          disabled={!distance} 
          className={cn(
            "bg-dk-navy hover:bg-dk-blue text-white px-8 py-5 text-base transition-colors",
            !distance && "opacity-50 cursor-not-allowed"
          )}
        >
          SUIVANT
        </Button>
      </div>
    </div>
  );
};

export default NewAddressVehicleStep;
