
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MissionFormValues } from "./missionFormSchema";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import ClientSelector from "./ClientSelector";
import { useClients } from "./hooks/useClients";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewClientForm from "./NewClientForm";
import AddressFields from "./AddressFields";
import VehicleTypeSelector from "./VehicleTypeSelector";
import CalculateButton from "./CalculateButton";
import DistancePriceCard from "./DistancePriceCard";

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
    isLoading: clientsLoading, 
    newClient, 
    setNewClient, 
    createClient, 
    isSubmitting 
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
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressFields form={form} />
        <VehicleTypeSelector form={form} />

        <div className="md:col-span-2">
          <CalculateButton 
            onClick={calculateDistanceAndPrice}
            isCalculating={isCalculating}
            distance={distance}
            disabled={!pickupAddress || !deliveryAddress || !vehicleType}
          />
        </div>
      </div>

      <DistancePriceCard 
        distance={distance} 
        priceHT={priceHT} 
        priceTTC={priceTTC} 
      />

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
