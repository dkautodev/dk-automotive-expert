
/**
 * Client data structure used throughout the application
 */
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  client_code?: string;
}

/**
 * New client data for creation
 */
export interface NewClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
}

/**
 * Client display format
 */
export interface ClientDisplay {
  id: string;
  name: string;
}

/**
 * Unified user data structure from the database
 */
export interface UnifiedUserData {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  phone: string | null;
  profile_picture: string | null;
  client_code: string | null;
  siret_number: string | null;
  vat_number: string | null;
  billing_address: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Type guard to check if an object is a UnifiedUserData
 */
export function isUnifiedUserData(obj: any): obj is UnifiedUserData {
  return obj && 
    typeof obj.id === 'string' && 
    typeof obj.email === 'string' && 
    typeof obj.role === 'string';
}
