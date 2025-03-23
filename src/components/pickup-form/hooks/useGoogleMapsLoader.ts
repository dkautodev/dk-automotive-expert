
import { useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

export interface MapError {
  message: string;
  solution: string;
  errorType: 'credentials' | 'places' | 'oauth' | 'api' | 'unknown';
  errorCode?: string;
}

/**
 * A simplified Google Maps loader hook that doesn't actually load Google Maps
 */
export const useGoogleMapsLoader = () => {
  const [errorMessage] = useState<string | null>(null);
  const projectId = "project-id-placeholder";
  const [detailedError] = useState<string | null>(null);

  const isLoaded = false;
  const loadError = new Error("Maps functionality has been disabled");

  console.log("Map functionality has been disabled");

  const parseGoogleMapsError = (error: Error): MapError => {
    return {
      message: "La fonctionnalité de carte a été désactivée",
      solution: "La fonctionnalité de carte a été désactivée intentionnellement",
      errorType: 'unknown',
      errorCode: 'DISABLED'
    };
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
