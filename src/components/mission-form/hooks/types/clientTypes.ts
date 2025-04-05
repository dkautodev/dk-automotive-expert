
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
}

/**
 * New client data for creation
 */
export interface NewClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  first_name?: string; // Adding first_name
  last_name?: string;  // Adding last_name
  address?: string;    // Adding address
}

/**
 * Client display format
 */
export interface ClientDisplay {
  id: string;
  name: string;
}
