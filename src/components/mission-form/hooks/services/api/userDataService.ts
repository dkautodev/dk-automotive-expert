
import { supabase } from '@/services/mockSupabaseClient';

export const getCurrentUserData = async () => {
  try {
    console.log("Mock: Getting current user data");
    
    // Return mock user data
    return {
      data: {
        id: "mock-user-id",
        email: "user@example.com",
        first_name: "John",
        last_name: "Doe",
        phone: "+33123456789",
        company_name: "Mock Company"
      },
      error: null
    };
  } catch (error: any) {
    console.error("Error getting user data:", error);
    return { data: null, error: error.message };
  }
};
