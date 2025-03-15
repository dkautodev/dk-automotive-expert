
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormFields } from "./components/SignUpFormFields";
import { signUpSchema, type SignUpFormData } from "./schemas/signUpSchema";
import { useSignUpSubmit } from "./hooks/useSignUpSubmit";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleSubmit } = useSignUpSubmit();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Inscription Professionnel</CardTitle>
        <CardDescription className="whitespace-nowrap overflow-hidden text-ellipsis">
          Créez votre compte professionnel pour commander vos convoyages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <SignUpFormFields
              form={form}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
            />
            
            <Button type="submit" className="w-full bg-dk-navy hover:bg-dk-blue">
              S'inscrire
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
