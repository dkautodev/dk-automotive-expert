
import { ClientData, ClientDisplay } from "../types/clientTypes";

/**
 * Transforms a ClientData object into a ClientDisplay object
 * with standardized name formatting
 */
export const transformToClientDisplay = (client: ClientData): ClientDisplay => {
  const nameParts = [];
  
  if (client.last_name) nameParts.push(client.last_name.toUpperCase());
  if (client.first_name) nameParts.push(client.first_name);
  if (client.company) nameParts.push(client.company);
  
  const displayName = nameParts.length > 0 
    ? nameParts.join('-') 
    : client.email || 'Client sans nom';
  
  return {
    id: client.id,
    name: displayName
  };
};

/**
 * Transforms a list of ClientData objects into ClientDisplay objects
 */
export const transformToClientDisplayList = (clients: ClientData[]): ClientDisplay[] => {
  return clients.map(transformToClientDisplay);
};
