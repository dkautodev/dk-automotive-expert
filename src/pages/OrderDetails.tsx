
import { Navigate, useLocation } from "react-router-dom";
import { OrderState } from "@/types/order";
import { UnifiedOrderForm } from "@/components/unified-form/UnifiedOrderForm";

const OrderDetails = () => {
  const location = useLocation();
  const orderDetails = location.state as OrderState | null;

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold p-6">Complétez votre demande</h1>
      <UnifiedOrderForm orderDetails={orderDetails} />
    </div>
  );
};

export default OrderDetails;
