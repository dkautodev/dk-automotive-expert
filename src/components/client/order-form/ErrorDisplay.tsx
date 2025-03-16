
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
  solution?: string | null;
}

export const ErrorDisplay = ({ error, solution }: ErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <div className="ml-2">
        <AlertTitle className="font-medium">Erreur</AlertTitle>
        <AlertDescription className="text-sm">
          {error}
          {solution && (
            <div className="mt-2 text-xs bg-destructive/10 p-2 rounded">
              <span className="font-medium">Solution: </span>
              {solution}
            </div>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
};
