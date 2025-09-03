import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Phone,
  LocationOn,
  Restaurant
} from '@mui/icons-material';
import LocationSelector from './LocationSelector';
import { locationService } from '../services/locationService';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => 
    locationService.getSavedLocation() || locationService.getDefaultLocation()
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    locationService.saveLocation(location);
  };

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Menu', href: '#menu' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
        🍽️ Bite Affair
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemText 
              primary={item.label}
              sx={{ textAlign: 'center', py: 1 }}
            />
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Phone />}
              href="tel:+919211570030"
              fullWidth
            >
              Call Now
            </Button>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: '#1e3a8a',
          color: 'white',
          boxShadow: '0 2px 20px rgba(0,0,0,0.2)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Restaurant sx={{ color: 'white', fontSize: 32 }} />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  fontFamily: 'Playfair Display',
                }}
              >
                Bite Affair
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    href={item.href}
                    sx={{ 
                      color: 'white',
                      fontWeight: 500,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                <Button
                  variant="text"
                  startIcon={<LocationOn sx={{ color: 'white', fontSize: 20 }} />}
                  onClick={() => setLocationSelectorOpen(true)}
                  sx={{ 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {selectedLocation?.name || 'Gurugram'}
                </Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                  <Phone sx={{ color: 'white', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    +91 92115 70030
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Location Selector Modal */}
      <LocationSelector
        open={locationSelectorOpen}
        onClose={() => setLocationSelectorOpen(false)}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
};

export default Navbar;
