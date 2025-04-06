
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, EuroIcon, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input";

interface OrderSummaryProps {
  pickupAddress: string;
  deliveryAddress: string;
  distance: string;
  priceHT: string;
  onShowContacts: () => void;
  getVehicleName: (id: string) => string;
  onDateTimeUpdate: (pickup: Date | undefined, delivery: Date | undefined, pickupTime: string, deliveryTime: string) => void;
  pickupDate: Date | undefined;
  deliveryDate: Date | undefined;
  pickupTime: string;
  deliveryTime: string;
  selectedVehicleType?: string;
}

export const OrderSummary = ({
  pickupAddress,
  deliveryAddress,
  distance,
  priceHT,
  onShowContacts,
  getVehicleName,
  onDateTimeUpdate,
  pickupDate,
  deliveryDate,
  pickupTime,
  deliveryTime,
  selectedVehicleType
}: OrderSummaryProps) => {
  const quoteNumber = "DEV-00000100";

  const handlePickupDateSelect = (date: Date | undefined) => {
    onDateTimeUpdate(date, deliveryDate, pickupTime, deliveryTime);
  };

  const handleDeliveryDateSelect = (date: Date | undefined) => {
    onDateTimeUpdate(pickupDate, date, pickupTime, deliveryTime);
  };

  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateTimeUpdate(pickupDate, deliveryDate, e.target.value, deliveryTime);
  };

  const handleDeliveryTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateTimeUpdate(pickupDate, deliveryDate, pickupTime, e.target.value);
  };

  const isNextButtonEnabled = pickupDate && deliveryDate && pickupTime && deliveryTime;

  return <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Informations du trajet
        </CardTitle>
        <div className="flex flex-col items-end gap-1">
          <div className="text-sm font-medium text-muted-foreground">
            {quoteNumber}
          </div>
          <div className="flex items-center gap-2 text-xl">
            <EuroIcon className="h-5 w-5" />
            <span>Prix HT: {priceHT}€</span>
          </div>
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
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !pickupDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pickupDate ? format(pickupDate, "PPP", {
                    locale: fr
                  }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={pickupDate} 
                  onSelect={handlePickupDateSelect} 
                  disabled={(date) => date < new Date()} 
                  initialFocus 
                  locale={fr} 
                  className={cn("p-3 pointer-events-auto")} 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 relative">
            <Input 
              type="time" 
              placeholder="Heure" 
              className="pl-10 w-full" 
              value={pickupTime} 
              onChange={handlePickupTimeChange} 
            />
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-1">Adresse de livraison</h3>
        <p className="text-gray-600">{deliveryAddress}</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold mb-1">Date et heure de livraison</h3>
        <div className="grid grid-cols-2 gap-4 items-start">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP", {
                    locale: fr
                  }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  mode="single" 
                  selected={deliveryDate} 
                  onSelect={handleDeliveryDateSelect} 
                  disabled={(date) => date < (pickupDate || new Date())} 
                  initialFocus 
                  locale={fr} 
                  className={cn("p-3 pointer-events-auto")} 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-1 relative">
            <Input 
              type="time" 
              placeholder="Heure" 
              className="pl-10 w-full" 
              value={deliveryTime} 
              onChange={handleDeliveryTimeChange} 
            />
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {distance && <div>
          <h3 className="font-semibold mb-1">Distance</h3>
          <p className="text-gray-600">{distance}</p>
        </div>}
      
      <div>
        <h3 className="font-semibold mb-1">Type de véhicule</h3>
        <p className="text-gray-600">
          {selectedVehicleType ? getVehicleName(selectedVehicleType) : "Aucun véhicule sélectionné"}
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onShowContacts} disabled={!isNextButtonEnabled}>
          Suivant
        </Button>
      </div>
    </CardContent>
  </Card>;
};
