import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { Cake, House, Celebration, Group } from '@mui/icons-material'; // Using placeholder icons

const OccasionStep = ({ onNext, updateBookingData }) => {
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const occasions = [
    { id: 'birthday', name: 'Birthday', icon: <Cake sx={{ fontSize: 40 }} /> },
    { id: 'house_party', name: 'House Party', icon: <House sx={{ fontSize: 40 }} /> },
    { id: 'pooja', name: 'Pooja', icon: <Celebration sx={{ fontSize: 40 }} /> },
    { id: 'pre_wedding', name: 'Pre-Wedding', icon: <Group sx={{ fontSize: 40 }} /> },
    { id: 'office_party', name: 'Office Party', icon: <Group sx={{ fontSize: 40 }} /> },
    { id: 'others', name: 'Others', icon: <Celebration sx={{ fontSize: 40 }} /> },
  ];

  const handleOccasionSelect = (occasion) => {
    setSelectedOccasion(occasion.id);
    updateBookingData({ occasion: occasion.name });
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        Choose Occasion
      </Typography>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {occasions.map((occasion) => (
          <Grid item xs={6} key={occasion.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: selectedOccasion === occasion.id ? 'primary.main' : 'grey.300',
                borderWidth: 2,
                transform: selectedOccasion === occasion.id ? 'scale(1.05)' : 'none',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardActionArea onClick={() => handleOccasionSelect(occasion)} sx={{ p: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ mb: 1, color: selectedOccasion === occasion.id ? 'primary.main' : 'text.secondary' }}>
                    {occasion.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {occasion.name}
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

export default OccasionStep;
