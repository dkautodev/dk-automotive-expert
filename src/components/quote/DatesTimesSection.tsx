import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { OrderState } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface DatesTimesSectionProps {
  orderDetails: OrderState;
  pickupTime: string;
  deliveryTime: string;
  onPickupDateSelect: (date: Date | undefined) => void;
  onDeliveryDateSelect: (date: Date | undefined) => void;
  onPickupTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeliveryTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const DatesTimesSection = ({
  orderDetails,
  pickupTime,
  deliveryTime,
  onPickupDateSelect,
  onDeliveryDateSelect,
  onPickupTimeChange,
  onDeliveryTimeChange
}: DatesTimesSectionProps) => {
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prise en charge section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Modifier prise en charge</h3>
          <div className="flex gap-4 items-start">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !orderDetails.pickupDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {orderDetails.pickupDate ? format(orderDetails.pickupDate, "PPP", {
                  locale: fr
                }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={orderDetails.pickupDate} onSelect={onPickupDateSelect} disabled={date => date < new Date()} initialFocus locale={fr} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Input type="time" className="pl-10 w-[150px]" value={pickupTime} onChange={onPickupTimeChange} />
              
            </div>
          </div>
        </div>

        {/* Livraison section */}
        <div className="space-y-4">
          <h3 className="font-semibold">Date et heure de livraison</h3>
          <div className="flex gap-4 items-start">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !orderDetails.deliveryDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {orderDetails.deliveryDate ? format(orderDetails.deliveryDate, "PPP", {
                  locale: fr
                }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={orderDetails.deliveryDate} onSelect={onDeliveryDateSelect} disabled={date => date < (orderDetails.pickupDate || new Date())} initialFocus locale={fr} className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Input type="time" className="pl-10 w-[150px]" value={deliveryTime} onChange={onDeliveryTimeChange} />
              
            </div>
          </div>
        </div>
      </div>
    </div>;
};