import { CheckCircle2, Lightbulb, Car, Shield } from 'lucide-react';

interface PriceResultsCardProps {
  distance: number | null;
  priceHT: string | null;
  priceTTC: string | null;
}

const PriceResultsCard = ({
  distance,
  priceHT,
  priceTTC
}: PriceResultsCardProps) => {
  if (!distance || !priceHT || !priceTTC) return null;

  return (
    <div className="bg-green-50/50 border border-green-100 rounded-lg p-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-green-600" />
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-tight">Résultat du calcul</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-white/60 rounded-md p-2.5 text-center border border-green-100/50">
          <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-medium">Distance</span>
          <p className="font-bold text-base text-dk-navy">{distance} km</p>
        </div>
        <div className="bg-white/60 rounded-md p-2.5 text-center border border-green-100/50">
          <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-medium">Prix HT</span>
          <p className="font-bold text-base text-dk-navy">{priceHT} €</p>
        </div>
        <div className="bg-white/60 rounded-md p-2.5 text-center border border-green-100/50">
          <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-medium">Prix TTC</span>
          <p className="font-bold text-base text-green-600">{priceTTC} €</p>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5 text-green-700 text-[11px] font-medium">
          <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Tous frais inclus</span>
        </div>
        <div className="flex items-center gap-1.5 text-green-700 text-[11px] font-medium">
          <Car className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Chauffeur pro</span>
        </div>
        <div className="flex items-center gap-1.5 text-green-700 text-[11px] font-medium">
          <Shield className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Assurance incluse</span>
        </div>
      </div>
    </div>
  );
};

export default PriceResultsCard;
