import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CalendarToday, Restaurant, Description, Payment } from '@mui/icons-material';

const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundColor: theme.palette.primary.main,
  }),
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <CalendarToday />,
    2: <Restaurant />,
    3: <Description />,
    4: <Payment />,
  };

  return (
    <CustomStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </CustomStepIconRoot>
  );
}

const BookingStepper = ({ activeStep, steps }) => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', bgcolor: 'white' }}>
       <Box sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}>
          <img 
            src="/logo/502068640_17845720176490350_3307957330610653706_n.jpg" 
            alt="Bite Affair Logo" 
            style={{
              height: '140px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Box>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps && steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default BookingStepper;
