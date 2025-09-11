import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, IconButton, Button } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const MealTypeStep = ({ onNext, updateBookingData, initialGuestCount }) => {
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [vegCount, setVegCount] = useState(5);
  const [nonVegCount, setNonVegCount] = useState(5);
  const [jainCount, setJainCount] = useState(5);

  const mealTypes = [
    { 
      id: 'jain', 
      name: 'Jain',
      icon: '🥗' // Bowl icon for Jain food
    },
    { 
      id: 'veg', 
      name: 'Veg',
      icon: '🥬' // Leafy greens for veg
    },
    { 
      id: 'veg_nonveg', 
      name: 'Veg + NonVeg',
      icon: '🍗' // Chicken leg for non-veg
    },
  ];

  const handleMealTypeSelect = (meal) => {
    setSelectedMealType(meal.id);
    updateBookingData({ 
      mealType: meal.name,
      vegCount: vegCount,
      nonVegCount: nonVegCount
    });
  };

  const handleVegCountChange = (amount) => {
    const newCount = Math.max(0, vegCount + amount);
    setVegCount(newCount);
    updateBookingData({ vegCount: newCount });
  };

  const handleNonVegCountChange = (amount) => {
    const newCount = Math.max(0, nonVegCount + amount);
    setNonVegCount(newCount);
    updateBookingData({ nonVegCount: newCount });
  };

  const handleJainCountChange = (amount) => {
    const newCount = Math.max(0, jainCount + amount);
    setJainCount(newCount);
    updateBookingData({ jainCount: newCount });
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Meal Type
      </Typography>
      
      {/* Meal Type Selection */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {mealTypes.map((meal) => (
          <Grid item xs={meal.id === 'veg_nonveg' ? 12 : 6} key={meal.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: selectedMealType === meal.id ? '#ff6b35' : 'grey.300',
                borderWidth: 2,
                maxWidth: meal.id === 'veg_nonveg' ? 200 : 'none',
                mx: 'auto',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <CardActionArea onClick={() => handleMealTypeSelect(meal)} sx={{ p: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {meal.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                    {meal.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Guest Count */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Guest Count
      </Typography>
      
      {/* Jain Count - Only show for Jain meal type */}
      {selectedMealType === 'jain' && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Jain:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => handleJainCountChange(-1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 32,
                height: 32
              }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
              {jainCount}
            </Typography>
            <IconButton 
              onClick={() => handleJainCountChange(1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 32,
                height: 32
              }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Veg Count - Show for Veg and Veg+NonVeg meal types */}
      {(selectedMealType === 'veg' || selectedMealType === 'veg_nonveg') && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Veg:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => handleVegCountChange(-1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 32,
                height: 32
              }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
              {vegCount}
            </Typography>
            <IconButton 
              onClick={() => handleVegCountChange(1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 32,
                height: 32
              }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Non-Veg Count - Only show for Veg+NonVeg meal type */}
      {selectedMealType === 'veg_nonveg' && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, px: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            NonVeg:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => handleNonVegCountChange(-1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 32,
                height: 32
              }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
              {nonVegCount}
            </Typography>
            <IconButton 
              onClick={() => handleNonVegCountChange(1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 32,
                height: 32
              }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* See Packages Button */}
      <Button
        variant="contained"
        onClick={onNext}
        disabled={!selectedMealType}
        sx={{
          bgcolor: '#1e3a8a',
          color: 'white',
          py: 2,
          px: 6,
          fontSize: '1.1rem',
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#1e40af'
          },
          '&:disabled': {
            bgcolor: 'grey.300'
          }
        }}
      >
        See Packages
      </Button>
    </Box>
  );
};

export default MealTypeStep;
