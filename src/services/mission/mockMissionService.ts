
import { toast } from "sonner";

// Simule un délai réseau
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Stockage local pour les missions
const STORAGE_KEY = 'mockMissions';
const ATTACHMENTS_KEY = 'mockMissionAttachments';

const getStoredMissions = () => {
  const storedMissions = localStorage.getItem(STORAGE_KEY);
  return storedMissions ? JSON.parse(storedMissions) : [];
};

const storeMissions = (missions: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
};

const getStoredAttachments = () => {
  const storedAttachments = localStorage.getItem(ATTACHMENTS_KEY);
  return storedAttachments ? JSON.parse(storedAttachments) : [];
};

const storeAttachments = (attachments: any[]) => {
  localStorage.setItem(ATTACHMENTS_KEY, JSON.stringify(attachments));
};

export const mockMissionService = {
  getMissionNumber: async (missionId: string): Promise<string | null> => {
    await simulateDelay();
    const missions = getStoredMissions();
    const mission = missions.find((m: any) => m.id === missionId);
    return mission ? mission.mission_number : null;
  },
  
  getMissionAttachments: async (missionId: string) => {
    await simulateDelay();
    const attachments = getStoredAttachments();
    const filteredAttachments = attachments.filter((a: any) => a.mission_id === missionId);
    return { data: filteredAttachments, error: null };
  },
  
  checkFileExists: async (filePath: string): Promise<boolean> => {
    await simulateDelay();
    return Math.random() > 0.2; // 80% de chance que le fichier existe
  },
  
  uploadAttachments: async (missionId: string, attachments: File[]) => {
    await simulateDelay(1500);
    
    const existingAttachments = getStoredAttachments();
    const newAttachments = attachments.map((file) => ({
      id: `attachment-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      mission_id: missionId,
      file_name: file.name,
      file_path: `mock-path/${missionId}/${file.name}`,
      file_type: file.type,
      file_size: file.size,
      uploaded_by: 'current-user',
      created_at: new Date().toISOString()
    }));
    
    storeAttachments([...existingAttachments, ...newAttachments]);
    
    return true;
  }
};

// Export individual functions for direct import
export const { getMissionNumber, getMissionAttachments, checkFileExists } = mockMissionService;
