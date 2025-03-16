
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { OrderState } from "@/types/order";

interface AddressesSectionProps {
  orderDetails: OrderState;
}

export const AddressesSection = ({ orderDetails }: AddressesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold">Adresses et dates</h3>
      </div>
      <div className="ml-7 space-y-4">
        <div>
          <p><span className="font-medium">Départ:</span> {orderDetails.pickupAddress}</p>
          <p><span className="font-medium">Date de prise en charge:</span> {orderDetails.pickupDate && orderDetails.pickupTime && 
            format(orderDetails.pickupDate, "d MMMM yyyy 'à' ", { locale: fr }) + orderDetails.pickupTime}
          </p>
        </div>
        <div>
          <p><span className="font-medium">Livraison:</span> {orderDetails.deliveryAddress}</p>
          <p><span className="font-medium">Date de livraison:</span> {orderDetails.deliveryDate && orderDetails.deliveryTime && 
            format(orderDetails.deliveryDate, "d MMMM yyyy 'à' ", { locale: fr }) + orderDetails.deliveryTime}
          </p>
        </div>
        <div>
          <p><span className="font-medium">Distance:</span> {orderDetails.distance}</p>
        </div>
      </div>
    </div>
  );
};
