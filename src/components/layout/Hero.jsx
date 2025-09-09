import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';

const Hero = () => {

  return (
    <>
      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          minHeight: '40vh',
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden',
          position: 'relative',
          backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center',
            py: 6,
            px: { xs: 2, sm: 3 }
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Hosting Party??
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'white',
              mb: 4,
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Wow them with this party platter
          </Typography>
          
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
                borderColor: 'white',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Build Your Order
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default Hero;
