
import { toast } from "sonner";
import { ProfileData } from "@/components/client/profile/types";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Stockage local pour les profils d'utilisateurs
const STORAGE_KEY = 'mockUserProfiles';

const getStoredProfiles = (): Record<string, ProfileData> => {
  const storedProfiles = localStorage.getItem(STORAGE_KEY);
  return storedProfiles ? JSON.parse(storedProfiles) : {};
};

const storeProfiles = (profiles: Record<string, ProfileData>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

// Profils mockés
const DEFAULT_PROFILES: Record<string, ProfileData> = {
  'mock-user-1': {
    id: 'mock-user-1',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    phone: '+33123456789',
    company: 'Admin Inc',
    profile_picture: '',
    siret: '12345678901234',
    vat_number: 'FR12345678901',
    siret_locked: false,
    vat_number_locked: false,
    billing_address_street: '1 rue de l\'Admin',
    billing_address_city: 'Paris',
    billing_address_postal_code: '75001',
    billing_address_country: 'France'
  },
  'mock-user-2': {
    id: 'mock-user-2',
    first_name: 'Client',
    last_name: 'User',
    email: 'client@example.com',
    phone: '+33987654321',
    company: 'Client Corp',
    profile_picture: '',
    siret: '98765432109876',
    vat_number: 'FR98765432109',
    siret_locked: true,
    vat_number_locked: false,
    billing_address_street: '2 avenue du Client',
    billing_address_city: 'Lyon',
    billing_address_postal_code: '69001',
    billing_address_country: 'France'
  },
  'mock-user-3': {
    id: 'mock-user-3',
    first_name: 'Driver',
    last_name: 'User',
    email: 'driver@example.com',
    phone: '+33555555555',
    company: 'Driver LLC',
    profile_picture: '',
    siret: '55555555555555',
    vat_number: 'FR55555555555',
    siret_locked: false,
    vat_number_locked: true,
    billing_address_street: '3 boulevard du Chauffeur',
    billing_address_city: 'Marseille',
    billing_address_postal_code: '13001',
    billing_address_country: 'France'
  }
};

// Initialiser les profils s'ils n'existent pas encore
if (!localStorage.getItem(STORAGE_KEY)) {
  storeProfiles(DEFAULT_PROFILES);
}

export const mockProfileService = {
  getProfile: async (userId: string): Promise<ProfileData | null> => {
    await simulateDelay();
    const profiles = getStoredProfiles();
    return profiles[userId] || null;
  },
  
  updateProfile: async (userId: string, data: Partial<ProfileData>): Promise<ProfileData> => {
    await simulateDelay();
    const profiles = getStoredProfiles();
    
    if (!profiles[userId]) {
      throw new Error("Profil utilisateur non trouvé");
    }
    
    const updatedProfile = {
      ...profiles[userId],
      ...data
    };
    
    profiles[userId] = updatedProfile;
    storeProfiles(profiles);
    toast.success("Profil mis à jour avec succès");
    
    return updatedProfile;
  },
  
  updateLogo: async (userId: string, logoUrl: string): Promise<ProfileData> => {
    await simulateDelay();
    const profiles = getStoredProfiles();
    
    if (!profiles[userId]) {
      throw new Error("Profil utilisateur non trouvé");
    }
    
    const updatedProfile = {
      ...profiles[userId],
      profile_picture: logoUrl
    };
    
    profiles[userId] = updatedProfile;
    storeProfiles(profiles);
    toast.success("Logo mis à jour avec succès");
    
    return updatedProfile;
  },
  
  lockField: async (userId: string, field: 'siret' | 'vat_number', value: string): Promise<ProfileData> => {
    await simulateDelay();
    const profiles = getStoredProfiles();
    
    if (!profiles[userId]) {
      throw new Error("Profil utilisateur non trouvé");
    }
    
    const fieldMapping: Record<string, string> = {
      siret: 'siret',
      vat_number: 'vat_number'
    };
    
    const updatedProfile = {
      ...profiles[userId],
      [fieldMapping[field]]: value,
      [`${field}_locked`]: true
    };
    
    profiles[userId] = updatedProfile;
    storeProfiles(profiles);
    toast.success("Le champ a été mis à jour et verrouillé");
    
    return updatedProfile;
  },
  
  changePassword: async (email: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    await simulateDelay(1000);
    toast.success("Mot de passe mis à jour avec succès");
    return true;
  }
};
