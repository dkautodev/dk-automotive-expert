
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MissionRow } from "@/types/database";
import MissionRouteMap from "../maps/MissionRouteMap";
import { extractAddressParts } from "@/utils/addressUtils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, MapPin, Truck } from "lucide-react";

interface MissionRouteVisualizationProps {
  mission: MissionRow;
}

export const MissionRouteVisualization: React.FC<MissionRouteVisualizationProps> = ({ mission }) => {
  const [activeTab, setActiveTab] = useState<string>("carte");
  
  const pickupDate = mission.pickup_date 
    ? format(new Date(mission.pickup_date), "EEEE d MMMM yyyy", { locale: fr })
    : "Non spécifiée";
    
  const deliveryDate = mission.delivery_date 
    ? format(new Date(mission.delivery_date), "EEEE d MMMM yyyy", { locale: fr })
    : "Non spécifiée";
    
  const pickupTime = mission.pickup_time || "Non spécifiée";
  const deliveryTime = mission.delivery_time || "Non spécifiée";
  
  const { city: pickupCity, postalCode: pickupPostalCode } = extractAddressParts(mission.pickup_address);
  const { city: deliveryCity, postalCode: deliveryPostalCode } = extractAddressParts(mission.delivery_address);
  
  const vehicleInfo = mission.vehicle_info as any || {};
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du trajet</CardTitle>
        <CardDescription>
          Mission {mission.mission_number}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="carte" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="carte">Carte</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
          </TabsList>
          
          <TabsContent value="carte" className="pt-4">
            <MissionRouteMap 
              originAddress={mission.pickup_address}
              destinationAddress={mission.delivery_address}
              height="400px"
            />
          </TabsContent>
          
          <TabsContent value="details" className="pt-4">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    <h3 className="font-semibold">Adresse de départ</h3>
                  </div>
                  <p className="text-sm">{mission.pickup_address}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{pickupDate}</span>
                    </div>
                    {mission.pickup_time && (
                      <span>à {mission.pickup_time}</span>
                    )}
                  </div>
                </div>
                
                <div className="hidden md:flex items-center">
                  <div className="h-[2px] w-16 bg-muted-foreground/30 rounded-full relative">
                    <div className="absolute -top-1 -right-2">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="h-5 w-5" />
                    <h3 className="font-semibold">Adresse de livraison</h3>
                  </div>
                  <p className="text-sm">{mission.delivery_address}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{deliveryDate}</span>
                    </div>
                    {mission.delivery_time && (
                      <span>à {mission.delivery_time}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Informations sur le véhicule</h3>
                <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Marque</p>
                    <p className="font-medium">{vehicleInfo.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Modèle</p>
                    <p className="font-medium">{vehicleInfo.model || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Année</p>
                    <p className="font-medium">{vehicleInfo.year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Immatriculation</p>
                    <p className="font-medium">{vehicleInfo.licensePlate || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Distance et durée</h3>
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium">{mission.distance || 'Non calculée'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Prix</p>
                    <p className="font-medium">{mission.price_ttc ? `${mission.price_ttc.toFixed(2)}€` : 'Non défini'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MissionRouteVisualization;
