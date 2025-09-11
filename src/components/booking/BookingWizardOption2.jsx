import React, { useState } from 'react';
import { Box, Container, Paper, IconButton } from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import BookingStepper from './BookingStepper';
import EventDetailsStep from './EventDetailsStep';

const BookingWizardOption2 = ({ initialData, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState(initialData || {
    city: '',
    occasion: '',
    eventDate: '',
    deliveryTime: '',
    menu: '',
    vegGuest: 5,
    nonVegGuest: 5
  });

  const handleNext = () => {
    if (activeStep === 0) { // This is the EventDetailsStep
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
      component: <EventDetailsStep onNext={handleNext} updateBookingData={updateBookingData} />,
    },
    {
      label: 'Select Menu',
      component: <div>Menu Selection Step</div>,
    },
    {
      label: 'Get Price',
      component: <div>Price Calculation Step</div>,
    },
    {
      label: 'Payment',
      component: <div>Payment Step</div>,
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
          <BookingStepper activeStep={activeStep} steps={steps.map(s => s.label)} />
          <Box sx={{ p: { xs: 2, sm: 4 } }}>
            {steps[activeStep].component}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingWizardOption2;
