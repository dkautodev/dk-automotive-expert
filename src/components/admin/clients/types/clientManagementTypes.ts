
import { UserData } from "../types";

export interface UseClientManagementReturn {
  clients: UserData[];
  drivers: UserData[];
  loading: boolean;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  userToDelete: UserData | null;
  isDeleting: boolean;
  handleDeleteUser: (user: UserData) => void;
  confirmDeleteUser: () => Promise<void>;
}

export interface FetchUsersResponse {
  clients: UserData[];
  drivers: UserData[];
}
