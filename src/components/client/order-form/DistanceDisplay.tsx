
interface DistanceDisplayProps {
  distance: string | null;
  duration: string | null;
}

export const DistanceDisplay = ({ distance, duration }: DistanceDisplayProps) => {
  if (!distance || !duration) return null;
  
  return (
    <div className="text-sm text-gray-600">
      Distance: {distance} - Durée estimée: {duration}
    </div>
  );
};
