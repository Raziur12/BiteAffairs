import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { locationService } from '../../services/locationService';

const LocationStep = ({ onNext, updateBookingData }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const locations = locationService.getAvailableLocations();

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.id);
    updateBookingData({ location: location.name });
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
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        Choose Your Location
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a location to view available services
      </Typography>
      <Grid container spacing={2}>
        {locations.map((location) => (
          <Grid item xs={6} key={location.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: selectedLocation === location.id ? 'primary.main' : 'grey.300',
                borderWidth: 2,
                transform: selectedLocation === location.id ? 'scale(1.05)' : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardActionArea onClick={() => handleLocationSelect(location)} sx={{ p: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {locationIcons[location.id] || '📍'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
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
