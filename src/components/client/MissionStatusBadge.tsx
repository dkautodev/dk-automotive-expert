
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MissionStatus } from '@/types/database';

interface MissionStatusBadgeProps {
  status: MissionStatus;
}

export const MissionStatusBadge: React.FC<MissionStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: MissionStatus) => {
    switch (status) {
      case 'en_attente':
        return { label: 'En attente', variant: 'secondary' as const };
      case 'confirme':
      case 'confirmé':
        return { label: 'Confirmé', variant: 'default' as const };
      case 'prise_en_charge':
        return { label: 'En route', variant: 'default' as const };
      case 'livre':
        return { label: 'Livré', variant: 'success' as const };
      case 'incident':
        return { label: 'Incident', variant: 'destructive' as const };
      case 'annule':
      case 'annulé':
        return { label: 'Annulé', variant: 'destructive' as const };
      case 'termine':
        return { label: 'Terminé', variant: 'success' as const };
      default:
        return { label: 'Inconnu', variant: 'outline' as const };
    }
  };
  
  const config = getStatusConfig(status);
  
  return (
    <Badge variant={config.variant}>{config.label}</Badge>
  );
};
