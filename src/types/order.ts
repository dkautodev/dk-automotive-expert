
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
  distance: string;
  pickupContact: Contact;
  deliveryContact: Contact;
  vehicles: Vehicle[];
  priceHT: string;
  pickupDate: Date;
  deliveryDate: Date;
}
