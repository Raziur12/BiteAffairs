import React, { useState } from 'react';
import BookingWizard from './BookingWizard';
import BookingWizardOption2 from './BookingWizardOption2';

const BookingFlow = ({ onComplete, onLocationSelect }) => {
  const [currentStep, setCurrentStep] = useState('wizard1'); // 'wizard1' or 'wizard2'
  const [initialData, setInitialData] = useState(null);
  const [wizardStep, setWizardStep] = useState(0);

  const handleWizard1Complete = (data) => {
    setInitialData(data);
    setCurrentStep('wizard2');
  };

  const handleWizard2Complete = (finalData) => {
    if (onComplete) {
      const combinedData = { ...initialData, ...finalData };
      onComplete(combinedData);
    }
  };

  const handleBackToMealType = () => {
    setCurrentStep('wizard1');
    // Set the wizard to show the Meal Type step (step 2)
    setWizardStep(2);
  };

  if (currentStep === 'wizard1') {
    return <BookingWizard onComplete={handleWizard1Complete} onLocationSelect={onLocationSelect} initialStep={wizardStep} />;
  }

  return <BookingWizardOption2 initialData={initialData} onComplete={handleWizard2Complete} onBackToMealType={handleBackToMealType} />;
};

export default BookingFlow;
