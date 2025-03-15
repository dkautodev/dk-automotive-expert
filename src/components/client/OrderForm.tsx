
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GOOGLE_MAPS_API_KEY } from "@/lib/constants";
import { Loader } from "@/components/ui/loader";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Car } from "lucide-react";

const libraries: ("places")[] = ["places"];

const vehicleTypes = [
  { id: "citadine", name: "Citadine" },
  { id: "berline", name: "Berline" },
  { id: "suv", name: "4x4 (ou SUV)" },
  { id: "utilitaire-3-5", name: "Utilitaire 3-5m3" },
  { id: "utilitaire-6-12", name: "Utilitaire 6-12m3" },
  { id: "utilitaire-12-15", name: "Utilitaire 12-15m3" },
  { id: "utilitaire-15-20", name: "Utilitaire 15-20m3" },
  { id: "utilitaire-20-plus", name: "Utilitaire + de 20m3" },
];

const OrderForm = () => {
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [deliveryAutocomplete, setDeliveryAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onDeliveryLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDeliveryAutocomplete(autocomplete);
  };

  const handlePickupPlaceChanged = () => {
    if (pickupAutocomplete) {
      const place = pickupAutocomplete.getPlace();
      if (place.formatted_address) {
        setPickupAddress(place.formatted_address);
      }
    }
  };

  const handleDeliveryPlaceChanged = () => {
    if (deliveryAutocomplete) {
      const place = deliveryAutocomplete.getPlace();
      if (place.formatted_address) {
        setDeliveryAddress(place.formatted_address);
      }
    }
  };

  if (!isLoaded) {
    return <Loader />;
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
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Adresse de départ
            </label>
            <Autocomplete
              onLoad={onPickupLoad}
              onPlaceChanged={handlePickupPlaceChanged}
            >
              <Input
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Entrez l'adresse de départ"
              />
            </Autocomplete>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Adresse de livraison
            </label>
            <Autocomplete
              onLoad={onDeliveryLoad}
              onPlaceChanged={handleDeliveryPlaceChanged}
            >
              <Input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Entrez l'adresse de livraison"
              />
            </Autocomplete>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Type de véhicule
            </label>
            <Select
              value={selectedVehicle}
              onValueChange={setSelectedVehicle}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
