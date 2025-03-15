
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SuccessMessage = () => {
  return (
    <Alert className="bg-[#F2FCE2] border-green-200">
      <AlertTitle className="text-2xl font-bold text-[#40B058] mb-4">
        NOUS AVONS BIEN REÇU VOTRE DEMANDE DE DEVIS.
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p className="text-blue-700">
          Pour toute question, n'hésitez pas à nous contacter à l'adresse suivante : {" "}
          <a href="mailto:dkautomotive70@gmail.com" className="underline">
            dkautomotive70@gmail.com
          </a>
        </p>
        <p className="text-gray-700 text-center mt-4">
          En vous remerciant de votre confiance.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default SuccessMessage;
