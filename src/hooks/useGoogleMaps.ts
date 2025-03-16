
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

  // Gestion spécifique de l'erreur d'API non activée
  if (loadError?.message?.includes('ApiNotActivatedMapError')) {
    console.error("Google Maps API not activated:", loadError);
    toast({
      variant: "destructive",
      title: "Configuration Google Maps incorrecte",
      description: "Certaines APIs Google Maps ne sont pas activées. Veuillez contacter l'administrateur."
    });
    return { isLoaded: false, loadError, calculateDistance: () => {}, distance: "", duration: "", error: "Configuration API incorrecte" };
  }

  // Autres erreurs de chargement
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
    
    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      console.log("Résultat des directions:", result);

      const leg = result.routes?.[0]?.legs?.[0];
      if (!leg?.distance || !leg?.duration) {
        console.log("Aucun itinéraire trouvé ou détails manquants");
        setError("Aucun itinéraire trouvé");
        setDistance("");
        setDuration("");
        return;
      }

      console.log("Distance:", leg.distance.text);
      console.log("Durée:", leg.duration.text);
      setDistance(leg.distance.text);
      setDuration(leg.duration.text);
      setError(null);
      
    } catch (error: any) {
      console.error("Erreur lors du calcul de la distance:", error);
      
      // Message d'erreur plus spécifique basé sur le type d'erreur
      const errorMessage = error.message?.includes('NOT_FOUND') 
        ? "Adresse introuvable. Veuillez vérifier les adresses saisies."
        : "Impossible de calculer l'itinéraire. Veuillez réessayer.";

      toast({
        variant: "destructive",
        title: "Erreur de calcul",
        description: errorMessage
      });
      
      setError("Erreur lors du calcul de la distance");
      setDistance("");
      setDuration("");
    }
  }, [isLoaded]);

  return { isLoaded, loadError, calculateDistance, distance, duration, error };
};
