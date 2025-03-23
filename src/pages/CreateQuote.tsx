
import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateQuote = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard/client">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au tableau de bord
          </Button>
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dk-navy">Demande de devis</h1>
        <p className="text-gray-600 mt-2">
          Remplissez le formulaire ci-dessous pour obtenir un devis personnalisé pour votre convoyage de véhicule.
        </p>
      </div>
      
      <QuoteForm />
    </div>
  );
};

export default CreateQuote;
