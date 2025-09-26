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
    <Box sx={{ 
      textAlign: 'center', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      maxHeight: { xs: 'calc(100vh - 240px)', sm: 'none' },
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          mb: { xs: 1, sm: 2 },
          fontSize: { xs: '1.3rem', sm: '2rem' }
        }}
      >
        Meal Type
      </Typography>
      
      {/* Meal Type Selection */}
      <Grid 
        container 
        spacing={{ xs: 1, sm: 2 }} 
        sx={{ 
          mb: { xs: 1.5, sm: 3 },
          flex: '0 0 auto'
        }}
      >
        {mealTypes.map((meal) => (
          <Grid item xs={meal.id === 'veg_nonveg' ? 12 : 6} key={meal.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: { xs: 2, sm: 3 },
                borderColor: selectedMealType === meal.id ? '#ff6b35' : 'grey.300',
                borderWidth: 2,
                maxWidth: meal.id === 'veg_nonveg' ? { xs: 160, sm: 200 } : 'none',
                mx: 'auto',
                transition: 'all 0.2s ease-in-out',
                height: { xs: '60px', sm: '100px' },
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 2
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleMealTypeSelect(meal)} 
                sx={{ 
                  p: { xs: 1.5, sm: 3 },
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
                    {meal.icon}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: { xs: '0.8rem', sm: '1.125rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {meal.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Guest Count */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          mb: { xs: 1, sm: 2 },
          fontSize: { xs: '1.2rem', sm: '2rem' }
        }}
      >
        Guest Count
      </Typography>
      
      {/* Jain Count - Only show for Jain meal type */}
      {selectedMealType === 'jain' && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: { xs: 1.5, sm: 3 }, 
          px: { xs: 2, sm: 4 },
          flex: '0 0 auto'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'medium',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Jain:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            <IconButton 
              onClick={() => handleJainCountChange(-1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 }
              }}
            >
              <Remove sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                minWidth: { xs: 25, sm: 30 }, 
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {jainCount}
            </Typography>
            <IconButton 
              onClick={() => handleJainCountChange(1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 }
              }}
            >
              <Add sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Veg Count - Show for Veg and Veg+NonVeg meal types */}
      {(selectedMealType === 'veg' || selectedMealType === 'veg_nonveg') && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: { xs: 1.5, sm: 2.5 }, 
          px: { xs: 2, sm: 4 },
          flex: '0 0 auto'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'medium',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Veg:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            <IconButton 
              onClick={() => handleVegCountChange(-1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 }
              }}
            >
              <Remove sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                minWidth: { xs: 25, sm: 30 }, 
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {vegCount}
            </Typography>
            <IconButton 
              onClick={() => handleVegCountChange(1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 }
              }}
            >
              <Add sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Non-Veg Count - Only show for Veg+NonVeg meal type */}
      {selectedMealType === 'veg_nonveg' && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: { xs: 1.5, sm: 3 }, 
          px: { xs: 2, sm: 4 },
          flex: '0 0 auto'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'medium',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            NonVeg:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            <IconButton 
              onClick={() => handleNonVegCountChange(-1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 }
              }}
            >
              <Remove sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                minWidth: { xs: 25, sm: 30 }, 
                textAlign: 'center',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {nonVegCount}
            </Typography>
            <IconButton 
              onClick={() => handleNonVegCountChange(1)} 
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 2,
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 }
              }}
            >
              <Add sx={{ fontSize: { xs: 14, sm: 16 } }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* See Packages Button */}
      <Box sx={{ mt: 'auto', pt: { xs: 2, sm: 0 } }}>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!selectedMealType}
          sx={{
            bgcolor: '#1e3a8a',
            color: 'white',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 4, sm: 6 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '280px', sm: 'none' },
            mx: 'auto',
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
    </Box>
  );
};

export default MealTypeStep;
