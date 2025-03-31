
import { Card, CardContent } from "@/components/ui/card";

interface DistancePriceCardProps {
  distance: number | null;
  priceHT: string | null;
  priceTTC: string | null;
}

const DistancePriceCard = ({ distance, priceHT, priceTTC }: DistancePriceCardProps) => {
  if (!distance) return null;
  
  return (
    <Card className="mt-6 shadow-md border border-green-100">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500">Distance</div>
            <div className="text-lg font-semibold">{distance} km</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Prix HT</div>
            <div className="text-lg font-semibold">{priceHT || "Calcul en cours..."} €</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500">Prix TTC</div>
            <div className="text-lg font-semibold">{priceTTC || "Calcul en cours..."} €</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistancePriceCard;
