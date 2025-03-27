
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

  useEffect(() => {
    // Try to get user's current location
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
          console.error("Error getting user location:", error);
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
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: clickedPos }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          if (onAddressSelect) {
            onAddressSelect(address);
          }
        }
      });
    }
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Emplacement</h3>
      </div>
      
      {GOOGLE_MAPS_API_KEY ? (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
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
      ) : (
        <div className="flex items-center justify-center h-[200px] bg-gray-100 rounded-md">
          <p className="text-gray-500 text-center">
            La clé API Google Maps n'est pas configurée.
            <br />
            Veuillez vérifier votre configuration.
          </p>
        </div>
      )}
    </Card>
  );
};

export default MapSection;
