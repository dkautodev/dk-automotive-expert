
import { mockClientService } from "@/services/client/mockClientService";

export const clientService = {
  fetchClientsData: mockClientService.fetchClientsData,
  addClient: mockClientService.addClient,
  updateClient: mockClientService.updateClient
};
