
import { Form } from '@/components/ui/form';
import { useQuoteForm } from './hooks/useQuoteForm';
import MissionTypeStep from './steps/MissionTypeStep';
import AddressVehicleStep from './steps/AddressVehicleStep';
import VehicleDetailsStep from './steps/VehicleDetailsStep';
import ContactStep from './steps/ContactStep';
import QuoteFormProgress from './QuoteFormProgress';

const QuoteForm = () => {
  const {
    form,
    step,
    loading,
    distance,
    priceHT,
    priceTTC,
    isPerKm,
    nextStep,
    prevStep,
    onSubmit
  } = useQuoteForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <MissionTypeStep 
          form={form} 
          onNext={(data) => {
            console.log("Mission type selected:", data);
            nextStep(data);
          }} 
        />;
      case 2:
        return <AddressVehicleStep 
          form={form}
          onNext={(data) => {
            console.log("Address and vehicle data:", data);
            nextStep(data);
          }}
          onPrevious={prevStep}
        />;
      case 3:
        return <VehicleDetailsStep 
          form={form}
          onNext={(data) => {
            console.log("Vehicle details:", data);
            nextStep(data);
          }}
          onPrevious={prevStep}
        />;
      case 4:
        return <ContactStep 
          form={form}
          onSubmit={(data) => {
            console.log("Contact info and submission:", data);
            onSubmit(data);
          }}
          onPrevious={prevStep}
          loading={loading}
          priceInfo={{
            distance: distance ? `${distance} km` : "Non calculée",
            priceHT: priceHT || "Non calculé",
            priceTTC: priceTTC || "Non calculé",
            isPerKm: isPerKm
          }}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <div className="space-y-8">
          <QuoteFormProgress currentStep={step} />
          {renderStep()}
        </div>
      </Form>
    </div>
  );
};

export default QuoteForm;
