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
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  Menu as MenuIcon,
  Phone,
  LocationOn,
  Restaurant,
  KeyboardArrowDown,
  Facebook,
  Instagram,
  YouTube,
  WhatsApp
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
              height: '28px',
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
        position="sticky" 
        sx={{ 
          bgcolor: '#1e3a8a',
          color: 'white',
          boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 3 }, width: '100%', maxWidth: '100%' }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '64px', px: 0, width: '100%' }}>
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
                    height: '32px',
                    width: 'auto',
                    objectFit: 'contain'
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
                
                <FormControl size="small">
                  <Select
                    value={selectedLocation?.name || 'Gurugram'}
                    sx={{
                      color: 'white',
                      fontSize: '0.9rem',
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '.MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}
                    IconComponent={KeyboardArrowDown}
                  >
                    <MenuItem value="Gurugram">Gurugram</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Noida">Noida</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Mobile - Center Location and Right Menu */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                <FormControl size="small">
                  <Select
                    value={selectedLocation?.name || 'Gurugram'}
                    sx={{
                      color: 'white',
                      fontSize: '0.85rem',
                      minWidth: '90px',
                      '.MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '.MuiSvgIcon-root': {
                        color: 'white'
                      }
                    }}
                    IconComponent={KeyboardArrowDown}
                  >
                    <MenuItem value="Gurugram">Gurugram</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Noida">Noida</MenuItem>
                  </Select>
                </FormControl>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  sx={{ p: 1 }}
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
          borderBottom: '1px solid #e0e0e0'
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
