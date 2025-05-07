
export interface ClientData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone: string;
  company_name?: string;
  created_at?: string;
  client_code?: string;
  name?: string;
  company?: string;
  address?: string;
}

export interface NewClientData {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  company_name?: string;
}

export interface ClientDisplayData {
  id: string;
  name: string;
  email: string;
  phone: string;
}
