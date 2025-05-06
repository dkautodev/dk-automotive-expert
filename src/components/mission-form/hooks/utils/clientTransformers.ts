
import { ClientData, ClientDisplay } from "../types/clientTypes";
import { formatClientName } from "@/utils/clientFormatter";

/**
 * Transforms a ClientData object into a ClientDisplay object
 * with standardized code formatting
 */
export const transformToClientDisplay = (client: ClientData): ClientDisplay => {
  // Adapter le client au format attendu par la fonction formatClientName
  const profileFormat = {
    client_code: client.client_code,
    company_name: client.company,
    first_name: client.first_name,
    last_name: client.last_name
  };
  
  return {
    id: client.id,
    name: formatClientName(profileFormat, client.email || 'Client sans nom')
  };
};

/**
 * Transforms a list of ClientData objects into ClientDisplay objects
 */
export const transformToClientDisplayList = (clients: ClientData[]): ClientDisplay[] => {
  return clients.map(transformToClientDisplay);
};
