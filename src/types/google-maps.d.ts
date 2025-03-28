
declare namespace google.maps.places {
  class Autocomplete {
    constructor(
      inputField: HTMLInputElement,
      options?: google.maps.places.AutocompleteOptions
    );
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
    getPlace(): google.maps.places.PlaceResult;
  }

  interface AutocompleteOptions {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    componentRestrictions?: ComponentRestrictions;
    types?: string[];
    fields?: string[];
    strictBounds?: boolean;
  }

  interface ComponentRestrictions {
    country: string | string[];
  }

  interface PlaceResult {
    address_components?: google.maps.GeocoderAddressComponent[];
    formatted_address?: string;
    geometry?: {
      location: google.maps.LatLng;
      viewport: google.maps.LatLngBounds;
    };
    name?: string;
    place_id?: string;
  }
}

interface Window {
  google?: {
    maps?: {
      places: any;
      LatLng: any;
      LatLngBounds: any;
      MapsEventListener: any;
      GeocoderAddressComponent: any;
    };
  };
}
