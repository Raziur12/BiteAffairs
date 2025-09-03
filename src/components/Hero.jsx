import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      id="home"
      sx={{
        minHeight: '60vh',
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
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
          py: 6
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            fontSize: { xs: '2rem', md: '3rem' }
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
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'secondary.dark',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Build Your Order
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
