
// Define interfaces for client data
export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

// Define a separate interface for the database response structure
export interface ClientFromDB {
  id: string;
  first_name: string;
  last_name: string;
  email: {
    email: string;
  } | null;
  phone: string;
}
