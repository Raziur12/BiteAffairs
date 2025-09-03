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
  Schedule
} from '@mui/icons-material';
import { LOCATIONS, COMPANY_INFO } from '../utils/constants';

const LocationSelector = ({ open, onClose, selectedLocation, onLocationSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLocationSelect = (location) => {
    if (location.available) {
      onLocationSelect(location);
      onClose();
    }
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
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          py: 3
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'Playfair Display' }}>
            🍽️ {COMPANY_INFO.NAME}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Choose Your Location
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Select a location to view available services
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: 'grey.50' }}>
        <Grid container spacing={2}>
          {LOCATIONS.map((location) => (
            <Grid item xs={6} sm={4} key={location.id}>
              <Card
                sx={{
                  cursor: location.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: location.available ? 1 : 0.6,
                  position: 'relative',
                  '&:hover': location.available ? {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  } : {},
                  border: selectedLocation?.id === location.id ? 2 : 0,
                  borderColor: selectedLocation?.id === location.id ? 'primary.main' : 'transparent'
                }}
                onClick={() => handleLocationSelect(location)}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    px: 2,
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  {/* Location Icon */}
                  <Typography variant="h2" sx={{ mb: 1 }}>
                    {location.icon}
                  </Typography>
                  
                  {/* Location Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: location.available ? 'text.primary' : 'text.disabled'
                    }}
                  >
                    {location.name}
                  </Typography>
                  
                  {/* Delivery Time / Status */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {location.available ? (
                      <>
                        <Schedule sx={{ fontSize: 16, color: 'success.main' }} />
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                          {location.deliveryTime}
                        </Typography>
                      </>
                    ) : (
                      <Chip
                        label={location.deliveryTime}
                        size="small"
                        color="default"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
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
