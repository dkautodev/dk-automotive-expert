
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MissionFormValues } from "./missionFormSchema";
import ClientSelector from "./ClientSelector";
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

const AddressVehicleStep = ({
  form,
  onNext,
  onPrevious
}: AddressVehicleStepProps) => {
  const {
    distance,
    priceHT,
    priceTTC,
    isCalculating,
    clients,
    clientsLoading,
    clientsError,
    calculateDistanceAndPrice,
    pickupAddress,
    deliveryAddress,
    vehicleType
  } = useAddressVehicleStep(form, onNext, onPrevious);

  return <div className="space-y-6">
      <div className="text-2xl font-semibold">Adresses et type de véhicule</div>
      <p className="text-red-600">Veuillez saisir les adresses de prise en charge et de livraison, ainsi que le type de véhicule. Utilisez les flèches ⬆️ ⬇️ pour ensuite sélectionner votre adresse finale. </p>

      <ClientStateDisplay isLoading={clientsLoading} error={clientsError} clientsCount={clients.length} />

      <ClientSelector form={form} clients={clients} loading={clientsLoading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressFields form={form} />
        <VehicleTypeSelector form={form} />

        <div className="md:col-span-2">
          <CalculateButton onClick={calculateDistanceAndPrice} isCalculating={isCalculating} distance={distance} disabled={!pickupAddress || !deliveryAddress || !vehicleType} />
        </div>
      </div>

      <DistancePriceCard distance={distance} priceHT={priceHT} priceTTC={priceTTC} />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Précédent
        </Button>
        <Button type="button" onClick={onNext} disabled={!distance}>
          Suivant
        </Button>
      </div>
    </div>;
};

export default AddressVehicleStep;
