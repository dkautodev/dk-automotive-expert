import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { Link } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
const AuthTabs = () => {
  return <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-dk-navy">Espace Professionnel</h1>
      
      
      <div className="mb-6 text-center">
        <Link to="/driver-auth" className="inline-flex items-center text-dk-navy hover:text-dk-blue transition-colors">
          <UserCircle2 className="mr-2 h-5 w-5" />
          Accès chauffeur
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
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>;
};
export default AuthTabs;