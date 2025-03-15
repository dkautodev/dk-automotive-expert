import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, EuroIcon, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { useState } from "react";
interface OrderSummaryProps {
  pickupAddress: string;
  deliveryAddress: string;
  selectedVehicle: string;
  distance: string;
  priceHT: string;
  onShowContacts: () => void;
  getVehicleName: (id: string) => string;
  onDateUpdate: (pickup: Date | undefined, delivery: Date | undefined) => void;
  pickupDate: Date | undefined;
  deliveryDate: Date | undefined;
}
export const OrderSummary = ({
  pickupAddress,
  deliveryAddress,
  selectedVehicle,
  distance,
  priceHT,
  onShowContacts,
  getVehicleName,
  onDateUpdate,
  pickupDate,
  deliveryDate
}: OrderSummaryProps) => {
  const [pickupTime, setPickupTime] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const handlePickupDateSelect = (date: Date | undefined) => {
    onDateUpdate(date, date);
  };
  const handleDeliveryDateSelect = (date: Date | undefined) => {
    onDateUpdate(pickupDate, date);
  };
  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupTime(e.target.value);
  };
  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryTime(e.target.value);
  };
  const isNextButtonEnabled = pickupDate && deliveryDate && pickupTime && deliveryTime;
  return <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Informations du trajet
          </CardTitle>
          <div className="flex items-center gap-2 text-xl">
            <EuroIcon className="h-5 w-5" />
            <span>Prix HT: {priceHT}€</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-1">Adresse de départ</h3>
          <p className="text-gray-600">{pickupAddress}</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold mb-1">Date et heure de prise en charge</h3>
          <div className="flex gap-4 items-start">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !pickupDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pickupDate ? format(pickupDate, "PPP", {
                  locale: fr
                }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={pickupDate} onSelect={handlePickupDateSelect} disabled={date => date < new Date()} initialFocus locale={fr} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Input type="time" placeholder="Heure" className="pl-10 w-[150px]" value={pickupTime} onChange={handlePickupTimeChange} />
              
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Adresse de livraison</h3>
          <p className="text-gray-600">{deliveryAddress}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold mb-1">Date et heure de livraison</h3>
          <div className="flex gap-4 items-start">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP", {
                  locale: fr
                }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={deliveryDate} onSelect={handleDeliveryDateSelect} disabled={date => date < (pickupDate || new Date())} initialFocus locale={fr} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Input type="time" placeholder="Heure" className="pl-10 w-[150px]" value={deliveryTime} onChange={handleDeliveryTimeChange} />
              
            </div>
          </div>
        </div>

        {distance && <div>
            <h3 className="font-semibold mb-1">Distance</h3>
            <p className="text-gray-600">{distance}</p>
          </div>}
        
        <div>
          <h3 className="font-semibold mb-1">Type de véhicule</h3>
          <p className="text-gray-600">{getVehicleName(selectedVehicle)}</p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onShowContacts} disabled={!isNextButtonEnabled}>
            Suivant
          </Button>
        </div>
      </CardContent>
    </Card>;
};