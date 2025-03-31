
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MissionFormValues } from "./missionFormSchema";
import { useDistanceCalculation } from "@/hooks/useDistanceCalculation";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import ClientSelector from "./ClientSelector";
import { useClients } from "./hooks/useClients";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
    fetchClients,
    newClient, 
    setNewClient, 
    createClient, 
    isSubmitting,
    error: clientsError
  } = useClients(form);

  const pickupAddress = form.watch("pickup_address");
  const deliveryAddress = form.watch("delivery_address");
  const vehicleType = form.watch("vehicle_type");

  const isCalculating = isDistanceCalculating || isPriceCalculating || isCalculatingTotal;

  // Si erreur de chargement des clients, forcer une nouvelle tentative
  useEffect(() => {
    if (clientsError) {
      console.warn("Erreur chargement clients, nouvelle tentative:", clientsError);
      const timer = setTimeout(() => {
        fetchClients();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clientsError, fetchClients]);

  // Debug logging
  useEffect(() => {
    console.log("État actuel des clients:", clients);
    console.log("Chargement clients:", clientsLoading);
    console.log("Erreur clients:", clientsError);
  }, [clients, clientsLoading, clientsError]);

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
      form.setValue("distance", calculatedDistance);

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

      {clientsLoading && (
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Chargement des clients en cours...
          </AlertDescription>
        </Alert>
      )}

      {clientsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erreur lors du chargement des clients. Veuillez réessayer ou ajouter un nouveau client.
          </AlertDescription>
        </Alert>
      )}

      {!clientsLoading && clients.length === 0 && !clientsError && (
        <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Aucun client n'a été trouvé dans la base de données. Veuillez en ajouter un en utilisant le bouton +.
          </AlertDescription>
        </Alert>
      )}

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
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour créer un nouveau client
            </DialogDescription>
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
