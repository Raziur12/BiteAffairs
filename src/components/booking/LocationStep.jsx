import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { locationService } from '../../services/locationService';

const LocationStep = ({ onNext, updateBookingData, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const locations = locationService.getAvailableLocations();

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.id);
    updateBookingData({ location: location.name });
    if (onLocationSelect) {
      onLocationSelect(location.name);
    }
    // Automatically move to the next step after a short delay
    setTimeout(() => {
      onNext();
    }, 300);
  };

  const locationIcons = {
    delhi: '🏛️',
    gurugram: '🏢',
    noida: '⚙️',
    faridabad: '🏭',
    ghaziabad: '🏗️',
  };

  return (
    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          mb: { xs: 0.5, sm: 1 },
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Choose Your Location
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mb: { xs: 2, sm: 4 },
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        Select a location to view available services
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 1.5, sm: 2 }} 
        sx={{ 
          flex: 1,
          alignContent: 'flex-start',
          maxHeight: { xs: 'calc(100vh - 300px)', sm: 'none' }
        }}
      >
        {locations.map((location) => (
          <Grid item xs={6} key={location.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                borderColor: selectedLocation === location.id ? 'primary.main' : 'grey.300',
                borderWidth: 2,
                transform: selectedLocation === location.id ? 'scale(1.02)' : 'none',
                transition: 'all 0.2s ease-in-out',
                height: { xs: '80px', sm: '120px' },
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 2
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleLocationSelect(location)} 
                sx={{ 
                  p: { xs: 1, sm: 2 },
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ p: 0, textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    {locationIcons[location.id] || '📍'}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: { xs: '0.875rem', sm: '1.125rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {location.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LocationStep;
