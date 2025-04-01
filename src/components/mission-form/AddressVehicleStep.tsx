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
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Importer le composant Textarea

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
    vehicleType,
    additionalInfo
  } = useAddressVehicleStep(form, onNext, onPrevious);
  return <div className="space-y-6">
      <div className="text-2xl font-semibold">Adresses et type de véhicule</div>
      <p className="text-muted-foreground">Veuillez saisir les adresses de prise en charge et de livraison, ainsi que le type de véhicule. Utilisez les flèches ⬆️ ⬇️ pour ensuite sélectionner votre adresse finale. </p>

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
      
      {/* Ajout du champ compléments d'information */}
      <FormField control={form.control} name="additional_info" render={({
      field
    }) => <FormItem>
            <FormLabel>Compléments d'information</FormLabel>
            <FormControl>
              <Textarea placeholder="Informations supplémentaires (max 250 caractères)" className="resize-none" maxLength={250} {...field} />
            </FormControl>
          </FormItem>} />

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