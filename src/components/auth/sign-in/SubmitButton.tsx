
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-dk-navy hover:bg-dk-blue"
      disabled={isLoading}
    >
      {isLoading ? "Connexion en cours..." : "Se connecter"}
    </Button>
  );
};
