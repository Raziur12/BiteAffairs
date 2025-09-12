import React, { useState } from 'react';
import { Box, Container, Paper, IconButton } from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import BookingStepper from './BookingStepper';
import LocationStep from './LocationStep';
import OccasionStep from './OccasionStep';
import MealTypeStep from './MealTypeStep';

const BookingWizard = ({ onComplete, onLocationSelect }) => {
  const [activeStep, setActiveStep] = useState(0);
  const wizardSteps = ['Choose Location', 'Choose Occasion', 'Meal Type'];
  const [bookingData, setBookingData] = useState({
    location: null,
    occasion: null,
    mealType: null,
    guestCount: 25,
  });

  const handleNext = () => {
    // If the current step is the Meal Type step (index 2), call onComplete
    if (activeStep === 2) {
      if (onComplete) {
        onComplete(bookingData);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateBookingData = (data) => {
    setBookingData((prevData) => ({ ...prevData, ...data }));
  };

  const steps = [
    {
      label: 'Select Event',
      component: <LocationStep onNext={handleNext} updateBookingData={updateBookingData} onLocationSelect={onLocationSelect} />,
    },
    {
      label: 'Select Menu',
      component: <OccasionStep onNext={handleNext} onBack={handleBack} updateBookingData={updateBookingData} />,
    },
    {
      label: 'Get Price',
      component: <MealTypeStep onNext={handleNext} onBack={handleBack} updateBookingData={updateBookingData} initialGuestCount={bookingData.guestCount} />,
    },
    {
      label: 'Payment',
      component: <div>Summary Step</div>,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#1e3a8a', py: 4, minHeight: '100vh' }}>
      <Container maxWidth="sm">
        <Paper elevation={12} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
            <IconButton onClick={handleBack} disabled={activeStep === 0} aria-label="Go back">
              <ArrowBack />
            </IconButton>
            <IconButton onClick={() => console.log('Close wizard')} aria-label="Close">
              <Close />
            </IconButton>
          </Box>
          <BookingStepper activeStep={activeStep} steps={wizardSteps} />
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {steps[activeStep].component}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingWizard;
