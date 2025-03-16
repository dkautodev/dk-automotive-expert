
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { AddressInputs } from "./order-form/AddressInputs";
import { VehicleSelector } from "./order-form/VehicleSelector";
import { ErrorDisplay } from "./order-form/ErrorDisplay";
import { DistanceDisplay } from "./order-form/DistanceDisplay";
import { useOrderForm } from "./order-form/useOrderForm";
import { vehicleTypes } from "./order-form/vehicleTypesData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DomainOriginHelper } from "./order-form/DomainOriginHelper";

const OrderForm = () => {
  const {
    pickupAddress,
    setPickupAddress,
    deliveryAddress,
    setDeliveryAddress,
    selectedVehicle,
    setSelectedVehicle,
    pickupAutocomplete,
    deliveryAutocomplete,
    onPickupLoad,
    onDeliveryLoad,
    handlePickupPlaceChanged,
    handleDeliveryPlaceChanged,
    isLoaded,
    loadError,
    loadErrorMessage,
    distance,
    duration,
    error,
    errorSolution,
    projectId,
    useAutocomplete,
    handleSubmit
  } = useOrderForm();

  if (!isLoaded) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <Loader className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          Demandez votre course
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {projectId && <DomainOriginHelper projectId={projectId} error={loadErrorMessage} />}
        
        <ErrorDisplay error={error} solution={errorSolution} projectId={projectId} />

        <div className="space-y-4">
          <AddressInputs
            pickupAddress={pickupAddress}
            deliveryAddress={deliveryAddress}
            setPickupAddress={setPickupAddress}
            setDeliveryAddress={setDeliveryAddress}
            pickupAutocomplete={pickupAutocomplete}
            deliveryAutocomplete={deliveryAutocomplete}
            onPickupLoad={onPickupLoad}
            onDeliveryLoad={onDeliveryLoad}
            handlePickupPlaceChanged={handlePickupPlaceChanged}
            handleDeliveryPlaceChanged={handleDeliveryPlaceChanged}
            useAutocomplete={useAutocomplete}
          />

          <DistanceDisplay distance={distance} duration={duration} />

          <VehicleSelector
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
            vehicleTypes={vehicleTypes}
          />
        </div>

        <div className="flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Besoin d'aide?</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Aide pour la commande</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium">Problèmes de carte Google Maps</h3>
                  <p className="text-muted-foreground mt-1">
                    Si vous rencontrez des problèmes avec la carte ou l'autocomplétion d'adresses, 
                    vous pouvez saisir manuellement les adresses complètes.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Adresses non trouvées</h3>
                  <p className="text-muted-foreground mt-1">
                    Assurez-vous d'inclure le numéro, la rue, le code postal et la ville pour
                    que le système puisse calculer correctement l'itinéraire.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Calcul de distance</h3>
                  <p className="text-muted-foreground mt-1">
                    Le calcul de distance et de durée utilise l'API Google Maps pour fournir des estimations.
                    Ces valeurs sont indicatives et peuvent varier en fonction des conditions réelles.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleSubmit}>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
