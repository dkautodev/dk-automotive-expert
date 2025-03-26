
import { useAuthSession } from './useAuthSession';
import { useAuthMethods } from './useAuthMethods';
import { useUserProfile } from './useUserProfile';

export type { UserRole } from './types';

export const useAuth = () => {
  const authState = useAuthSession();
  const { signIn, signUp, signOut, registerAdmin } = useAuthMethods();
  const { fetchUserProfile } = useUserProfile();

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    registerAdmin,
    fetchUserProfile
  };
};
