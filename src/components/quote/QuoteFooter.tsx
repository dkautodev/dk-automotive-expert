
import { Send, FileDown, EuroIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuoteFooterProps {
  totalPriceHT: number;
  onSubmitQuote: () => void;
  onGeneratePDF: () => void;
}

export const QuoteFooter = ({ totalPriceHT, onSubmitQuote, onGeneratePDF }: QuoteFooterProps) => {
  return (
    <div className="flex items-center justify-between gap-2 pt-4 border-t">
      <div className="flex items-center gap-2">
        <Button
          onClick={onSubmitQuote}
          className="gap-2"
          size="lg"
        >
          <Send className="h-4 w-4" />
          Envoyer votre devis
        </Button>
        <Button
          onClick={onGeneratePDF}
          variant="outline"
          className="gap-2"
          size="lg"
        >
          <FileDown className="h-4 w-4" />
          Générer votre devis
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <EuroIcon className="h-5 w-5 text-blue-500" />
        <p className="text-xl font-semibold">Prix Total HT: {totalPriceHT}€</p>
      </div>
    </div>
  );
};
