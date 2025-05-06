
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Truck, XCircle, AlertTriangle, CircleDot } from "lucide-react";

interface ExtendedMissionStatusBadgeProps {
  status: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ExtendedMissionStatusBadge: React.FC<ExtendedMissionStatusBadgeProps> = ({ 
  status, 
  showIcon = true, 
  size = "md" 
}) => {
  let label: string;
  let variant: "default" | "secondary" | "destructive" | "outline";
  let icon: React.ReactNode;
  
  const sizeClasses = {
    sm: "text-xs py-0 h-6",
    md: "text-xs py-1",
    lg: "text-sm py-1"
  };
  
  switch (status) {
    case 'en_attente':
      label = 'En attente';
      variant = 'outline';
      icon = <CircleDot className="h-3.5 w-3.5 text-blue-500" />;
      break;
    case 'confirme':
    case 'confirmé':
      label = 'Confirmée';
      variant = 'secondary';
      icon = <CheckCircle className="h-3.5 w-3.5 text-secondary-foreground" />;
      break;
    case 'prise_en_charge':
      label = 'En cours';
      variant = 'default';
      icon = <Truck className="h-3.5 w-3.5 text-primary-foreground" />;
      break;
    case 'livre':
      label = 'Livrée';
      variant = 'outline';
      icon = <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      break;
    case 'termine':
      label = 'Terminée';
      variant = 'outline';
      icon = <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
      break;
    case 'annule':
    case 'annulé':
      label = 'Annulée';
      variant = 'destructive';
      icon = <XCircle className="h-3.5 w-3.5 text-destructive-foreground" />;
      break;
    case 'incident':
      label = 'Incident';
      variant = 'destructive';
      icon = <AlertTriangle className="h-3.5 w-3.5 text-destructive-foreground" />;
      break;
    default:
      label = status || 'Inconnu';
      variant = 'outline';
      icon = <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  }
  
  return (
    <Badge 
      variant={variant} 
      className={`${sizeClasses[size]} font-normal flex items-center gap-1`}
    >
      {showIcon && icon}
      {label}
    </Badge>
  );
};

export default ExtendedMissionStatusBadge;
