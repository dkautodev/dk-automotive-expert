
// Client data types used across the application
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

// Form data for creating a new client
export interface NewClientData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
}

// For displaying clients in selectors
export interface ClientDisplay {
  id: string;
  name: string;
}
