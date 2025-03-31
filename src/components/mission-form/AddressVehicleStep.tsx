
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MissionFormValues } from "./missionFormSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ClientSelector from "./ClientSelector";
import NewClientForm from "./NewClientForm";
import AddressFields from "./AddressFields";
import VehicleTypeSelector from "./VehicleTypeSelector";
import CalculateButton from "./CalculateButton";
import DistancePriceCard from "./DistancePriceCard";
import ClientStateDisplay from "./ClientStateDisplay";
import { useAddressVehicleStep } from "./hooks/useAddressVehicleStep";

interface AddressVehicleStepProps {
  form: UseFormReturn<MissionFormValues>;
  onNext: () => void;
  onPrevious: () => void;
}

const AddressVehicleStep = ({ form, onNext, onPrevious }: AddressVehicleStepProps) => {
  const {
    distance,
    priceHT,
    priceTTC,
    isCalculating,
    clients,
    clientsLoading,
    clientsError,
    clientDialogOpen,
    setClientDialogOpen,
    newClient,
    setNewClient,
    isSubmitting,
    handleAddClient,
    handleCreateClient,
    calculateDistanceAndPrice,
    pickupAddress,
    deliveryAddress,
    vehicleType
  } = useAddressVehicleStep(form, onNext, onPrevious);

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Adresses et type de véhicule</div>
      <p className="text-muted-foreground">
        Veuillez sélectionner un client et saisir les adresses de prise en charge et de livraison, ainsi que le type de véhicule
      </p>

      <ClientStateDisplay 
        isLoading={clientsLoading} 
        error={clientsError} 
        clientsCount={clients.length}
      />

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
