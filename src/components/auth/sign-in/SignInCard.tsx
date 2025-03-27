
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { SubmitButton } from "./SubmitButton";
import { AdminLink } from "./AdminLink";
import { useSignInForm } from "./useSignInForm";

const SignInCard = () => {
  const { form, isLoading, onSubmit } = useSignInForm();

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <CardTitle>Espace Client</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace professionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EmailField form={form} />
            <PasswordField form={form} />
            <SubmitButton isLoading={isLoading} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <AdminLink />
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
