
export const determineUserRole = (user: any): string => {
  // Mock implementation - in a real app this would have more sophisticated logic
  if (!user) return 'anonymous';
  
  // Mock admin users by email for testing
  if (user.email === 'admin@example.com' || user.email === 'dkautomotive70@gmail.com') {
    return 'admin';
  }
  
  // Check for custom claim or metadata
  const userMetadata = user.user_metadata || {};
  const roleClaim = userMetadata.role || 'client';
  
  return roleClaim;
};
