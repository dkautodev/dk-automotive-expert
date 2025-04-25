
import { ClientData, ClientDisplay } from "../types/clientTypes";

/**
 * Transforms a ClientData object into a ClientDisplay object
 * with standardized code formatting
 */
export const transformToClientDisplay = (client: ClientData): ClientDisplay => {
  // Si le client a un client_code généré, l'utiliser en priorité
  if (client.client_code) {
    return {
      id: client.id,
      name: client.client_code
    };
  }
  
  // Ensuite, donner la priorité au nom de la société s'il existe
  if (client.company) {
    return {
      id: client.id,
      name: client.company
    };
  }
  
  // Sinon, utiliser le format nom/prénom
  const nameParts = [];
  
  if (client.last_name) nameParts.push(client.last_name.toUpperCase());
  if (client.first_name) nameParts.push(client.first_name);
  
  const displayName = nameParts.length > 0 
    ? nameParts.join(' ') 
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
