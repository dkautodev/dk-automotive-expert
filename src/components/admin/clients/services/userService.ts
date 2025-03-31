
import { edgeFunctionService } from "./api/edgeFunctionService";
import { authApiService } from "./api/authApiService";
import { databaseService } from "./api/databaseService";
import { userDeletionService } from "./operations/userDeletionService";
import { FetchUsersResponse } from "../types/clientManagementTypes";

/**
 * Main service module that orchestrates the user operations
 */
export const userService = {
  /**
   * Fetches users with profiles from various sources
   * Tries edge function first, then Auth API, then direct database access
   */
  fetchUsersWithProfiles: async (): Promise<FetchUsersResponse> => {
    // Try with Edge Function first
    const edgeFunctionResult = await edgeFunctionService.fetchUsersViaEdgeFunction();
    if (edgeFunctionResult) {
      return edgeFunctionResult;
    }
    
    // Fallback: Auth API
    const authApiResult = await authApiService.fetchUsersViaAuthApi();
    if (authApiResult) {
      return authApiResult;
    }
    
    // Last resort: Direct database access
    const databaseResult = await databaseService.fetchUsersFromDatabase();
    if (databaseResult) {
      return databaseResult;
    }
    
    // If all methods fail, return empty lists
    return { clients: [], drivers: [], admins: [] };
  },

  /**
   * Deletes a user by ID
   * Tries edge function first, then direct database deletion
   */
  deleteUser: async (userId: string): Promise<void> => {
    // Try edge function deletion first
    const edgeFunctionSuccess = await userDeletionService.deleteUserViaEdgeFunction(userId);
    if (edgeFunctionSuccess) {
      return;
    }
    
    // Fallback: Direct deletion from database
    const databaseSuccess = await userDeletionService.deleteUserFromDatabase(userId);
    if (!databaseSuccess) {
      throw new Error("Failed to delete user");
    }
  }
};

// Export individually for direct importing
export const { fetchUsersWithProfiles, deleteUser } = userService;
