import { UseFormReturn } from 'react-hook-form';
import { QuoteFormValues } from '../quoteFormSchema';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RefreshCcw, MapPin, Car, CheckCircle2, Lightbulb, Shield } from 'lucide-react';
import { vehicleTypes } from '@/lib/vehicleTypes';
import { useRef } from 'react';
import { toast } from 'sonner';
import { useGoogleAutocomplete } from "@/hooks/useGoogleAutocomplete";
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { assignRefs } from './assignRefs';
import { cn } from '@/lib/utils';

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
    calculatePrice,
    isCalculating
  } = usePriceCalculation();
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  const pickupAuto = useGoogleAutocomplete({
    ref: pickupInputRef,
    onPlaceSelected: place => {
      if (place && place.formatted_address) {
        form.setValue("pickup_address", place.formatted_address, { shouldValidate: true });
      }
    },
    types: ["geocode", "establishment"]
  });
  
  const deliveryAuto = useGoogleAutocomplete({
    ref: deliveryInputRef,
    onPlaceSelected: place => {
      if (place && place.formatted_address) {
        form.setValue("delivery_address", place.formatted_address, { shouldValidate: true });
      }
    },
    types: ["geocode", "establishment"]
  });

  const handleCalculate = async () => {
    const pickupAddress = form.getValues('pickup_address');
    const deliveryAddress = form.getValues('delivery_address');
    const vehicleType = form.getValues('vehicle_type');
    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error('Clé API Google Maps non configurée');
      return;
    }
    try {
      const service = new google.maps.DistanceMatrixService();
      const response = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
        service.getDistanceMatrix({
          origins: [pickupAddress],
          destinations: [deliveryAddress],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        }, (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK && response) {
            resolve(response);
          } else {
            reject(new Error(`Erreur Google Maps: ${status}`));
          }
        });
      });
      const element = response.rows[0]?.elements[0];
      if (!element || element.status !== 'OK') {
        throw new Error('Impossible de calculer la distance');
      }
      const distanceInKm = Math.ceil(element.distance.value / 1000);
      setDistance(distanceInKm);

      const priceResult = await calculatePrice(distanceInKm, vehicleType);
      if (!priceResult) {
        return;
      }
      setPriceHT(priceResult.priceHT);
      setPriceTTC(priceResult.priceTTC);
      toast.success('Distance et prix calculés avec succès');
    } catch (error) {
      console.error('Erreur lors du calcul:', error);
      toast.error('Erreur lors du calcul de la distance et du prix');
    }
  };

  const handleNext = () => {
    if (!distance) {
      toast.error('Veuillez d\'abord calculer la distance et le prix');
      return;
    }
    const data = {
      pickup_address: form.getValues('pickup_address'),
      delivery_address: form.getValues('delivery_address'),
      vehicle_type: form.getValues('vehicle_type')
    };
    onNext(data);
  };

  const handleSwitchAddresses = () => {
    const pickup = form.getValues('pickup_address');
    const delivery = form.getValues('delivery_address');
    form.setValue('pickup_address', delivery || '', { shouldValidate: true });
    form.setValue('delivery_address', pickup || '', { shouldValidate: true });
    setDistance(null);
    setPriceHT(null);
    setPriceTTC(null);
    toast.success("Les adresses ont été échangées !");
  };

  const pickupAddress = form.watch('pickup_address');
  const deliveryAddress = form.watch('delivery_address');
  const vehicleType = form.watch('vehicle_type');

  return (
    <div className="space-y-6">
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

      {/* Address Fields - Side by side on desktop, stacked with button in between on mobile */}
      
      {/* Desktop Layout */}
      <div className="hidden lg:block space-y-2">
        {/* Labels row */}
        <div className="grid grid-cols-2 gap-12">
          <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            ADRESSE DE PRISE EN CHARGE <span className="text-destructive">*</span>
          </FormLabel>
          <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            ADRESSE DE LIVRAISON <span className="text-destructive">*</span>
          </FormLabel>
        </div>
        
        {/* Inputs row with swap button in between */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
          <FormField
            control={form.control}
            name="pickup_address"
            render={({ field }: any) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={pickupAuto.error ? "Une erreur s'est produite" : "Saisissez l'adresse complète"}
                      className={`pl-10 bg-muted/50 border-border focus-visible:ring-dk-navy ${pickupAuto.error ? 'opacity-60 cursor-not-allowed border-destructive' : ''}`}
                      {...field}
                      ref={assignRefs(pickupInputRef, field.ref)}
                      disabled={!!pickupAuto.error}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      autoComplete="off"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <button
            type="button"
            aria-label="Échanger les adresses"
            onClick={handleSwitchAddresses}
            className="bg-card border border-border rounded-full shadow-sm p-2.5 flex items-center justify-center hover:bg-muted active:scale-95 transition-all"
          >
            <RefreshCcw className="w-4 h-4 text-dk-navy" />
          </button>
          
          <FormField
            control={form.control}
            name="delivery_address"
            render={({ field }: any) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={deliveryAuto.error ? "Une erreur s'est produite" : "Saisissez l'adresse complète"}
                      className={`pl-10 bg-muted/50 border-border focus-visible:ring-dk-navy ${deliveryAuto.error ? 'opacity-60 cursor-not-allowed border-destructive' : ''}`}
                      {...field}
                      ref={assignRefs(deliveryInputRef, field.ref)}
                      disabled={!!deliveryAuto.error}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      autoComplete="off"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Mobile Layout - Stacked with button between fields */}
      <div className="lg:hidden space-y-3">
        {/* Pickup Address */}
        <div className="space-y-1">
          <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            ADRESSE DE PRISE EN CHARGE <span className="text-destructive">*</span>
          </FormLabel>
          <FormField
            control={form.control}
            name="pickup_address"
            render={({ field }: any) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={pickupAuto.error ? "Une erreur s'est produite" : "Saisissez l'adresse complète"}
                      className={`pl-10 bg-muted/50 border-border focus-visible:ring-dk-navy ${pickupAuto.error ? 'opacity-60 cursor-not-allowed border-destructive' : ''}`}
                      {...field}
                      ref={assignRefs(pickupInputRef, field.ref)}
                      disabled={!!pickupAuto.error}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      autoComplete="off"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Swap Button - Centered between fields */}
        <div className="flex justify-center">
          <button
            type="button"
            aria-label="Échanger les adresses"
            onClick={handleSwitchAddresses}
            className="bg-card border border-border rounded-full shadow-sm p-2 flex items-center justify-center hover:bg-muted active:scale-95 transition-all"
          >
            <RefreshCcw className="w-4 h-4 text-dk-navy" />
          </button>
        </div>
        
        {/* Delivery Address */}
        <div className="space-y-1">
          <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            ADRESSE DE LIVRAISON <span className="text-destructive">*</span>
          </FormLabel>
          <FormField
            control={form.control}
            name="delivery_address"
            render={({ field }: any) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={deliveryAuto.error ? "Une erreur s'est produite" : "Saisissez l'adresse complète"}
                      className={`pl-10 bg-muted/50 border-border focus-visible:ring-dk-navy ${deliveryAuto.error ? 'opacity-60 cursor-not-allowed border-destructive' : ''}`}
                      {...field}
                      ref={assignRefs(deliveryInputRef, field.ref)}
                      disabled={!!deliveryAuto.error}
                      onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                      autoComplete="off"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="pt-2">
        <FormField control={form.control} name="vehicle_type" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-dk-navy font-semibold flex items-center gap-2">
              <Car className="w-4 h-4" />
              CATÉGORIE DE VÉHICULE <span className="text-destructive">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-muted/50 border-border focus:ring-dk-navy">
                  <SelectValue placeholder="Sélectionner une catégorie de véhicule" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-popover border-border">
                {vehicleTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          onClick={handleCalculate}
          disabled={!pickupAddress || !deliveryAddress || !vehicleType || isCalculating}
          className="bg-dk-navy hover:bg-dk-blue text-white flex items-center gap-2 px-6 py-5 text-base transition-colors"
        >
          <Calculator className="h-5 w-5" />
          {isCalculating ? "Calcul en cours..." : "Calculer la distance et le prix"}
        </Button>
      </div>

      {/* Results Card */}
      {distance && priceHT && priceTTC && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Résultat du calcul</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">Distance</span>
              <p className="font-bold text-lg text-dk-navy">{distance} km</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">Prix HT</span>
              <p className="font-bold text-lg text-dk-navy">{priceHT} €</p>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center">
              <span className="text-muted-foreground block text-xs uppercase tracking-wide">Prix TTC</span>
              <p className="font-bold text-lg text-green-600">{priceTTC} €</p>
            </div>
          </div>
          
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-green-800">
              <Lightbulb className="w-4 h-4 flex-shrink-0" />
              <span>Tous frais inclus</span>
            </li>
            <li className="flex items-center gap-2 text-green-800">
              <Car className="w-4 h-4 flex-shrink-0" />
              <span>Livraison par chauffeur professionnel</span>
            </li>
            <li className="flex items-center gap-2 text-green-800">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>Assurance tous risques</span>
            </li>
          </ul>
        </div>
      )}

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
