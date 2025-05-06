
export type UserRole = 'admin' | 'client' | 'driver';

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
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

// Helper function to map database fields to frontend fields
export const mapDatabaseProfileToUserProfile = (profileData: any): UserProfile | null => {
  if (!profileData) return null;
  
  return {
    id: profileData.id,
    firstName: profileData.first_name || '',
    lastName: profileData.last_name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    company: profileData.company_name || '',
    avatarUrl: profileData.avatar_url || '',
    role: profileData.role || 'client',
  };
};
