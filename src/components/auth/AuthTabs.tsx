
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from './SignInForm';

const AuthTabs = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-dk-navy">Espace Professionnel</h1>
      <p className="text-center text-gray-500 mb-6">
        Connectez-vous pour accéder à votre espace client
      </p>
      <SignInForm />
    </div>
  );
};

export default AuthTabs;
