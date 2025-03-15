
import { createContext, useContext, ReactNode } from "react";
import { useAuth, UserRole } from "@/hooks/useAuth";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  company?: string | null;
  logo_url?: string | null;
  siret?: string | null;
  vat_number?: string | null;
  siret_locked?: boolean | null;
  vat_number_locked?: boolean | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    phone?: string;
    company?: string;
    role: UserRole;
  }) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
