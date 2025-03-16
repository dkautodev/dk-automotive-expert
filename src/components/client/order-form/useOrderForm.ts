
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

export const useOrderForm = () => {
  const navigate = useNavigate();
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [deliveryAutocomplete, setDeliveryAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError, calculateDistance, distance, duration, error } = useGoogleMaps();

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

  // Détermine si on peut utiliser l'autocomplétion Google
  const useAutocomplete = !loadError?.message?.includes('ApiNotActivatedMapError');

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

  return {
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
    distance,
    duration,
    error: loadError || error ? getErrorMessage() : null,
    useAutocomplete,
    handleSubmit
  };
};
