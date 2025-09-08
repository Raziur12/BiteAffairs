import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PartyPlatters from './components/PartyPlatters';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { menuService } from './services/menuService';
import { MENU_TYPES } from './utils/constants';

const App = () => {
  const [selectedMenu, setSelectedMenu] = useState(MENU_TYPES.JAIN);
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentMenuData = menuService.getMenuData(selectedMenu);

  return (
    <CartProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        
        <Box component="main">
          <Hero />
          <PartyPlatters />
          <About />
          <Testimonials />
          <Contact />
        </Box>
        
        <Footer />
      </Box>
    </CartProvider>
  );
};

export default App;
