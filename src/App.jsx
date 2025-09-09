import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Navbar, Hero, Footer } from './components/layout';
import { PartyPlatters } from './components/menu';
import { About, Contact, Testimonials } from './components/sections';
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
          <PartyPlatters id="menu" />
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
