
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-2">
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
  );
};

export default AuthTabs;
