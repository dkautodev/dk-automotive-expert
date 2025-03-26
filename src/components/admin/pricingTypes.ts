
export interface PriceRange {
  id: string;
  label: string;
  perKm?: boolean;
}

export interface PriceData {
  rangeId: string;
  priceHT: string;
}

export interface PriceGrid {
  vehicleTypeId: string;
  vehicleTypeName: string;
  prices: PriceData[];
}
