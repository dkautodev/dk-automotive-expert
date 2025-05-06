
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";
import { useSignInForm } from "./useSignInForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Button } from "@/components/ui/button";

const SignInCard = () => {
  const { form, loading, onSubmit } = useSignInForm();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Espace Client</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace professionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showForgotPassword ? (
          <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <EmailField form={form} />
              <PasswordField form={form} />
              <SubmitButton isLoading={loading} />
              <Button 
                type="button" 
                variant="link" 
                className="w-full p-0 text-sm text-dk-blue hover:text-dk-navy"
                onClick={() => setShowForgotPassword(true)}
              >
                Mot de passe oublié ?
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        {/* Footer content without AdminLink */}
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
