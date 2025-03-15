
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const MapSection = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'] as any,
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-lg">
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div className="col-span-2 h-[300px] rounded-lg overflow-hidden">
      <GoogleMap
        zoom={5}
        center={{ lat: 46.603354, lng: 1.888334 }}
        mapContainerClassName="w-full h-full"
      />
    </div>
  );
};

export default MapSection;

