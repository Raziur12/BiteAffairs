import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close,
  LocationOn,
  CheckCircle,
  Schedule,
  AccountBalance,
  Business,
  Engineering,
  Factory,
  Settings
} from '@mui/icons-material';
import { LOCATIONS, COMPANY_INFO } from "../../utils/constants";

const LocationSelector = ({ open, onClose, selectedLocation, onLocationSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLocationSelect = (location) => {
    if (location.available) {
      onLocationSelect(location);
      onClose();
    }
  };

  const getLocationIcon = (locationId) => {
    const iconMap = {
      'delhi': AccountBalance,
      'gurugram': Business,
      'noida': Engineering,
      'faridabad': Factory,
      'ghaziabad': Settings
    };
    return iconMap[locationId] || Business;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          minHeight: isMobile ? '100vh' : 'auto'
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'white',
          color: 'black',
          textAlign: 'center',
          position: 'relative',
          py: 4,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'gray'
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            bgcolor: 'white',
            borderRadius: 1,
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1
          }}>
            <img 
              src="/logo/502068640_17845720176490350_3307957330610653706_n.jpg" 
              alt="Bite Affair Logo" 
              style={{
                height: '120px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ color: 'black', fontWeight: 600 }}>
            Choose Your Location
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', fontSize: '0.875rem' }}>
            Select a location to view available services
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'white', pt: 3 }}>
        <Grid container spacing={2}>
          {LOCATIONS.map((location) => (
            <Grid item xs={6} sm={4} key={location.id}>
              <Card
                sx={{
                  cursor: location.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: location.available ? 1 : 0.6,
                  position: 'relative',
                  border: selectedLocation?.id === location.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: selectedLocation?.id === location.id ? '#f3f7ff' : 'white',
                  '&:hover': location.available ? {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  } : {}
                }}
                onClick={() => handleLocationSelect(location)}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    py: 2.5,
                    px: 2,
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {/* Location Icon */}
                  <Box sx={{ mb: 0.5, color: '#1976d2', display: 'flex', justifyContent: 'center' }}>
                    {React.createElement(getLocationIcon(location.id), { 
                      sx: { fontSize: 32 }
                    })}
                  </Box>
                  
                  {/* Location Name */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: location.available ? '#333' : 'text.disabled',
                      fontSize: '0.8rem'
                    }}
                  >
                    {location.name}
                  </Typography>
                  
                  {/* Selected Indicator */}
                  {selectedLocation?.id === location.id && (
                    <CheckCircle
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'primary.main',
                        fontSize: 20
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Current Selection */}
        {selectedLocation && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.200'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOn sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Selected Location: {selectedLocation.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delivery Time: {selectedLocation.deliveryTime}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Info Message */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'info.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'info.200'
          }}
        >
          <Typography variant="body2" color="info.main" sx={{ textAlign: 'center' }}>
            💡 We're expanding to more locations soon! Stay tuned for updates.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
