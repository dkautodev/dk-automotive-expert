
import { useEffect, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { QuoteFormValues } from '@/components/quote-form/quoteFormSchema';
import { useGoogleMapsApi } from './useGoogleMapsApi';

export const useGooglePlacesAutocomplete = (
  inputRef: React.RefObject<HTMLInputElement>,
  setValue: UseFormSetValue<QuoteFormValues>,
  fieldName: 'pickup_address' | 'delivery_address'
) => {
  const { isLoaded, loadError } = useGoogleMapsApi({ libraries: ['places'] });
  
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ['fr'] },
        fields: ['formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setValue(fieldName, place.formatted_address);
        }
      });

      return () => {
        google.maps.event.clearInstanceListeners(autocomplete);
      };
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error);
    }
  }, [isLoaded, inputRef, setValue, fieldName]);

  return { isLoaded, loadError };
};
