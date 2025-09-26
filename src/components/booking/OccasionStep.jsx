import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { Cake, House, Celebration, Group } from '@mui/icons-material'; // Using placeholder icons

const OccasionStep = ({ onNext, updateBookingData }) => {
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const occasions = [
    { id: 'birthday', name: 'Birthday', icon: <Cake sx={{ fontSize: { xs: 28, sm: 40 } }} /> },
    { id: 'house_party', name: 'House Party', icon: <House sx={{ fontSize: { xs: 28, sm: 40 } }} /> },
    { id: 'pooja', name: 'Pooja', icon: <Celebration sx={{ fontSize: { xs: 28, sm: 40 } }} /> },
    { id: 'pre_wedding', name: 'Pre-Wedding', icon: <Group sx={{ fontSize: { xs: 28, sm: 40 } }} /> },
    { id: 'office_party', name: 'Office Party', icon: <Group sx={{ fontSize: { xs: 28, sm: 40 } }} /> },
    { id: 'others', name: 'Others', icon: <Celebration sx={{ fontSize: { xs: 28, sm: 40 } }} /> },
  ];

  const handleOccasionSelect = (occasion) => {
    setSelectedOccasion(occasion.id);
    updateBookingData({ occasion: occasion.name });
    setTimeout(() => {
      onNext();
    }, 300);
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
        Choose Occasion
      </Typography>
      <Grid 
        container 
        spacing={{ xs: 1.5, sm: 2 }} 
        sx={{ 
          mt: { xs: 1, sm: 4 },
          flex: 1,
          alignContent: 'flex-start',
          maxHeight: { xs: 'calc(100vh - 280px)', sm: 'none' }
        }}
      >
        {occasions.map((occasion) => (
          <Grid item xs={6} key={occasion.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                borderColor: selectedOccasion === occasion.id ? 'primary.main' : 'grey.300',
                borderWidth: 2,
                transform: selectedOccasion === occasion.id ? 'scale(1.02)' : 'none',
                transition: 'all 0.2s ease-in-out',
                height: { xs: '75px', sm: '110px' },
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 2
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleOccasionSelect(occasion)} 
                sx={{ 
                  p: { xs: 1, sm: 2 },
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ p: 0, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      mb: { xs: 0.5, sm: 1 }, 
                      color: selectedOccasion === occasion.id ? 'primary.main' : 'text.secondary' 
                    }}
                  >
                    {occasion.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: { xs: '0.8rem', sm: '1.125rem' },
                      lineHeight: 1.2
                    }}
                  >
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
