
import { Check } from "lucide-react";

interface DistanceDisplayProps {
  distance: string | null;
  duration: string | null;
}

export const DistanceDisplay = ({ distance, duration }: DistanceDisplayProps) => {
  if (!distance || !duration) return null;
  
  return (
    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-100 flex items-center">
      <Check className="h-4 w-4 mr-2" />
      <div>
        Distance: <span className="font-semibold">{distance}</span> - 
        Durée estimée: <span className="font-semibold">{duration}</span>
      </div>
    </div>
  );
};
