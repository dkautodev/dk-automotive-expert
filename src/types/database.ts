
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

// Add these placeholder types to prevent errors in existing components
// These will be properly implemented later when we rebuild these features
export interface MissionRow {
  id: string;
  mission_number?: string;
  client_id?: string;
  price_ttc?: number;
  status?: string;
  delivery_date?: string;
  clientProfile?: UserProfileRow;
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
  [key: string]: any;
}

// Document type definitions to prevent errors
export interface DocumentItem {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  [key: string]: any;
}

export interface DocumentType {
  id: string;
  name: string;
  [key: string]: any;
}
