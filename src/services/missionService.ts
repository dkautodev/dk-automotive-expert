
import { supabase } from './mockSupabaseClient';

export const missionService = {
  getMissionAttachments: async (missionId: string) => {
    console.log("Getting attachments for mission", missionId);
    // Mock implementation that returns an empty array
    return {
      data: [],
      error: null
    };
  },
  
  // Add other mission-related service methods as needed
};
