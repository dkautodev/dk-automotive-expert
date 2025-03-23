
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MissionStatus } from '@/hooks/useTodayMissions';

interface MissionStatusBadgeProps {
  status: MissionStatus;
}

export const MissionStatusBadge: React.FC<MissionStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: MissionStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', variant: 'secondary' as const };
      case 'in_progress':
        return { label: 'En cours de prise en charge', variant: 'default' as const };
      case 'pickup_completed':
        return { label: 'En cours de livraison', variant: 'primary' as const };
      case 'incident':
        return { label: 'Incident', variant: 'destructive' as const };
      case 'completed':
        return { label: 'Livraison terminée', variant: 'success' as const };
      default:
        return { label: 'Inconnu', variant: 'outline' as const };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge variant={config.variant}>{config.label}</Badge>
  );
};
