
import { Input } from "@/components/ui/input";
import { Autocomplete } from "@react-google-maps/api";

interface AddressInputsProps {
  pickupAddress: string;
  deliveryAddress: string;
  setPickupAddress: (address: string) => void;
  setDeliveryAddress: (address: string) => void;
  pickupAutocomplete: google.maps.places.Autocomplete | null;
  deliveryAutocomplete: google.maps.places.Autocomplete | null;
  onPickupLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onDeliveryLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  handlePickupPlaceChanged: () => void;
  handleDeliveryPlaceChanged: () => void;
  useAutocomplete: boolean;
}

export const AddressInputs = ({
  pickupAddress,
  deliveryAddress,
  setPickupAddress,
  setDeliveryAddress,
  pickupAutocomplete,
  deliveryAutocomplete,
  onPickupLoad,
  onDeliveryLoad,
  handlePickupPlaceChanged,
  handleDeliveryPlaceChanged,
  useAutocomplete
}: AddressInputsProps) => {
  
  // Si l'autocomplete n'est pas disponible, on affiche des champs simples
  if (!useAutocomplete) {
    return (
      <>
        <div>
          <label className="text-sm font-medium mb-1 block">
            Adresse de départ
          </label>
          <Input
            placeholder="Entrez l'adresse de départ"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Adresse de livraison
          </label>
          <Input
            placeholder="Entrez l'adresse de livraison"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>
      </>
    );
  }

  // Sinon on utilise l'autocomplete Google
  return (
    <>
      <div>
        <label className="text-sm font-medium mb-1 block">
          Adresse de départ
        </label>
        <Autocomplete
          onLoad={onPickupLoad}
          onPlaceChanged={handlePickupPlaceChanged}
          options={{ 
            componentRestrictions: { country: 'fr' },
            types: ['address'],
            fields: ['formatted_address', 'geometry']
          }}
        >
          <Input
            placeholder="Entrez l'adresse de départ"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
          />
        </Autocomplete>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Adresse de livraison
        </label>
        <Autocomplete
          onLoad={onDeliveryLoad}
          onPlaceChanged={handleDeliveryPlaceChanged}
          options={{ 
            componentRestrictions: { country: 'fr' },
            types: ['address'],
            fields: ['formatted_address', 'geometry']
          }}
        >
          <Input
            placeholder="Entrez l'adresse de livraison"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </Autocomplete>
      </div>
    </>
  );
};
