import React, { useState } from 'react';
import BookingWizard from './BookingWizard';
import BookingWizardOption2 from './BookingWizardOption2';

const BookingFlow = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('wizard1'); // 'wizard1' or 'wizard2'
  const [initialData, setInitialData] = useState(null);

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

  if (currentStep === 'wizard1') {
    return <BookingWizard onComplete={handleWizard1Complete} />;
  }

  return <BookingWizardOption2 initialData={initialData} onComplete={handleWizard2Complete} />;
};

export default BookingFlow;
