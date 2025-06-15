declare namespace google.maps {
  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    lat(): number;
    lng(): number;
    equals(other: LatLng): boolean;
    toString(): string;
    toUrlValue(precision?: number): string;
  }

  class LatLngBounds {
    constructor(sw?: LatLng, ne?: LatLng);
    contains(latLng: LatLng): boolean;
    equals(other: LatLngBounds): boolean;
    extend(point: LatLng): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    isEmpty(): boolean;
    toSpan(): LatLng;
    toString(): string;
    toUrlValue(precision?: number): string;
    union(other: LatLngBounds): LatLngBounds;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapMouseEvent {
    latLng?: LatLng;
  }

  class Geocoder {
    geocode(
      request: {
        address?: string;
        location?: LatLng | LatLngLiteral;
        placeId?: string;
        bounds?: LatLngBounds;
        componentRestrictions?: GeocoderComponentRestrictions;
        region?: string;
      },
      callback: (
        results: GeocoderResult[],
        status: string
      ) => void
    ): void;
  }

  interface GeocoderComponentRestrictions {
    administrativeArea?: string;
    country?: string | string[];
    locality?: string;
    postalCode?: string;
    route?: string;
  }

  interface GeocoderResult {
    address_components: GeocoderAddressComponent[];
    formatted_address: string;
    geometry: {
      location: LatLng;
      location_type: string;
      viewport: LatLngBounds;
      bounds?: LatLngBounds;
    };
    place_id: string;
    plus_code?: {
      compound_code: string;
      global_code: string;
    };
    types: string[];
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  enum TravelMode {
    BICYCLING = "BICYCLING",
    DRIVING = "DRIVING",
    TRANSIT = "TRANSIT",
    WALKING = "WALKING"
  }
  
  enum UnitSystem {
    IMPERIAL = 0,
    METRIC = 1
  }

  class DistanceMatrixService {
    getDistanceMatrix(
      request: {
        origins: Array<string | LatLng | LatLngLiteral>;
        destinations: Array<string | LatLng | LatLngLiteral>;
        travelMode: TravelMode;
        unitSystem?: UnitSystem;
        drivingOptions?: {
          departureTime: Date;
          trafficModel: string;
        };
        transitOptions?: {
          arrivalTime?: Date;
          departureTime?: Date;
          modes?: string[];
          routingPreference?: string;
        };
        avoidHighways?: boolean;
        avoidTolls?: boolean;
        region?: string;
      },
      callback: (
        response: DistanceMatrixResponse,
        status: string
      ) => void
    ): void;
  }

  interface DistanceMatrixResponse {
    originAddresses: string[];
    destinationAddresses: string[];
    rows: DistanceMatrixResponseRow[];
  }

  interface DistanceMatrixResponseRow {
    elements: DistanceMatrixResponseElement[];
  }

  interface DistanceMatrixResponseElement {
    distance: {
      text: string;
      value: number;
    };
    duration: {
      text: string;
      value: number;
    };
    fare?: {
      currency: string;
      value: number;
      text: string;
    };
    status: string;
  }
}

declare namespace google.maps.places {
  // Legacy Autocomplete (still functional)
  class Autocomplete {
    constructor(
      inputField: HTMLInputElement,
      options?: AutocompleteOptions
    );
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
    getPlace(): PlaceResult;
    setBounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): void;
    setComponentRestrictions(restrictions: ComponentRestrictions): void;
    setFields(fields: string[]): void;
    setOptions(options: AutocompleteOptions): void;
    setTypes(types: string[]): void;
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

  // PlaceAutocompleteElement API (New - 2024)
  namespace places {
    // The new PlaceAutocompleteElement class (modulaire, web component-like)
    class PlaceAutocompleteElement extends HTMLElement {
      inputElement: HTMLInputElement;
      value: string;
      types: string[];
      componentRestrictions: { country?: string | string[] } | undefined;
      disabled: boolean;
      setOptions(options: PlaceAutocompleteElementOptions): void;
      addEventListener(type: "gmp-placeautocomplete-placechange", listener: (this: PlaceAutocompleteElement, ev: Event) => any, options?: boolean | AddEventListenerOptions): void;
      getPlace(): PlaceResult;
    }

    interface PlaceAutocompleteElementOptions {
      componentRestrictions?: ComponentRestrictions;
      types?: string[];
      fields?: string[];
      strictBounds?: boolean;
      inputElement?: HTMLInputElement;
    }
  }
}

// Register as a custom element (declaration trick for TS)
interface HTMLElementTagNameMap {
  "gmpx-place-autocomplete": google.maps.places.PlaceAutocompleteElement;
}

interface Window {
  google?: {
    maps?: google.maps & {
      places: google.maps.places;
    };
  };
}
