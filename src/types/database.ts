
// Basic database type definitions
export interface ProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'client' | 'driver';
  created_at: string;
  updated_at: string;
}

export interface ContactRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string | null;
  notes: string | null;
  type: string;
  created_at: string;
  updated_at: string;
}

// Document type definitions
export interface DocumentItem {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  document_type: string;
  document_url: string;
  uploaded_at: string;
  [key: string]: any;
}

export type DocumentType = string;

// Mission status type
export type MissionStatus = 'en_attente' | 'confirme' | 'confirmé' | 'prise_en_charge' | 'livre' | 'incident' | 'annule' | 'annulé' | 'termine' | string;

// Invoice type
export interface InvoiceRow {
  id: string;
  invoice_number: string;
  client_id: string;
  mission_id?: string;
  price_ht: number;
  price_ttc: number;
  status: string;
  created_at: string;
  updated_at: string;
  payment_due_date?: string;
  payment_date?: string;
  [key: string]: any;
}

// Add these placeholder types to prevent errors in existing components
// These will be properly implemented later when we rebuild these features
export interface MissionRow {
  id: string;
  mission_number?: string;
  client_id?: string;
  price_ttc?: number;
  status?: MissionStatus;
  delivery_date?: string;
  clientProfile?: UserProfileRow;
  pickup_address?: string;
  delivery_address?: string;
  mission_type?: "livraison" | "restitution";
  pickup_date?: string | null;
  pickup_time?: string | null;
  delivery_time?: string | null;
  additional_info?: string | null;
  driver_id?: string | null;
  vehicle_info?: any;
  pickup_contact?: any;
  delivery_contact?: any;
  city?: string;
  postal_code?: string;
  admin_id?: string; // Added admin_id field
  [key: string]: any;
}

export interface UserProfileRow {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company_name?: string | null;
  phone?: string | null;
  profile_picture?: string | null;
  billing_address?: string | null;
  siret_number?: string | null;
  vat_number?: string | null;
  client_code?: string | null;
  // Add fields that were missing
  billing_address_street?: string | null;
  billing_address_city?: string | null;
  billing_address_postal_code?: string | null;
  billing_address_country?: string | null;
  siret_locked?: boolean;
  vat_number_locked?: boolean;
  [key: string]: any;
}
