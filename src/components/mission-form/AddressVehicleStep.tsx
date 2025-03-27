
import { UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Check, RotateCw } from "lucide-react";
import { MissionFormValues } from "./missionFormSchema";
import { vehicleTypes } from "@/lib/vehicleTypes";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import ClientSelector from "./ClientSelector";
import { useClients } from "./hooks/useClients";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewClientForm from "./NewClientForm";

interface AddressVehicleStepProps {
  form: UseFormReturn<MissionFormValues>;
  onNext: () => void;
  onPrevious: () => void;
}

const AddressVehicleStep = ({ form, onNext, onPrevious }: AddressVehicleStepProps) => {
  const { calculateDistance, isCalculating: isDistanceCalculating } = useDistanceCalculation();
  const { calculatePrice, isCalculating: isPriceCalculating, priceHT, priceTTC } = usePriceCalculation();
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculatingTotal, setIsCalculatingTotal] = useState<boolean>(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  const { 
    clients, 
    loading: clientsLoading, 
    newClient, 
    setNewClient, 
    createClient, 
    isSubmitting: isClientSubmitting 
  } = useClients(form);

  const pickupAddress = form.watch("pickup_address");
  const deliveryAddress = form.watch("delivery_address");
  const vehicleType = form.watch("vehicle_type");

  const isCalculating = isDistanceCalculating || isPriceCalculating || isCalculatingTotal;

  const handleAddClient = () => {
    setClientDialogOpen(true);
  };

  const handleCreateClient = async () => {
    const success = await createClient();
    if (success) {
      setClientDialogOpen(false);
    }
  };

  const calculateDistanceAndPrice = async () => {
    if (!pickupAddress || !deliveryAddress || !vehicleType) {
      return;
    }

    setIsCalculatingTotal(true);
    
    try {
      // Calculate distance
      const calculatedDistance = await calculateDistance(pickupAddress, deliveryAddress);
      setDistance(calculatedDistance);
      form.setValue("distance", `${calculatedDistance} km`);

      // Calculate price
      const priceResult = await calculatePrice(vehicleType, calculatedDistance);
      form.setValue("price_ht", priceResult.priceHT);
      form.setValue("price_ttc", priceResult.priceTTC);
    } catch (error) {
      console.error("Error calculating distance and price:", error);
    } finally {
      setIsCalculatingTotal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Adresses et type de véhicule</div>
      <p className="text-muted-foreground">
        Veuillez sélectionner un client et saisir les adresses de prise en charge et de livraison, ainsi que le type de véhicule
      </p>

      <ClientSelector 
        form={form} 
        clients={clients}
        loading={clientsLoading}
        onAddClient={handleAddClient}
      />

      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
          </DialogHeader>
          <NewClientForm 
            newClient={newClient}
            setNewClient={setNewClient}
            onSubmit={handleCreateClient}
            isSubmitting={isClientSubmitting}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="pickup_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse de prise en charge</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="123 rue de Paris, 75001 Paris" 
                    {...field} 
                    className="pl-8"
                  />
                </div>
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
              <FormLabel>Adresse de livraison</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="456 avenue des Champs-Élysées, 75008 Paris" 
                    {...field} 
                    className="pl-8"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de véhicule</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de véhicule" />
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

        <div className="md:col-span-2">
          <Button
            type="button"
            variant="outline"
            onClick={calculateDistanceAndPrice}
            disabled={!pickupAddress || !deliveryAddress || !vehicleType || isCalculating}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Calcul en cours...
              </>
            ) : distance ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Recalculer la distance et le prix
              </>
            ) : (
              "Calculer la distance et le prix"
            )}
          </Button>
        </div>
      </div>

      {distance && priceHT && priceTTC && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Distance</div>
                <div className="text-lg font-semibold">{distance} km</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Prix HT</div>
                <div className="text-lg font-semibold">{priceHT} €</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Prix TTC</div>
                <div className="text-lg font-semibold">{priceTTC} €</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          Précédent
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!distance}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default AddressVehicleStep;
