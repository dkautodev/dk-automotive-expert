
export interface ContactEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface AddressBookState {
  contacts: ContactEntry[];
  isLoading: boolean;
  error: string | null;
}
