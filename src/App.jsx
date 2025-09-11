import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { Navbar, Hero, Footer } from './components/layout';
import { PartyPlatters } from './components/menu';
import { About, Contact, Testimonials } from './components/sections';
import { MenuErrorBoundary, FormErrorBoundary } from './components/common';
import { CartProvider } from './context/CartContext';
import { menuService } from './services/menuService';
import { MENU_TYPES } from './utils/constants';
import BookingFlow from './components/booking/BookingFlow';

const HomePage = ({ bookingConfig }) => (
  <>
    <Navbar />
    <Box component="main" sx={{ paddingTop: { xs: '92px', md: '48px' } }}>
      <Hero />
      <MenuErrorBoundary>
        <PartyPlatters id="menu" bookingConfig={bookingConfig} />
      </MenuErrorBoundary>
      <About />
      <Testimonials />
      <FormErrorBoundary>
        <Contact />
      </FormErrorBoundary>
    </Box>
    <Footer />
  </>
);

const App = () => {
  const [bookingConfig, setBookingConfig] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(MENU_TYPES.JAIN);
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const handleBookingComplete = (config) => {
    setBookingConfig(config);
    navigate('/home');
  };

  // Create a minimal theme that doesn't override text styles
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontWeight: 'normal',
            textTransform: 'none',
            borderRadius: '20px',
            paddingX: '16px',
            paddingY: '6px'
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', width: '100%', overflowX: 'hidden' }}>
          <Routes>
            <Route path="/" element={<BookingFlow onComplete={handleBookingComplete} />} />
            <Route path="/home" element={<HomePage bookingConfig={bookingConfig} />} />
          </Routes>
        </Box>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
