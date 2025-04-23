
import { useState, useEffect } from 'react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';

interface UseGoogleMapsApiOptions {
  libraries?: string[];
}

export const useGoogleMapsApi = (options: UseGoogleMapsApiOptions = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    const callbackName = `googleMapsCallback_${Math.random().toString(36).substring(7)}`;
    
    window[callbackName] = () => {
      setIsLoaded(true);
      delete window[callbackName];
    };

    const libraries = options.libraries || ['places'];
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries.join(',')}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (error) => {
      setLoadError(new Error('Failed to load Google Maps API'));
      console.error('Google Maps API loading error:', error);
    };

    document.head.appendChild(script);

    return () => {
      if (window[callbackName]) {
        delete window[callbackName];
      }
      script.remove();
    };
  }, [options.libraries]);

  return { isLoaded, loadError };
};

// Add this to the Window interface to avoid TypeScript errors
declare global {
  interface Window {
    [key: string]: any;
    google: typeof google;
  }
}
