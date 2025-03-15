
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { GOOGLE_MAPS_API_KEY } from '@/lib/constants';
import { useLoadScript } from '@react-google-maps/api';
import { PickupFormValues } from './pickupFormSchema';

export const useAddressAutocomplete = (
  addressInputRef: React.RefObject<HTMLInputElement>,
  form: UseFormReturn<PickupFormValues>
) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'] as any,
  });

  useEffect(() => {
    if (!isLoaded || !addressInputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
      componentRestrictions: { country: 'fr' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        form.setValue('address', place.formatted_address);
      }
    });
  }, [isLoaded, addressInputRef, form]);

  return { isLoaded };
};

