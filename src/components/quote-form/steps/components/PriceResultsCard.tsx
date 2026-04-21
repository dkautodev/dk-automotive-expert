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
    <div className="bg-green-50 border border-green-200 rounded-xl p-5 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-green-800">Résultat du calcul</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="bg-white/80 rounded-lg p-3 text-center">
          <span className="text-muted-foreground block text-xs uppercase tracking-wide">Distance</span>
          <p className="font-bold text-lg text-dk-navy">{distance} km</p>
        </div>
        <div className="bg-white/80 rounded-lg p-3 text-center">
          <span className="text-muted-foreground block text-xs uppercase tracking-wide">Prix HT</span>
          <p className="font-bold text-lg text-dk-navy">{priceHT} €</p>
        </div>
        <div className="bg-white/80 rounded-lg p-3 text-center">
          <span className="text-muted-foreground block text-xs uppercase tracking-wide">Prix TTC</span>
          <p className="font-bold text-lg text-green-600">{priceTTC} €</p>
        </div>
      </div>
      
      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex items-center gap-2 text-green-800">
          <Lightbulb className="w-4 h-4 flex-shrink-0" />
          <span>Tous frais inclus</span>
        </li>
        <li className="flex items-center gap-2 text-green-800">
          <Car className="w-4 h-4 flex-shrink-0" />
          <span>Livraison par chauffeur professionnel</span>
        </li>
        <li className="flex items-center gap-2 text-green-800">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>Assurance tous risques</span>
        </li>
      </ul>
    </div>
  );
};

export default PriceResultsCard;
