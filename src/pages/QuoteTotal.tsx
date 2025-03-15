
import { useLocation, Navigate } from "react-router-dom";
import { OrderState } from "@/types/order";
import { QuoteActions } from "@/components/quote/QuoteActions";
import { QuoteDetailsCard } from "@/components/quote/QuoteDetailsCard";
import { QuoteContent } from "@/components/quote/QuoteContent";
import { useState } from "react";

const QuoteTotal = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(location.state as OrderState | null);

  if (!orderDetails) {
    return <Navigate to="/dashboard/client" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50 shadow-sm">
        <div className="container py-4">
          <QuoteActions />
        </div>
      </div>
      
      <div className="container pt-20 pb-6">
        <QuoteDetailsCard>
          <QuoteContent 
            orderDetails={orderDetails} 
            setOrderDetails={setOrderDetails}
          />
        </QuoteDetailsCard>
      </div>
    </div>
  );
};

export default QuoteTotal;
