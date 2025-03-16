
import { useState, useCallback, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { toast } from '@/components/ui/use-toast';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

interface MapError {
  message: string;
  solution: string;
  details?: string;
}

const libraries: ("places")[] = ["places"];

export const useGoogleMaps = () => {
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorSolution, setErrorSolution] = useState<string | null>(null);

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
      projectId: "vigilant-shell-453812-d7",
    });

    if (loadError) {
      console.error("Erreur détaillée de chargement:", {
        message: loadError.message,
        name: loadError.name,
        stack: loadError.stack,
      });

      const errorInfo = parseGoogleMapsError(loadError);
      
      setError(errorInfo.message);
      setErrorSolution(errorInfo.solution);
      
      toast({
        variant: "destructive",
        title: "Erreur Google Maps",
        description: errorInfo.message
      });
    }
  }, [isLoaded, loadError]);

  // Parse les erreurs Google Maps pour fournir des messages et solutions détaillés
  const parseGoogleMapsError = (error: Error): MapError => {
    if (error.message?.includes('ApiNotActivatedMapError')) {
      return {
        message: "L'API Google Maps Places n'est pas activée pour ce projet.",
        solution: "Activez l'API Places et l'API Directions dans la console Google Cloud pour le projet 'vigilant-shell-453812-d7'.",
        details: "API Places non activée"
      };
    } else if (error.message?.includes('InvalidKeyMapError')) {
      return {
        message: "La clé API Google Maps n'est pas valide ou est restreinte.",
        solution: "Vérifiez que votre clé API est correcte et configurée pour autoriser le domaine actuel dans la console Google Cloud.",
        details: "Clé API invalide"
      };
    } else if (error.message?.includes('RefererNotAllowedMapError')) {
      return {
        message: "Le domaine actuel n'est pas autorisé à utiliser cette clé API Google Maps.",
        solution: "Ajoutez ce domaine aux restrictions de la clé API dans la console Google Cloud pour le projet 'vigilant-shell-453812-d7'.",
        details: "Domaine non autorisé"
      };
    } else if (error.message?.includes('QuotaExceededMapError')) {
      return {
        message: "Le quota d'utilisation de l'API Google Maps a été dépassé.",
        solution: "Augmentez votre quota ou attendez que celui-ci soit réinitialisé. Vous pouvez aussi créer un compte de facturation dans Google Cloud.",
        details: "Quota dépassé"
      };
    } else {
      return {
        message: "Erreur lors du chargement de Google Maps.",
        solution: "Vérifiez votre connexion internet ou réessayez plus tard.",
        details: "Erreur inconnue"
      };
    }
  };

  const calculateDistance = useCallback(async (origin: string, destination: string) => {
    if (!isLoaded) {
      console.log("Google Maps n'est pas encore chargé");
      setError("Service temporairement indisponible");
      setErrorSolution("Veuillez attendre le chargement complet de la page ou rafraîchir si nécessaire.");
      return;
    }

    if (!origin || !destination) {
      console.log("Adresse de départ ou d'arrivée manquante");
      setError("Les adresses de départ et d'arrivée sont requises");
      setErrorSolution("Veuillez saisir à la fois l'adresse de départ et l'adresse de livraison.");
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
        setError("Aucun itinéraire trouvé entre ces adresses");
        setErrorSolution("Essayez de préciser davantage les adresses ou vérifiez qu'il existe un itinéraire routier entre ces deux points.");
        setDistance("");
        setDuration("");
        return;
      }

      console.log("Distance calculée:", leg.distance.text);
      console.log("Durée calculée:", leg.duration.text);
      
      setDistance(leg.distance.text);
      setDuration(leg.duration.text);
      setError(null);
      setErrorSolution(null);
      
    } catch (error: any) {
      console.error("Erreur lors du calcul de la distance:", error);
      
      let errorMessage = "Impossible de calculer l'itinéraire.";
      let errorSolution = "Veuillez réessayer avec des adresses plus précises.";
      
      if (error.message?.includes('NOT_FOUND')) {
        errorMessage = "Adresse introuvable.";
        errorSolution = "Assurez-vous que les adresses saisies existent et sont correctement orthographiées.";
      } else if (error.message?.includes('ZERO_RESULTS')) {
        errorMessage = "Aucun itinéraire trouvé entre ces adresses.";
        errorSolution = "Il n'y a peut-être pas de route directe entre ces points ou la distance pourrait être trop importante.";
      } else if (error.message?.includes('OVER_QUERY_LIMIT')) {
        errorMessage = "Limite de requêtes dépassée pour l'API Google Maps.";
        errorSolution = "Réessayez plus tard ou contactez l'administrateur pour augmenter le quota.";
      }

      toast({
        variant: "destructive",
        title: "Erreur de calcul",
        description: errorMessage
      });
      
      setError(errorMessage);
      setErrorSolution(errorSolution);
      setDistance("");
      setDuration("");
    }
  }, [isLoaded]);

  // Méthode pour obtenir une solution personnalisée en fonction de l'erreur
  const getErrorMessage = () => {
    if (loadError) {
      const errorInfo = parseGoogleMapsError(loadError);
      return errorInfo.message;
    }
    return error;
  };

  const getErrorSolution = () => {
    if (loadError) {
      const errorInfo = parseGoogleMapsError(loadError);
      return errorInfo.solution;
    }
    return errorSolution;
  };

  return { 
    isLoaded, 
    loadError, 
    calculateDistance, 
    distance, 
    duration, 
    error: getErrorMessage(), 
    errorSolution: getErrorSolution()
  };
};
