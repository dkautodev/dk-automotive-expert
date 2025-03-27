
// Define interfaces for client data
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Interface for displaying clients in lists/selectors
export interface ClientDisplay {
  id: string;
  name: string;
}

// Interface for the database response structure
export interface ClientFromDB {
  id: string;
  first_name: string;
  last_name: string;
  email: {
    email: string;
  } | null;
  phone: string | null;
}
