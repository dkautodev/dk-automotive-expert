
import { useState, useCallback, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { toast } from '@/components/ui/use-toast';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

const libraries: ("places")[] = ["places"];

export const useGoogleMaps = () => {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Chargement de l'API avec plus de logging détaillé
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    // Log détaillé de l'état et des erreurs potentielles
    console.log("Détails du chargement de l'API Google Maps:", {
      isLoaded,
      loadError,
      apiKey: GOOGLE_MAPS_API_KEY,
      keyLength: GOOGLE_MAPS_API_KEY.length,
      projectId: "vigilant-shell-453812-d7", // ID du projet ajouté
    });

    if (loadError) {
      console.error("Erreur détaillée de chargement:", {
        message: loadError.message,
        name: loadError.name,
        stack: loadError.stack,
      });

      // Message plus détaillé pour aider au diagnostic
      let errorDescription = "Erreur lors du chargement de Google Maps";
      
      // Gestion spécifique des erreurs de clé API
      if (loadError.message?.includes('InvalidKeyMapError')) {
        errorDescription = "La clé API Google Maps n'est pas valide. Vérifiez que la clé est correcte et associée au projet 'vigilant-shell-453812-d7'.";
        
        toast({
          variant: "destructive",
          title: "Erreur de configuration",
          description: errorDescription
        });
      } else if (loadError.message?.includes('ApiNotActivatedMapError')) {
        errorDescription = "L'API Google Maps Places n'est pas activée pour le projet 'vigilant-shell-453812-d7'. Activez-la dans la console Google Cloud.";
        
        toast({
          variant: "destructive",
          title: "API non activée",
          description: errorDescription
        });
      } else if (loadError.message?.includes('RefererNotAllowedMapError')) {
        errorDescription = "Le domaine actuel n'est pas autorisé à utiliser cette clé API. Ajoutez-le aux restrictions du projet 'vigilant-shell-453812-d7'.";
        
        toast({
          variant: "destructive",
          title: "Domaine non autorisé",
          description: errorDescription
        });
      }
      
      setError(errorDescription);
    }
  }, [isLoaded, loadError]);

  // Gestion spécifique de l'erreur d'API non activée
  if (loadError?.message?.includes('ApiNotActivatedMapError')) {
    console.error("Google Maps API non activée:", loadError);
    
    // Retourner des valeurs par défaut pour ne pas bloquer l'application
    return { 
      isLoaded: false, 
      loadError, 
      calculateDistance: () => {}, 
      distance: "", 
      duration: "", 
      error: "API Places non activée pour le projet vigilant-shell-453812-d7" 
    };
  }

  // Autres erreurs de chargement
  if (loadError) {
    console.error("Erreur de chargement Google Maps:", loadError);
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
