
import { createContext, useContext, ReactNode } from "react";
import { useAuth, UserRole } from "@/hooks/useAuth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    phone?: string;
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
