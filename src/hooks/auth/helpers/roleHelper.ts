
import { UserRole } from '../types';

/**
 * Determines the user role based on session data
 */
export const determineUserRole = (user: any): UserRole | null => {
  if (!user) return null;
  
  // Check if role is in metadata
  let role: UserRole | null = (user.user_metadata?.role as UserRole) || (user.user_metadata?.user_type as UserRole) || null;
  
  // If role not in metadata, check if email is admin
  if (!role && user.email === 'dkautomotive70@gmail.com') {
    role = 'admin';
  }
  
  return role;
};
