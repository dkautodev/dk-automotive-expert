
export type UserRole = 'client' | 'admin' | 'chauffeur';

export interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  profile_picture: string | null;
  siret: string | null;
  vat_number: string | null;
  siret_locked: boolean;
  vat_number_locked: boolean;
  billing_address: string | null;
}

// Ces types client seront utilisés pour l'affichage et la création de nouveaux clients sans références circulaires
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}

export interface NewClientData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
}
