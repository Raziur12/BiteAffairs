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
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Phone,
  KeyboardArrowDown,
  Facebook,
  Instagram,
  YouTube,
  WhatsApp
} from '@mui/icons-material';
import { locationService } from '../../services/locationService';
import { LOCATIONS } from '../../utils/constants';


const Navbar = ({ selectedLocation: locationFromApp }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationSelectorOpen, setLocationSelectorOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(() => 
    locationFromApp || locationService.getSavedLocation() || locationService.getDefaultLocation()
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

  const handleLocationChange = (event) => {
    const locationName = event.target.value;
    const location = LOCATIONS.find(loc => loc.name === locationName);
    if (location) {
      handleLocationSelect(location);
    }
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <Box sx={{
          bgcolor: 'white',
          borderRadius: 1,
          p: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
      </Box>
      
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemText 
              primary={item.label}
              sx={{ textAlign: 'center', py: 1 }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Main navbar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: '#1e3a8a',
          color: 'white',
          boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
          width: '100%',
          overflow: 'hidden',
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 3 }, width: '100%', maxWidth: '100%' }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 0.5, minHeight: '48px', px: 0, width: '100%' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Box sx={{
                bgcolor: 'white',
                borderRadius: 1,
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/logo/502068640_17845720176490350_3307957330610653706_n.jpg" 
                  alt="Bite Affair Logo" 
                  style={{
                    height: '28px',
                    width: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'center'
                  }}
                />
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    href={item.href}
                    aria-label={`Navigate to ${item.label} section`}
                    sx={{ 
                      color: 'white',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                <Button
                  onClick={() => setLocationSelectorOpen(true)}
                  aria-label={`Current location: ${locationFromApp || selectedLocation?.name || 'Gurugram'}. Click to change location`}
                  sx={{
                    color: 'white',
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {locationFromApp || selectedLocation?.name || 'Gurugram'}
                  
                </Button>
              </Box>
            )}

            {/* Mobile - Center Location and Right Menu */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setLocationSelectorOpen(true)}
                  sx={{
                    color: 'white',
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    minWidth: '90px',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {locationFromApp || selectedLocation?.name || 'Gurugram'}
                  <KeyboardArrowDown />
                </Button>

                <IconButton
                  color="inherit"
                  aria-label="Open navigation menu"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile contact bar - below navbar */}
      {isMobile && (
        <Box sx={{ 
          bgcolor: 'white', 
          color: '#1e3a8a',
          py: 1,
          borderBottom: '1px solid #e0e0e0',
          position: 'fixed',
          top: '48px',
          left: 0,
          right: 0,
          zIndex: 1099
        }}>
          <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 16, color: '#1e3a8a' }} />
                <Typography variant="body2" sx={{ color: '#1e3a8a' }}>
                  +91 92115 70030
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Facebook sx={{ fontSize: 20, cursor: 'pointer', color: '#1e3a8a' }} />
                <Instagram sx={{ fontSize: 20, cursor: 'pointer', color: '#1e3a8a' }} />
                <YouTube sx={{ fontSize: 20, cursor: 'pointer', color: '#1e3a8a' }} />
                <WhatsApp sx={{ fontSize: 20, cursor: 'pointer', color: '#1e3a8a' }} />
              </Box>
            </Box>
          </Container>
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Location Selector Modal */}
      
    </>
  );
};

export default Navbar;
