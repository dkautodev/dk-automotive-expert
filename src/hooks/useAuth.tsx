
// Simple auth hook for future implementation
export const useAuth = () => {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    signIn: async () => {},
    signOut: async () => {},
    signUp: async () => {},
  };
};

export type UserRole = 'admin' | 'client' | 'driver';
