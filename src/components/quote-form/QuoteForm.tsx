
import { Form } from '@/components/ui/form';
import { useQuoteForm } from './hooks/useQuoteForm';
import NewAddressVehicleStep from './steps/NewAddressVehicleStep';
import NewVehicleDetailsStep from './steps/NewVehicleDetailsStep';
import NewContactStep from './steps/NewContactStep';
import QuoteFormProgress from './QuoteFormProgress';

const QuoteForm = () => {
  const {
    form,
    step,
    loading,
    distance,
    priceHT,
    priceTTC,
    setDistance,
    setPriceHT,
    setPriceTTC,
    nextStep,
    prevStep,
    onSubmit
  } = useQuoteForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <NewAddressVehicleStep 
          form={form}
          onNext={nextStep}
          distance={distance}
          priceHT={priceHT}
          priceTTC={priceTTC}
          setDistance={setDistance}
          setPriceHT={setPriceHT}
          setPriceTTC={setPriceTTC}
        />;
      case 2:
        return <NewVehicleDetailsStep 
          form={form}
          onNext={nextStep}
          onPrevious={prevStep}
        />;
      case 3:
        return <NewContactStep 
          form={form}
          onSubmit={onSubmit}
          onPrevious={prevStep}
          loading={loading}
          priceInfo={{
            distance: distance ? `${distance} km` : "Non calculée",
            priceHT: priceHT || "Non calculé",
            priceTTC: priceTTC || "Non calculé"
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
