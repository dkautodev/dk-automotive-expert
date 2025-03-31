
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
  const [mapError, setMapError] = useState<string | null>(null);

  // Récupérer la position de l'utilisateur si disponible
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userPos);
          setUserLocation(userPos);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  }, []);

  // Gérer les clics sur la carte
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const clickedPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setUserLocation(clickedPos);
    
    // Géocodage inverse
    if (window.google?.maps?.Geocoder && onAddressSelect) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: clickedPos }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          onAddressSelect(results[0].formatted_address);
        }
      });
    }
  };

  // Affichage conditionnel selon la configuration
  const renderMapContent = () => {
    if (!GOOGLE_MAPS_API_KEY) {
      return (
        <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
          <p className="text-gray-500 text-center">
            La clé API Google Maps n'est pas configurée.
            <br />
            Veuillez saisir l'adresse manuellement.
          </p>
        </div>
      );
    }

    if (mapError) {
      return (
        <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
          <p className="text-gray-500 text-center">
            Impossible de charger la carte Google Maps.
            <br />
            Vous pouvez toujours saisir l'adresse manuellement.
          </p>
        </div>
      );
    }

    return (
      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onError={(error) => setMapError(error.message)}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onClick={handleMapClick}
        >
          {userLocation && <Marker position={userLocation} />}
        </GoogleMap>
      </LoadScript>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Emplacement</h3>
      </div>
      {renderMapContent()}
    </Card>
  );
};

export default MapSection;
