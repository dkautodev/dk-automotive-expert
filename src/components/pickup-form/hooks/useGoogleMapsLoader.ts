
import { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';

export interface MapError {
  message: string;
  solution: string;
  errorType: 'credentials' | 'places' | 'oauth' | 'api' | 'unknown';
  errorCode?: string;
}

export const useGoogleMapsLoader = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const projectId = "vigilant-shell-453812-d7";
  const [detailedError, setDetailedError] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    console.log("Map load status:", { 
      isLoaded, 
      loadError, 
      apiKey: GOOGLE_MAPS_API_KEY.substring(0, 5) + "...", 
      keyLength: GOOGLE_MAPS_API_KEY.length,
      projectId,
      domain: window.location.origin
    });
    
    if (loadError) {
      console.error("Google Maps load error:", {
        message: loadError.message,
        stack: loadError.stack,
        name: loadError.name,
        toString: loadError.toString()
      });
      setDetailedError(loadError.toString());
    }
  }, [isLoaded, loadError]);

  useEffect(() => {
    if (loadError) {
      const { message, solution, errorType } = parseGoogleMapsError(loadError);
      setErrorMessage(message);
      
      toast({
        variant: "destructive",
        title: "Google Maps Error",
        description: message
      });
    }
  }, [loadError]);

  const parseGoogleMapsError = (error: Error): MapError => {
    const errorString = error.toString();
    
    // Log raw error details for debugging
    console.log("Raw Google Maps error details:", {
      errorString,
      message: error.message,
      stack: error.stack
    });
    
    if (errorString.includes('ApiTargetBlockedMapError') || error.message?.includes('ApiTargetBlockedMapError')) {
      return {
        message: `L'API Google Maps Places est bloquée pour votre projet '${projectId}'. Vous devez activer l'API Places dans la console Google Cloud.`,
        solution: "Activez l'API Places et l'API JavaScript Maps dans la console Google Cloud.",
        errorType: 'places',
        errorCode: 'ApiTargetBlockedMapError'
      };
    } else if (error.message?.includes('ApiNotActivatedMapError')) {
      return {
        message: `L'API Google Maps Places n'est pas activée pour le projet '${projectId}'.`,
        solution: "Activez l'API Places et l'API JavaScript Maps dans la console Google Cloud.",
        errorType: 'places',
        errorCode: 'ApiNotActivatedMapError'
      };
    } else if (error.message?.includes('InvalidKeyMapError')) {
      return {
        message: `La clé API Google Maps n'est pas valide ou n'est pas associée au projet '${projectId}'.`,
        solution: "Vérifiez que votre clé API est correcte et associée au bon projet.",
        errorType: 'credentials',
        errorCode: 'InvalidKeyMapError'
      };
    } else if (error.message?.includes('RefererNotAllowedMapError')) {
      return {
        message: `Le domaine actuel (${window.location.origin}) n'est pas autorisé pour cette clé API. Vérifiez les restrictions de votre projet '${projectId}'.`,
        solution: `Ajoutez "${window.location.origin}" aux origines JavaScript autorisées dans les paramètres OAuth.`,
        errorType: 'oauth',
        errorCode: 'RefererNotAllowedMapError'
      };
    } else {
      return {
        message: "Erreur de chargement de Google Maps",
        solution: "Vérifiez votre connexion internet et réessayez.",
        errorType: 'unknown',
        errorCode: error.message
      };
    }
  };

  return {
    isLoaded,
    loadError,
    errorMessage,
    projectId,
    parseGoogleMapsError,
    detailedError
  };
};
