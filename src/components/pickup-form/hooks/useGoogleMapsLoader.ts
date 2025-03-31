
import { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

export interface MapError {
  message: string;
  solution: string;
  errorType: 'credentials' | 'places' | 'oauth' | 'api' | 'unknown';
  errorCode?: string;
}

/**
 * Hook simplifié pour gérer le chargement de Google Maps
 */
export const useGoogleMapsLoader = () => {
  const [errorMessage] = useState<string | null>(null);
  const [detailedError] = useState<string | null>(null);
  
  // Configuration de base
  const isLoaded = false;
  const projectId = "project-id-placeholder";
  const loadError = new Error("Maps functionality has been disabled");

  console.log("Map functionality has been disabled");

  // Fonction utilitaire pour analyser les erreurs
  const parseGoogleMapsError = (): MapError => ({
    message: "La fonctionnalité de carte a été désactivée",
    solution: "La fonctionnalité de carte a été désactivée intentionnellement",
    errorType: 'unknown',
    errorCode: 'DISABLED'
  });

  return {
    isLoaded,
    loadError,
    errorMessage,
    projectId,
    parseGoogleMapsError,
    detailedError
  };
};
