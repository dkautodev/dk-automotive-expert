
export interface ClientData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone: string;
  company_name?: string;
  created_at?: string;
  client_code?: string;
}

export interface ClientDisplayData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Fonction pour transformer un client en format d'affichage
export const transformToClientDisplayList = (clients: ClientData[]): ClientDisplayData[] => {
  return clients.map(client => ({
    id: client.id,
    name: client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim(),
    email: client.email || '',
    phone: client.phone || ''
  }));
};

// Service mock pour les clients
export const mockClientService = {
  // Récupérer les clients
  fetchClientsData: async () => {
    console.log("Mock: Fetching clients data");
    
    // Renvoyer des données mock
    const mockClients: ClientData[] = [
      {
        id: "c1",
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@example.com",
        phone: "+33123456789",
        company_name: "Dupont SAS",
        created_at: new Date().toISOString(),
        client_code: "CL001"
      },
      {
        id: "c2",
        first_name: "Marie",
        last_name: "Martin",
        email: "marie.martin@example.com",
        phone: "+33987654321",
        company_name: "Martin Enterprise",
        created_at: new Date().toISOString(),
        client_code: "CL002"
      }
    ];
    
    return { clients: mockClients, error: null };
  },
  
  // Ajouter un client
  addClient: async (clientData: any) => {
    console.log("Mock: Adding client", clientData);
    
    // Créer un mock client avec les données fournies
    const mockClient: ClientData = {
      id: `c${Math.floor(Math.random() * 1000)}`,
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      email: clientData.email,
      phone: clientData.phone || "",
      company_name: clientData.company_name,
      created_at: new Date().toISOString(),
      client_code: `CL${Math.floor(Math.random() * 1000)}`
    };
    
    return { client: mockClient, error: null };
  },
  
  // Mettre à jour un client
  updateClient: async (clientId: string, clientData: any) => {
    console.log("Mock: Updating client", { clientId, clientData });
    
    return { success: true, error: null };
  }
};
