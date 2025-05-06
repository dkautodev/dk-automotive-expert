
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';

interface MissionRouteMapProps {
  originAddress: string;
  destinationAddress: string;
  className?: string;
  height?: string;
}

export const MissionRouteMap: React.FC<MissionRouteMapProps> = ({
  originAddress,
  destinationAddress,
  className = "",
  height = "400px"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { isLoaded, loadError } = useGoogleMapsApi({ libraries: ['places', 'routes'] });
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !originAddress || !destinationAddress) return;
    
    try {
      // Initialize the map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 46.603354, lng: 1.888334 }, // Center of France
        zoom: 5,
        mapTypeControl: false,
      });
      
      setMapInstance(map);
      
      // Initialize the directions service
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#18257D', // DK Automotive blue
          strokeWeight: 5,
          strokeOpacity: 0.7
        }
      });
      
      // Request directions
      directionsService.route(
        {
          origin: originAddress,
          destination: destinationAddress,
          travelMode: google.maps.TravelMode.DRIVING,
          region: 'fr'
        },
        (response, status) => {
          if (status === 'OK' && response) {
            directionsRenderer.setDirections(response);
            
            // Get distance and duration
            const route = response.routes[0];
            if (route && route.legs.length > 0) {
              setDistance(route.legs[0].distance?.text || null);
              setDuration(route.legs[0].duration?.text || null);
              
              // Fit bounds to show entire route
              if (map) {
                const bounds = new google.maps.LatLngBounds();
                route.legs.forEach((leg) => {
                  leg.steps.forEach((step) => {
                    step.path.forEach((path) => {
                      bounds.extend(path);
                    });
                  });
                });
                map.fitBounds(bounds);
              }
            }
          } else {
            toast.error(`Erreur lors du calcul de l'itinéraire: ${status}`);
          }
        }
      );
      
      return () => {
        directionsRenderer.setMap(null);
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
      toast.error('Erreur lors de l\'initialisation de la carte');
    }
  }, [isLoaded, originAddress, destinationAddress]);

  if (loadError) {
    return (
      <div className={`bg-muted rounded-md flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center p-4">
          <p className="text-destructive mb-2">Erreur de chargement Google Maps</p>
          <p className="text-sm text-muted-foreground">Veuillez vérifier votre connexion et rafraîchir la page</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-muted rounded-md flex items-center justify-center ${className}`} style={{ height }}>
        <Loader className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        ref={mapRef} 
        className={`rounded-md border ${className}`} 
        style={{ height }}
      />
      {(distance || duration) && (
        <div className="flex gap-4 text-sm">
          {distance && (
            <div>
              <span className="font-semibold">Distance:</span> {distance}
            </div>
          )}
          {duration && (
            <div>
              <span className="font-semibold">Durée estimée:</span> {duration}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MissionRouteMap;
