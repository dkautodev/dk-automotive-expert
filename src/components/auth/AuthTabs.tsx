
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import DriverSignUpForm from './DriverSignUpForm';

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'driver'>('signin');

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup' | 'driver')} className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="signin">Connexion</TabsTrigger>
        <TabsTrigger value="signup">Inscription Pro</TabsTrigger>
        <TabsTrigger value="driver">Chauffeur</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <SignInForm />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpForm />
      </TabsContent>
      <TabsContent value="driver">
        <DriverSignUpForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
