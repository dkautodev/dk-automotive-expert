
import { useState, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { toast } from '@/components/ui/use-toast';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

const libraries: ("places")[] = ["places"];

export const useGoogleMaps = () => {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Si l'API n'est pas chargée correctement, on affiche un toast d'erreur
  if (loadError) {
    console.error("Google Maps load error:", loadError);
    toast({
      variant: "destructive",
      title: "Erreur Google Maps",
      description: "Erreur lors du chargement de Google Maps. Veuillez réessayer plus tard."
    });
  }

  const calculateDistance = useCallback(async (origin: string, destination: string) => {
    if (!isLoaded) {
      console.log("Google Maps n'est pas encore chargé");
      setError("Service temporairement indisponible");
      return;
    }

    if (!origin || !destination) {
      console.log("Adresse de départ ou d'arrivée manquante");
      setError("Les adresses sont requises");
      setDistance("");
      setDuration("");
      return;
    }

    console.log("Calcul de la distance entre:", origin, destination);
    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      console.log("Résultat des directions:", result);

      if (!result.routes?.length) {
        console.log("Aucun itinéraire trouvé");
        setError("Aucun itinéraire trouvé");
        setDistance("");
        setDuration("");
        return;
      }

      const leg = result.routes[0].legs?.[0];
      if (!leg) {
        console.log("Détails de l'itinéraire non disponibles");
        setError("Détails de l'itinéraire non disponibles");
        setDistance("");
        setDuration("");
        return;
      }

      if (leg.distance && leg.duration) {
        console.log("Distance:", leg.distance.text);
        console.log("Durée:", leg.duration.text);
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
        setError(null);
      }
    } catch (error) {
      console.error("Erreur lors du calcul de la distance:", error);
      toast({
        variant: "destructive",
        title: "Erreur de calcul",
        description: "Impossible de calculer l'itinéraire. Veuillez vérifier les adresses."
      });
      setError("Erreur lors du calcul de la distance");
      setDistance("");
      setDuration("");
    }
  }, [isLoaded]);

  return { isLoaded, loadError, calculateDistance, distance, duration, error };
};
