import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel, 
  IconButton, 
  Button 
} from '@mui/material';
import { Add, Remove, LocationOn, Event, AccessTime, Restaurant } from '@mui/icons-material';

const EventDetailsStep = ({ onNext, updateBookingData }) => {
  const [formData, setFormData] = useState({
    city: '',
    occasion: '',
    eventDate: '',
    deliveryTime: '',
    menu: '',
    vegGuest: 5,
    nonVegGuest: 5
  });

  const cities = [
    { value: 'delhi', label: 'Delhi' },
    { value: 'gurugram', label: 'Gurugram' },
    { value: 'noida', label: 'Noida' },
    { value: 'faridabad', label: 'Faridabad' },
    { value: 'ghaziabad', label: 'Ghaziabad' }
  ];

  const occasions = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'house_party', label: 'House Party' },
    { value: 'pooja', label: 'Pooja' },
    { value: 'pre_wedding', label: 'Pre-Wedding' },
    { value: 'office_party', label: 'Office Party' },
    { value: 'others', label: 'Others' }
  ];

  const menuTypes = [
    { value: 'jain', label: 'Jain Menu' },
    { value: 'veg', label: 'Veg Menu' },
    { value: 'customized', label: 'Customized Menu' },
    { value: 'cocktail', label: 'Cocktail Party Menu' },
    { value: 'packages', label: 'Package Menu' }
  ];

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
    { value: '20:00', label: '8:00 PM' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    updateBookingData({ [field]: value });
  };

  const handleGuestCountChange = (type, amount) => {
    const currentCount = formData[type];
    const newCount = Math.max(0, currentCount + amount);
    handleInputChange(type, newCount);
  };

  const isFormValid = () => {
    return formData.city && formData.occasion && formData.eventDate && 
           formData.deliveryTime && formData.menu;
  };

  // Generate date options (next 30 days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      dates.push({ value: dateString, label: displayDate });
    }
    return dates;
  };

  return (
    <Box sx={{ textAlign: 'center', px: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Event Details
      </Typography>
      
      <Grid container spacing={3}>
        {/* City Selection */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              City
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              displayEmpty
              sx={{ textAlign: 'left' }}
            >
              <MenuItem value="" disabled>
                Select City
              </MenuItem>
              {cities.map((city) => (
                <MenuItem key={city.value} value={city.value}>
                  {city.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Occasion Selection */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Event sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Occasion
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={formData.occasion}
              onChange={(e) => handleInputChange('occasion', e.target.value)}
              displayEmpty
              sx={{ textAlign: 'left' }}
            >
              <MenuItem value="" disabled>
                Select Occasion
              </MenuItem>
              {occasions.map((occasion) => (
                <MenuItem key={occasion.value} value={occasion.value}>
                  {occasion.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Event Date */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Event sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Event Date
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={formData.eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              displayEmpty
              sx={{ textAlign: 'left' }}
            >
              <MenuItem value="" disabled>
                Select a Date
              </MenuItem>
              {generateDateOptions().map((date) => (
                <MenuItem key={date.value} value={date.value}>
                  {date.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Delivery Time */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Delivery Time
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={formData.deliveryTime}
              onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
              displayEmpty
              sx={{ textAlign: 'left' }}
            >
              <MenuItem value="" disabled>
                Select Time
              </MenuItem>
              {timeSlots.map((time) => (
                <MenuItem key={time.value} value={time.value}>
                  {time.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Select Menu */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Select Menu
            </Typography>
          </Box>
          <FormControl fullWidth size="small">
            <Select
              value={formData.menu}
              onChange={(e) => handleInputChange('menu', e.target.value)}
              displayEmpty
              sx={{ textAlign: 'left' }}
            >
              <MenuItem value="" disabled>
                Select Menu
              </MenuItem>
              {menuTypes.map((menu) => (
                <MenuItem key={menu.value} value={menu.value}>
                  {menu.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Veg Guest Count */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              Veg Guest
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={() => handleGuestCountChange('vegGuest', -1)}
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 1,
                width: 32,
                height: 32
              }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
              {formData.vegGuest}
            </Typography>
            <IconButton 
              onClick={() => handleGuestCountChange('vegGuest', 1)}
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 1,
                width: 32,
                height: 32
              }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Grid>

        {/* Non-Veg Guest Count */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              NonVeg Guest
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={() => handleGuestCountChange('nonVegGuest', -1)}
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 1,
                width: 32,
                height: 32
              }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
              {formData.nonVegGuest}
            </Typography>
            <IconButton 
              onClick={() => handleGuestCountChange('nonVegGuest', 1)}
              size="small"
              sx={{ 
                border: '1px solid #ccc',
                borderRadius: 1,
                width: 32,
                height: 32
              }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* See Packages Button */}
      <Button
        variant="contained"
        onClick={onNext}
        disabled={!isFormValid()}
        sx={{
          bgcolor: '#1e3a8a',
          color: 'white',
          py: 2,
          px: 6,
          fontSize: '1.1rem',
          fontWeight: 600,
          borderRadius: 2,
          textTransform: 'none',
          mt: 4,
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

export default EventDetailsStep;
