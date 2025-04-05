
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
  client_code?: string; // Ajout du champ client_code
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
