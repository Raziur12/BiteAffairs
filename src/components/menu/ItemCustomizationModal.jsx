import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material';
import {
  Close,
  Add,
  Remove
} from '@mui/icons-material';

const ItemCustomizationModal = ({ 
  open, 
  onClose, 
  item, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [portionSize, setPortionSize] = useState('2');
  const [selectedStarters, setSelectedStarters] = useState([]);
  const [selectedMainCourse, setSelectedMainCourse] = useState([]);
  const [selectedBreads, setSelectedBreads] = useState([]);
  const [serves, setServes] = useState(2);

  if (!item) return null;

  // Get item image with fallback
  const getItemImage = (imagePath, itemName) => {
    // Use online images since local images are not available
    const fallbackImages = {
      'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'kabab': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d51a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'rice': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'roti': 'https://images.unsplash.com/photo-1574653853027-5d3ac9b9fbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'default': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    };

    if (imagePath && imagePath.startsWith('http')) {
      return imagePath;
    }

    if (!itemName) return fallbackImages.default;

    const name = itemName.toLowerCase();
    for (const [key, url] of Object.entries(fallbackImages)) {
      if (name.includes(key)) {
        return url;
      }
    }
    
    return fallbackImages.default;
  };

  const starterOptions = [
    'Paneer Tikka',
    'Malai Paneer Tikka',
    'Haryali Paneer Tikka',
    'Soya Chaap Tikka',
    'Malai Soya Tikka'
  ];

  const mainCourseOptions = [
    'Paneer Matar',
    'Paneer Shahi',
    'Paneer Kadai',
    'Mix Veg',
    'Daal Makhani'
  ];

  const breadOptions = [
    'Tandoor Roti',
    'Butter Roti'
  ];

  const handleStarterChange = (starter) => {
    setSelectedStarters(prev => 
      prev.includes(starter) 
        ? prev.filter(s => s !== starter)
        : [...prev, starter]
    );
  };

  const handleMainCourseChange = (course) => {
    setSelectedMainCourse(prev => 
      prev.includes(course) 
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
  };

  const handleBreadChange = (bread) => {
    setSelectedBreads(prev => 
      prev.includes(bread) 
        ? prev.filter(b => b !== bread)
        : [...prev, bread]
    );
  };

  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      quantity,
      portionSize,
      customizations: {
        starters: selectedStarters,
        mainCourse: selectedMainCourse,
        breads: selectedBreads,
        serves
      }
    };
    
    onAddToCart(customizedItem);
    onClose();
    
    // Reset form
    setQuantity(1);
    setPortionSize('2');
    setSelectedStarters([]);
    setSelectedMainCourse([]);
    setSelectedBreads([]);
    setServes(2);
  };

  const totalPrice = item.price * quantity;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '60vh',
          maxWidth: '400px',
          width: '90%'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              component="img"
              src={getItemImage(item.image, item.name)}
              alt={item.name}
              sx={{
                width: 90,
                height: 90,
                borderRadius: 2,
                objectFit: 'cover'
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ mt: -1 }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Customize Quantity */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Customize Quantity
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Portion Size</Typography>
            <RadioGroup
              value={portionSize}
              onChange={(e) => setPortionSize(e.target.value)}
              row
            >
              <FormControlLabel value="2" control={<Radio size="small" />} label="2" />
              <FormControlLabel value="4" control={<Radio size="small" />} label="4" />
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Serves</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setServes(Math.max(1, serves - 1))}
                sx={{ bgcolor: '#f5f5f5' }}
              >
                <Remove sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                {serves}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setServes(serves + 1)}
                sx={{ bgcolor: '#f5f5f5' }}
              >
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Customize Your Meal */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Customize Your Meal
        </Typography>

        {/* Starters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Starters
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Please select any 3 items
          </Typography>
          <FormGroup>
            {starterOptions.map((starter) => (
              <FormControlLabel
                key={starter}
                control={
                  <Checkbox
                    checked={selectedStarters.includes(starter)}
                    onChange={() => handleStarterChange(starter)}
                    size="small"
                  />
                }
                label={starter}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Main Course */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Main Course
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Please select any 3 items
          </Typography>
          <FormGroup>
            {mainCourseOptions.map((course) => (
              <FormControlLabel
                key={course}
                control={
                  <Checkbox
                    checked={selectedMainCourse.includes(course)}
                    onChange={() => handleMainCourseChange(course)}
                    size="small"
                  />
                }
                label={course}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Breads */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Breads
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Please select any 2 items
          </Typography>
          <FormGroup>
            {breadOptions.map((bread) => (
              <FormControlLabel
                key={bread}
                control={
                  <Checkbox
                    checked={selectedBreads.includes(bread)}
                    onChange={() => handleBreadChange(bread)}
                    size="small"
                  />
                }
                label={bread}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Serves */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body2">Serves</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              sx={{ bgcolor: '#f5f5f5' }}
            >
              <Remove sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
              {quantity}
            </Typography>
            <IconButton
              size="small"
              onClick={() => setQuantity(quantity + 1)}
              sx={{ bgcolor: '#f5f5f5' }}
            >
              <Add sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleAddToCart}
          sx={{
            bgcolor: '#1a237e',
            py: 1,
            fontSize: '1rem',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#303f9f'
            }
          }}
        >
          Add | ₹{totalPrice}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ItemCustomizationModal;
