
import { AuthState } from '../types';
import { determineUserRole } from './roleHelper';

/**
 * Maps session data to AuthState format
 */
export const mapSessionToAuthState = (
  session: any, 
  error: string | null = null,
  loading: boolean = false
): AuthState => {
  const role = session?.user ? determineUserRole(session.user) : null;
  
  return {
    user: session?.user || null,
    session,
    loading,
    error,
    isAuthenticated: !!session,
    role
  };
};
