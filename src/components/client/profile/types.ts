
export interface ProfileFormData {
  email: string;
  phone: string;
  siret: string;
  vat_number: string;
  billing_address: string;
}

export interface ProfileData {
  id?: string;
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  phone?: string | null;
  siret?: string | null;
  vat_number?: string | null;
  siret_locked?: boolean;
  vat_number_locked?: boolean;
  billing_address?: string | null;
  profile_picture?: string | null;
}

export interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  error: string | null;
  submitForm: (data: ProfileFormData) => Promise<void>;
  handleLogoUpdate: (logoUrl: string) => Promise<void>;
  confirmLockField: (field: 'siret' | 'vat_number', value: string) => void;
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  handleConfirmLock: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}
