
import { useState, useCallback, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { toast } from '@/components/ui/use-toast';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

const libraries: ("places")[] = ["places"];

export const useGoogleMaps = () => {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Chargement de l'API avec plus de logging
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    console.log("État du chargement de l'API:", { isLoaded, loadError });
  }, [isLoaded, loadError]);

  // Gestion spécifique de l'erreur d'API non activée
  if (loadError?.message?.includes('ApiNotActivatedMapError')) {
    console.error("Google Maps API non activée:", loadError);
    toast({
      variant: "destructive",
      title: "Configuration Google Maps incorrecte",
      description: "API Google Maps non activée. Veuillez contacter l'administrateur."
    });
    return { 
      isLoaded: false, 
      loadError, 
      calculateDistance: () => {}, 
      distance: "", 
      duration: "", 
      error: "API non activée" 
    };
  }

  // Autres erreurs de chargement
  if (loadError) {
    console.error("Erreur de chargement Google Maps:", loadError);
    toast({
      variant: "destructive",
      title: "Erreur Google Maps",
      description: "Erreur lors du chargement de Google Maps. Veuillez réessayer."
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

    try {
      console.log("Tentative de calcul d'itinéraire entre:", origin, destination);
      
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      console.log("Résultat du calcul d'itinéraire:", result);

      const leg = result.routes?.[0]?.legs?.[0];
      if (!leg?.distance || !leg?.duration) {
        console.log("Aucun itinéraire trouvé ou détails manquants");
        setError("Aucun itinéraire trouvé");
        setDistance("");
        setDuration("");
        return;
      }

      console.log("Distance calculée:", leg.distance.text);
      console.log("Durée calculée:", leg.duration.text);
      
      setDistance(leg.distance.text);
      setDuration(leg.duration.text);
      setError(null);
      
    } catch (error: any) {
      console.error("Erreur lors du calcul de la distance:", error);
      
      const errorMessage = error.message?.includes('NOT_FOUND') 
        ? "Adresse introuvable. Veuillez vérifier les adresses saisies."
        : "Impossible de calculer l'itinéraire. Veuillez réessayer.";

      toast({
        variant: "destructive",
        title: "Erreur de calcul",
        description: errorMessage
      });
      
      setError(errorMessage);
      setDistance("");
      setDuration("");
    }
  }, [isLoaded]);

  return { isLoaded, loadError, calculateDistance, distance, duration, error };
};

