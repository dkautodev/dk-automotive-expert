
import { Card } from "@/components/ui/card";

interface DistancePriceCardProps {
  distance: number | null;
  priceHT: string | null;
  priceTTC: string | null;
  isPerKm?: boolean;
}

const DistancePriceCard = ({ 
  distance, 
  priceHT, 
  priceTTC,
  isPerKm = false
}: DistancePriceCardProps) => {
  if (!distance) {
    return null;
  }

  return (
    <Card className="p-4 bg-secondary/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">Distance</h3>
          <p className="text-2xl font-bold">{distance} km</p>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">Prix HT</h3>
          <p className="text-2xl font-bold">
            {priceHT || "-"} €
            {isPerKm && <span className="text-sm block text-muted-foreground">({(parseFloat(priceHT || '0') / distance).toFixed(2)} €/km)</span>}
          </p>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium mb-1">Prix TTC</h3>
          <p className="text-2xl font-bold">
            {priceTTC || "-"} €
            {isPerKm && <span className="text-sm block text-muted-foreground">({(parseFloat(priceTTC || '0') / distance).toFixed(2)} €/km)</span>}
          </p>
        </div>
      </div>
      
      <div className="mt-2 text-center text-sm text-muted-foreground">
        {isPerKm 
          ? "Prix calculé au kilomètre" 
          : "Prix forfaitaire"
        }
      </div>
    </Card>
  );
};

export default DistancePriceCard;
