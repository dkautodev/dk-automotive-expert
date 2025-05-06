
import { transformToClientDisplayList as mockTransformToClientDisplayList } from "@/services/client/mockClientService";
import { ClientData } from "../types/clientTypes";

export const transformToClientDisplayList = mockTransformToClientDisplayList;

export const transformToClientDisplay = (client: ClientData) => {
  return {
    id: client.id,
    name: client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim(),
    email: client.email || '',
    phone: client.phone || ''
  };
};
