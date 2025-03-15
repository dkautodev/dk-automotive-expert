
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderState } from "@/types/order";

interface QuoteDetailsCardProps {
  children: React.ReactNode;
  orderNumber?: string;
}

export const QuoteDetailsCard = ({ children, orderNumber = "DEV-00000100" }: QuoteDetailsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Récapitulatif de votre devis</CardTitle>
        <div className="text-sm font-semibold text-muted-foreground">
          {orderNumber}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};
