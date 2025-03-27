
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from './SignInForm';
import DriverSignUpForm from './DriverSignUpForm';
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const DriverAuthTabs = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-dk-navy">Espace Chauffeur</h1>
      <p className="text-center text-gray-500 mb-6">
        Connectez-vous ou inscrivez-vous pour accéder à votre espace chauffeur
      </p>
      
      <div className="mb-6 text-center">
        <Link to="/auth" className="inline-flex items-center text-dk-navy hover:text-dk-blue transition-colors">
          <Briefcase className="mr-2 h-5 w-5" />
          Accès client professionnel
        </Link>
      </div>
      
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signin">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <DriverSignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverAuthTabs;
