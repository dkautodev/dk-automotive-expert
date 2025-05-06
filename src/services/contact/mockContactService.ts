
import { ContactEntry } from "@/types/addressBook";
import { toast } from "sonner";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Stockage local pour les contacts
const STORAGE_KEY = 'mockContacts';

const getStoredContacts = (): ContactEntry[] => {
  const storedContacts = localStorage.getItem(STORAGE_KEY);
  return storedContacts ? JSON.parse(storedContacts) : [];
};

const storeContacts = (contacts: ContactEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

// Contacts mockés
const DEFAULT_CONTACTS: ContactEntry[] = [
  {
    id: "contact-1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33123456789",
    type: "client",
    notes: "Client important",
    company: "Dupont SA"
  },
  {
    id: "contact-2",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@example.com",
    phone: "+33987654321",
    type: "driver",
    notes: "Chauffeur expérimenté",
    company: "Transport Express"
  },
  {
    id: "contact-3",
    firstName: "Pierre",
    lastName: "Durand",
    email: "pierre.durand@example.com",
    phone: "+33555555555",
    type: "partner",
    notes: "Partenaire logistique",
    company: "Logistique Pro"
  }
];

// Initialiser les contacts s'ils n'existent pas encore
if (!localStorage.getItem(STORAGE_KEY)) {
  storeContacts(DEFAULT_CONTACTS);
}

export const mockContactService = {
  getContacts: async (): Promise<ContactEntry[]> => {
    await simulateDelay();
    return getStoredContacts();
  },
  
  addContact: async (contact: Omit<ContactEntry, "id">): Promise<ContactEntry> => {
    await simulateDelay();
    
    const newContact: ContactEntry = {
      ...contact,
      id: `contact-${Date.now()}`
    };
    
    const contacts = getStoredContacts();
    contacts.push(newContact);
    storeContacts(contacts);
    
    toast.success("Contact ajouté avec succès");
    return newContact;
  },
  
  updateContact: async (id: string, updates: Partial<Omit<ContactEntry, "id">>): Promise<ContactEntry> => {
    await simulateDelay();
    
    const contacts = getStoredContacts();
    const contactIndex = contacts.findIndex(c => c.id === id);
    
    if (contactIndex === -1) {
      throw new Error("Contact non trouvé");
    }
    
    const updatedContact = {
      ...contacts[contactIndex],
      ...updates
    };
    
    contacts[contactIndex] = updatedContact;
    storeContacts(contacts);
    
    toast.success("Contact mis à jour avec succès");
    return updatedContact;
  },
  
  deleteContact: async (id: string): Promise<boolean> => {
    await simulateDelay();
    
    const contacts = getStoredContacts();
    const filteredContacts = contacts.filter(c => c.id !== id);
    
    if (filteredContacts.length === contacts.length) {
      throw new Error("Contact non trouvé");
    }
    
    storeContacts(filteredContacts);
    toast.success("Contact supprimé avec succès");
    
    return true;
  }
};
