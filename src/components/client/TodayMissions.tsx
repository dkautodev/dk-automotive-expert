
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useTodayMissions } from '@/hooks/useTodayMissions';
import { MissionStatusBadge } from './MissionStatusBadge';
import { MissionRow } from '@/types/database';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/ui/loader";
import { MapPin, Truck, Calendar, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const getMissionProgress = (status: MissionRow['status']) => {
  switch (status) {
    case 'en_attente': return 10;
    case 'confirme': 
    case 'confirmé': return 30;
    case 'prise_en_charge': return 70;
    case 'livre': return 90;
    case 'incident': return 50;
    case 'termine': return 100;
    case 'annule': return 0;
    default: return 0;
  }
};

const TodayMissions: React.FC = () => {
  const { user } = useAuthContext();
  const { missions, loading, error } = useTodayMissions({
    userId: user?.id,
    userRole: user?.user_metadata?.user_type || 'client'
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <Loader className="my-8" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Missions du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Erreur lors du chargement des missions</p>
        </CardContent>
      </Card>
    );
  }

  if (!missions || missions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Missions du jour</CardTitle>
          <CardDescription>Aucune mission prévue aujourd'hui</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Missions du jour
        </CardTitle>
        <CardDescription>
          Suivez l'état d'avancement de vos missions en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heure</TableHead>
              <TableHead>Adresses</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Progression</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => {
              const vehicle = mission.vehicles && 
                Array.isArray(mission.vehicles) ? 
                mission.vehicles[0] : 
                (typeof mission.vehicles === 'object' ? mission.vehicles : null);

              return (
                <TableRow key={mission.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(mission.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-xs">{mission.pickup_address || 'Adresse inconnue'}</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-xs">{mission.delivery_address || 'Adresse inconnue'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vehicle ? (
                      <div className="text-xs">
                        {vehicle.brand} {vehicle.model}
                        <div className="text-muted-foreground">
                          {vehicle.licensePlate}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Non spécifié</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <MissionStatusBadge status={mission.status} />
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <Progress value={getMissionProgress(mission.status)} className="h-2" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TodayMissions;
