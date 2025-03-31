
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapSectionProps {
  onAddressSelect?: (address: string) => void;
}

const containerStyle = {
  width: '100%',
  height: '200px'
};

const defaultCenter = {
  lat: 48.866667, // Paris
  lng: 2.333333
};

const MapSection = ({ onAddressSelect }: MapSectionProps) => {
  const [center, setCenter] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Position de l'utilisateur obtenue:", userPos);
          setCenter(userPos);
          setUserLocation(userPos);
        },
        (error) => {
          console.error("Erreur lors de l'obtention de la position de l'utilisateur:", error);
        }
      );
    }
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const clickedPos = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      };
      setUserLocation(clickedPos);
      
      // Reverse geocode to get address from coordinates
      if (window.google?.maps?.Geocoder) {
        try {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: clickedPos }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              console.log("Adresse trouvée à partir des coordonnées:", address);
              if (onAddressSelect) {
                onAddressSelect(address);
              }
            }
          });
        } catch (error) {
          console.error("Erreur de géocodage:", error);
        }
      }
    }
  };

  const handleMapLoad = () => {
    console.log("Carte Google Maps chargée avec succès");
    setMapLoaded(true);
  };

  const handleMapError = (error: Error) => {
    console.error("Erreur lors du chargement de la carte Google Maps:", error);
    setMapError(error.message);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Emplacement</h3>
      </div>
      
      {GOOGLE_MAPS_API_KEY ? (
        mapError ? (
          <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
            <p className="text-gray-500 text-center">
              Impossible de charger la carte Google Maps.
              <br />
              Vous pouvez toujours saisir l'adresse manuellement.
            </p>
          </div>
        ) : (
          <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            onError={handleMapError}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onClick={handleMapClick}
              onLoad={handleMapLoad}
            >
              {userLocation && <Marker position={userLocation} />}
            </GoogleMap>
          </LoadScript>
        )
      ) : (
        <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
          <p className="text-gray-500 text-center">
            La clé API Google Maps n'est pas configurée.
            <br />
            Veuillez saisir l'adresse manuellement.
          </p>
        </div>
      )}
    </Card>
  );
};

export default MapSection;
