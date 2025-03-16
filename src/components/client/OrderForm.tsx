
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
    distance,
    duration,
    error,
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
        <ErrorDisplay error={error} />

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

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
