
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'client' | 'admin' | 'chauffeur';

export interface AuthState {
  user: User | null;
  session: Session | null;
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
