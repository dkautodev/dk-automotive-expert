
export type UserRole = 'client' | 'admin' | 'chauffeur';

export interface AuthState {
  user: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
