
// Custom types for the database tables

export type MissionStatus = 
  | "termine" 
  | "prise_en_charge" 
  | "en_attente" 
  | "confirme" 
  | "confirmé" 
  | "livre" 
  | "incident" 
  | "annule" 
  | "annulé";

export interface UserProfileRow {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MissionRow {
  id: string;
  created_at: string;
  updated_at?: string;
  client_id: string;
  mission_number: string;
  status: MissionStatus;
  distance?: string;
  price_ht?: number;
  price_ttc?: number;
  pickup_address: string;
  delivery_address: string;
  mission_type: "livraison" | "restitution";
  pickup_date?: string;
  pickup_time?: string;
  delivery_date?: string;
  delivery_time?: string;
  pickup_contact?: any;
  delivery_contact?: any;
  vehicle_info?: any;
  additional_info?: string;
  admin_id?: string | null;
  driver_id?: string | null;
  clientProfile?: UserProfileRow | null;
  street_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
  country?: string | null;
}
