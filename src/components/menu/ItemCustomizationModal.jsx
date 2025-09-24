import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { getMenuItems } from '../../data/menuItems';
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
  menuType = 'jain',
  onAddToCart 
}) => {
  // ALL useState hooks must be declared FIRST, before any conditional logic
  const [Serves, setServes] = useState(1);
  const [portionSize, setPortionSize] = useState('2');
  const [selectedStarters, setSelectedStarters] = useState([]);
  const [selectedMainCourse, setSelectedMainCourse] = useState([]);
  const [selectedBreads, setSelectedBreads] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const [selectedPackageType, setSelectedPackageType] = useState('standard');


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

  // Get menu items using the new service
  const currentMenuItems = getMenuItems(menuType, selectedPackageType);
  
  // Extract options safely
  const starterOptions = currentMenuItems?.starters || [];
  const mainCourseOptions = currentMenuItems?.mainCourse || [];
  const breadOptions = currentMenuItems?.breads || [];
  const dessertOptions = currentMenuItems?.desserts || [];

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

  const handleDessertChange = (dessert) => {
    setSelectedDesserts(prev => 
      prev.includes(dessert) 
        ? prev.filter(d => d !== dessert)
        : [...prev, dessert]
    );
  };
  const handleAddToCart = () => {
    // Generate unique ID for cart item
    const itemId = `${item.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const customizedItem = {
      ...item,
      id: itemId,
      quantity: Number(Serves), // Ensure quantity is a number
      price: Number(item.price) || 250, // Ensure price is a number
      portionSize,
      customizations: {
        starters: selectedStarters,
        mainCourse: selectedMainCourse,
        breads: selectedBreads,
        desserts: selectedDesserts,
        ...(menuType === 'packages' && { packageType: selectedPackageType })
      }
    };
    
    
    onAddToCart(customizedItem);
    onClose();
    
    // Reset form
    setServes(1);
    setPortionSize('2');
    setSelectedStarters([]);
    setSelectedMainCourse([]);
    setSelectedBreads([]);
    setSelectedDesserts([]);
    setSelectedPackageType('standard');
  };

  // Simple null check - keep original logic
  if (!item) return null;

  const totalPrice = item.price * Serves;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
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
        {/* Item Breakdown */}
        <Box sx={{ mb: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>•</Typography>
              <Typography variant="body2">3 Starters</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>•</Typography>
              <Typography variant="body2">2 Breads</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>•</Typography>
              <Typography variant="body2">3 Main Course</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>•</Typography>
              <Typography variant="body2">1 Dessert</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>•</Typography>
              <Typography variant="body2">1 Rice</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>•</Typography>
              <Typography variant="body2">Raita & Salad</Typography>
            </Box>
          </Box>
        </Box>

        {/* Customize Serves */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Customize Serves
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
                onClick={() => setServes(Math.max(1, Serves - 1))}
                sx={{ bgcolor: '#f5f5f5' }}
              >
                <Remove sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                {Serves}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setServes(Serves + 1)}
                sx={{ bgcolor: '#f5f5f5' }}
              >
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Package Menu Selection - Only show for Package Menu */}
        {menuType === 'packages' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Select Package Type
            </Typography>
            <RadioGroup
              value={selectedPackageType}
              onChange={(e) => setSelectedPackageType(e.target.value)}
              row
            >
              <FormControlLabel 
                value="standard" 
                control={<Radio size="small" />} 
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>STANDARD</Typography>
                    <Typography variant="caption" color="text.secondary">Menu Veg (499)</Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="premium" 
                control={<Radio size="small" />} 
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>PREMIUM</Typography>
                    <Typography variant="caption" color="text.secondary">Menu Veg (499)</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Customize Your Meal */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          {menuType === 'packages' ? 'Package Contents' : 'Customize Your Meal'}
        </Typography>

        {/* Starters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Starters
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {menuType === 'packages' ? 'Package includes these items (for 20 PAX)' : 'Please select any 3 items'}
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
            {menuType === 'packages' ? 'Package includes these items (for 20 PAX)' : 'Please select any 3 items'}
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
            {menuType === 'packages' ? 'Package includes these items (for 20 PAX)' : 'Please select any 2 items'}
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

        {/* Desserts */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Desserts
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {menuType === 'packages' ? 'Package includes these items (for 20 PAX)' : 'Please select any 1 item'}
          </Typography>
          <FormGroup>
            {dessertOptions.map((dessert) => (
              <FormControlLabel
                key={dessert}
                control={
                  <Checkbox
                    checked={selectedDesserts.includes(dessert)}
                    onChange={() => handleDessertChange(dessert)}
                    size="small"
                  />
                }
                label={dessert}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            ))}
          </FormGroup>
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
