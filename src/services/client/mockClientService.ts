
import { toast } from "sonner";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Types de données pour les clients
export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  client_code: string;
}

export interface NewClientData {
  name: string;
  email: string;
  phone: string;
  company: string;
}

// Stockage local pour les clients
const STORAGE_KEY = 'mockClients';

const getStoredClients = (): ClientData[] => {
  const storedClients = localStorage.getItem(STORAGE_KEY);
  return storedClients ? JSON.parse(storedClients) : [];
};

const storeClients = (clients: ClientData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
};

// Clients mockés
const DEFAULT_CLIENTS: ClientData[] = [
  {
    id: "client-1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    phone: "+33123456789",
    company: "Entreprise Dupont",
    client_code: "DUPONT-01"
  },
  {
    id: "client-2",
    name: "Marie Martin",
    email: "marie.martin@example.com",
    phone: "+33987654321",
    company: "Martin & Associés",
    client_code: "MARTIN-01"
  },
  {
    id: "client-3",
    name: "Pierre Durand",
    email: "pierre.durand@example.com",
    phone: "+33555555555",
    company: "Durand Transport",
    client_code: "DURAND-01"
  }
];

// Initialiser les clients s'ils n'existent pas encore
if (!localStorage.getItem(STORAGE_KEY)) {
  storeClients(DEFAULT_CLIENTS);
}

// Transformer les données client pour l'affichage
export const transformToClientDisplayList = (clients: ClientData[]) => {
  return clients.map(client => ({
    value: client.id,
    label: `${client.name} - ${client.company} (${client.client_code})`
  }));
};

export const mockClientService = {
  fetchClientsData: async () => {
    await simulateDelay();
    return { clients: getStoredClients(), error: null };
  },
  
  addClient: async (clientData: NewClientData) => {
    await simulateDelay();
    
    const clients = getStoredClients();
    const newClient: ClientData = {
      id: `client-${Date.now()}`,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      company: clientData.company,
      client_code: `${clientData.name.split(' ')[0].toUpperCase()}-${clients.length + 1}`
    };
    
    clients.push(newClient);
    storeClients(clients);
    
    toast.success("Client ajouté avec succès");
    return { client: newClient, error: null };
  },
  
  updateClient: async (id: string, clientData: Partial<NewClientData>) => {
    await simulateDelay();
    
    const clients = getStoredClients();
    const clientIndex = clients.findIndex(c => c.id === id);
    
    if (clientIndex === -1) {
      return { error: "Client non trouvé", client: null };
    }
    
    const updatedClient = {
      ...clients[clientIndex],
      ...clientData
    };
    
    clients[clientIndex] = updatedClient;
    storeClients(clients);
    
    toast.success("Client mis à jour avec succès");
    return { client: updatedClient, error: null };
  }
};
