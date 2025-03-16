export interface Vehicle {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  files: File[];
}

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  distance: number;
  pickupContact: Contact;
  deliveryContact: Contact;
  vehicles: Vehicle[];
  priceHT: string;
  pickupDate: Date;
  deliveryDate: Date;
  pickupTime?: string;
  deliveryTime?: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  pickupAddress: string;
  deliveryAddress: string;
  vehicles: Vehicle[];
  totalPriceHT: number;
  totalPriceTTC: number;
  distance: number;
  status: 'pending' | 'accepted' | 'rejected';
  dateCreated: Date;
  pickupDate?: Date;
  pickupTime?: string;
  deliveryDate?: Date;
  deliveryTime?: string;
}

export interface OrderState {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
  pickupDate: Date | undefined;
  deliveryDate: Date | undefined;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface VehicleInfo {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  licensePlate: string;
  files: File[];
}

export interface Quote {
  id: string;
  quote_number: string;
  pickupAddress: string;
  deliveryAddress: string;
  vehicles: Vehicle[];
  totalPriceHT: number;
  totalPriceTTC: number;
  distance: number;
  status: 'pending' | 'accepted' | 'rejected';
  dateCreated: Date;
  pickupDate?: Date;
  pickupTime?: string;
  deliveryDate?: Date;
  deliveryTime?: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  pickupAddress: string;
  deliveryAddress: string;
  vehicles: Vehicle[];
  totalPriceHT: number;
  totalPriceTTC: number;
  distance: number;
  status: 'pending' | 'accepted' | 'rejected';
  dateCreated: Date;
  pickupDate: Date;
  pickupTime: string;
  deliveryDate: Date;
  deliveryTime: string;
  pickupContact: Contact;
  deliveryContact: Contact;
}
