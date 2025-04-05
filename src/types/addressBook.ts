
export interface ContactEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string; // Adding the company property
}

export interface AddressBookState {
  contacts: ContactEntry[];
  isLoading: boolean;
  error: string | null;
}
