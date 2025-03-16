
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete } from "@react-google-maps/api";
import { Car, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const navigate = useNavigate();
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [deliveryAutocomplete, setDeliveryAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError, calculateDistance, distance, duration, error } = useGoogleMaps();

  // Message d'erreur spécifique pour informer l'utilisateur du problème d'API
  const getErrorMessage = () => {
    if (loadError?.message?.includes('ApiNotActivatedMapError')) {
      return "L'API Google Maps Places n'est pas activée. Veuillez contacter l'administrateur pour activer cette API.";
    }
    if (loadError?.message?.includes('InvalidKeyMapError')) {
      return "La clé API Google Maps n'est pas valide. Veuillez contacter l'administrateur pour vérifier la configuration.";
    }
    if (error) {
      return error;
    }
    return "Une erreur est survenue avec le service Google Maps.";
  };

  useEffect(() => {
    if (pickupAddress && deliveryAddress) {
      calculateDistance(pickupAddress, deliveryAddress);
    }
  }, [pickupAddress, deliveryAddress, calculateDistance]);

  const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setPickupAutocomplete(autocomplete);
  };

  const onDeliveryLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setDeliveryAutocomplete(autocomplete);
  };

  const handlePickupPlaceChanged = () => {
    if (pickupAutocomplete) {
      try {
        const place = pickupAutocomplete.getPlace();
        if (place.formatted_address) {
          setPickupAddress(place.formatted_address);
        }
      } catch (error) {
        console.error("Erreur lors de la sélection du lieu de départ:", error);
      }
    }
  };

  const handleDeliveryPlaceChanged = () => {
    if (deliveryAutocomplete) {
      try {
        const place = deliveryAutocomplete.getPlace();
        if (place.formatted_address) {
          setDeliveryAddress(place.formatted_address);
        }
      } catch (error) {
        console.error("Erreur lors de la sélection du lieu d'arrivée:", error);
      }
    }
  };

  const handleSubmit = () => {
    if (!pickupAddress || !deliveryAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir les adresses de départ et d'arrivée",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVehicle) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de véhicule",
        variant: "destructive"
      });
      return;
    }

    navigate("/dashboard/client/order-details", {
      state: {
        pickupAddress,
        deliveryAddress,
        selectedVehicle,
      }
    });
  };

  const renderAddressInputs = () => {
    // Si l'API n'est pas activée, afficher les champs de saisie simple
    if (loadError?.message?.includes('ApiNotActivatedMapError')) {
      return (
        <>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Adresse de départ
            </label>
            <Input
              placeholder="Entrez l'adresse de départ"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Adresse de livraison
            </label>
            <Input
              placeholder="Entrez l'adresse de livraison"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>
        </>
      );
    }

    // Sinon afficher l'autocomplétion
    return (
      <>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Adresse de départ
          </label>
          <Autocomplete
            onLoad={onPickupLoad}
            onPlaceChanged={handlePickupPlaceChanged}
            options={{ 
              componentRestrictions: { country: 'fr' },
              types: ['address'],
              fields: ['formatted_address', 'geometry']
            }}
          >
            <Input
              placeholder="Entrez l'adresse de départ"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
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
            options={{ 
              componentRestrictions: { country: 'fr' },
              types: ['address'],
              fields: ['formatted_address', 'geometry']
            }}
          >
            <Input
              placeholder="Entrez l'adresse de livraison"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </Autocomplete>
        </div>
      </>
    );
  };

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
        {loadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {getErrorMessage()}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {renderAddressInputs()}

          {distance && duration && (
            <div className="text-sm text-gray-600">
              Distance: {distance} - Durée estimée: {duration}
            </div>
          )}

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
          <Button onClick={handleSubmit}>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
