
import { UserData } from '../types';

/**
 * Fetches users with their profiles from the database
 * This is a mock service since we're removing dashboard components
 */
export const fetchUsersWithProfiles = async (): Promise<{
  clients: UserData[];
  drivers: UserData[];
  admins: UserData[];
}> => {
  // Return mock empty data since we're removing these components
  return { 
    clients: [], 
    drivers: [], 
    admins: [] 
  };
};

/**
 * Delete a user
 * This is a mock service since we're removing dashboard components
 */
export const deleteUser = async (userId: string): Promise<void> => {
  // Mock function since we're removing these components
  console.log("Delete user function called with ID:", userId);
};
