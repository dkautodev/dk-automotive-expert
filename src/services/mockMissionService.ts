
export const mockCancelMission = async (missionId: string): Promise<boolean> => {
  console.log(`Mocking cancellation of mission ${missionId}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return success (true) for the mock implementation
  return true;
};
