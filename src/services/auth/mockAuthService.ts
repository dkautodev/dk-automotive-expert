
import { toast } from "sonner";
import { UserProfile } from "@/hooks/auth/types";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Données utilisateur mockées
const MOCK_USERS = [
  {
    id: "mock-user-1",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    profile: {
      id: "mock-user-1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      phone: "+33123456789",
      company: "Admin Inc",
      avatarUrl: null,
      role: "admin"
    }
  },
  {
    id: "mock-user-2",
    email: "client@example.com",
    password: "password123",
    role: "client",
    profile: {
      id: "mock-user-2",
      firstName: "Client",
      lastName: "User",
      email: "client@example.com",
      phone: "+33987654321",
      company: "Client Corp",
      avatarUrl: null,
      role: "client"
    }
  },
  {
    id: "mock-user-3",
    email: "driver@example.com",
    password: "password123",
    role: "driver",
    profile: {
      id: "mock-user-3",
      firstName: "Driver",
      lastName: "User",
      email: "driver@example.com",
      phone: "+33555555555",
      company: "Driver LLC",
      avatarUrl: null,
      role: "driver"
    }
  }
];

// Stockage local pour la session
const getStoredSession = () => {
  const storedSession = localStorage.getItem('mockAuthSession');
  return storedSession ? JSON.parse(storedSession) : null;
};

const storeSession = (session: any) => {
  localStorage.setItem('mockAuthSession', JSON.stringify(session));
};

const clearSession = () => {
  localStorage.removeItem('mockAuthSession');
};

export interface MockAuthState {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
}

// Service d'authentification mock
export const mockAuthService = {
  getSession: async (): Promise<MockAuthState> => {
    await simulateDelay();
    const session = getStoredSession();
    
    if (!session) {
      return {
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
        profile: null
      };
    }
    
    const mockUser = MOCK_USERS.find(u => u.id === session.user.id);
    
    return {
      user: mockUser ? {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      } : null,
      session,
      isLoading: false,
      isAuthenticated: !!mockUser,
      profile: mockUser?.profile || null
    };
  },
  
  signIn: async (email: string, password: string): Promise<MockAuthState> => {
    await simulateDelay();
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      toast.error("Email ou mot de passe invalide");
      throw new Error("Invalid login credentials");
    }
    
    const session = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      expires_at: Date.now() + 86400000 // Expire dans 24h
    };
    
    storeSession(session);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      session,
      isLoading: false,
      isAuthenticated: true,
      profile: user.profile
    };
  },
  
  signOut: async (): Promise<void> => {
    await simulateDelay();
    clearSession();
  },
  
  onAuthStateChange: (callback: (state: MockAuthState) => void) => {
    // Vérifier l'état initial
    const checkInitialState = async () => {
      const state = await mockAuthService.getSession();
      callback(state);
    };
    
    checkInitialState();
    
    // Simuler un observateur d'événements
    const storageListener = () => {
      checkInitialState();
    };
    
    window.addEventListener('storage', storageListener);
    
    // Retourner une fonction pour nettoyer l'observateur
    return {
      unsubscribe: () => {
        window.removeEventListener('storage', storageListener);
      }
    };
  }
};
