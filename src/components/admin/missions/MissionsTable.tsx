
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MissionStatusBadge } from "@/components/client/MissionStatusBadge";
import { MissionRow } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface MissionsTableProps {
  missions: MissionRow[];
}

export const MissionsTable: React.FC<MissionsTableProps> = ({ missions }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Adresse départ</TableHead>
          <TableHead>Adresse livraison</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {missions.map((mission) => {
          const client = mission.clientProfile as any;
          const vehicleInfo = mission.vehicle_info as any || {};
          
          return (
            <TableRow key={mission.id}>
              <TableCell className="font-medium">
                {mission.mission_number || "Non attribué"}
              </TableCell>
              <TableCell>
                {client?.company_name || `${client?.first_name || ''} ${client?.last_name || ''}` || "Non spécifié"}
              </TableCell>
              <TableCell>{formatDate(mission.created_at)}</TableCell>
              <TableCell>
                {vehicleInfo ? (
                  <span>
                    {vehicleInfo.brand || ''} {vehicleInfo.model || ''}
                  </span>
                ) : (
                  "Non spécifié"
                )}
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={mission.pickup_address}>
                {mission.pickup_address}
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={mission.delivery_address}>
                {mission.delivery_address}
              </TableCell>
              <TableCell>
                <MissionStatusBadge status={mission.status} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
