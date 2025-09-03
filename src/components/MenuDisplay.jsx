import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Close,
  Restaurant,
  LocalDining,
  Circle
} from '@mui/icons-material';

const MenuDisplay = ({ menuData, dietaryFilter, searchQuery }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Filter menu items based on dietary preference and search query
  const filteredItems = useMemo(() => {
    if (!menuData || !menuData.categories) return [];

    let items = [];
    menuData.categories.forEach(category => {
      if (category.items) {
        items = [...items, ...category.items.map(item => ({ ...item, category: category.name }))];
      }
    });

    return items.filter(item => {
      // Dietary filter
      const matchesDietary = dietaryFilter === 'all' || 
        (dietaryFilter === 'jain' && item.isJain) ||
        (dietaryFilter === 'veg' && item.isVeg && !item.isNonVeg) ||
        (dietaryFilter === 'non-veg' && item.isNonVeg);

      // Search filter
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDietary && matchesSearch;
    });
  }, [menuData, dietaryFilter, searchQuery]);

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }));
  };

  const getDietaryIcon = (item) => {
    if (item.isJain) return <Circle sx={{ color: '#22c55e', fontSize: 16 }} />;
    if (item.isVeg) return <Restaurant sx={{ color: '#22c55e', fontSize: 16 }} />;
    if (item.isNonVeg) return <LocalDining sx={{ color: '#ef4444', fontSize: 16 }} />;
    return null;
  };

  const getDietaryLabel = (item) => {
    if (item.isJain) return 'Jain';
    if (item.isVeg && !item.isNonVeg) return 'Veg';
    if (item.isNonVeg) return 'Non-Veg';
    return '';
  };

  const getDietaryColor = (item) => {
    if (item.isJain) return 'success';
    if (item.isVeg && !item.isNonVeg) return 'success';
    if (item.isNonVeg) return 'error';
    return 'default';
  };

  if (!menuData || !menuData.categories) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No menu data available for this section.
      </Alert>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No items found matching your search criteria.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {filteredItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.id || index}`}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme => theme.shadows[8]
                }
              }}
              onClick={() => setSelectedItem(item)}
            >
              {item.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {item.name}
                  </Typography>
                  {getDietaryIcon(item)}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.4 }}>
                  {item.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={getDietaryLabel(item)}
                    color={getDietaryColor(item)}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={item.category}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    ₹{item.price}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id || index, -1);
                      }}
                      disabled={!quantities[item.id || index]}
                    >
                      <Remove />
                    </IconButton>
                    
                    <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                      {quantities[item.id || index] || 0}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item.id || index, 1);
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Item Detail Dialog */}
      <Dialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {selectedItem.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip
                    label={getDietaryLabel(selectedItem)}
                    color={getDietaryColor(selectedItem)}
                    size="small"
                  />
                  <Chip
                    label={selectedItem.category}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedItem(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              {selectedItem.image && (
                <Box sx={{ mb: 3 }}>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}
              
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {selectedItem.description}
              </Typography>
              
              {selectedItem.ingredients && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>Ingredients:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedItem.ingredients}
                  </Typography>
                </>
              )}
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                ₹{selectedItem.price}
              </Typography>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(selectedItem.id || selectedItem.name, -1)}
                    disabled={!quantities[selectedItem.id || selectedItem.name]}
                  >
                    <Remove />
                  </IconButton>
                  
                  <Typography variant="h6" sx={{ minWidth: 30, textAlign: 'center' }}>
                    {quantities[selectedItem.id || selectedItem.name] || 0}
                  </Typography>
                  
                  <IconButton
                    onClick={() => handleQuantityChange(selectedItem.id || selectedItem.name, 1)}
                  >
                    <Add />
                  </IconButton>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => setSelectedItem(null)}
                  disabled={!quantities[selectedItem.id || selectedItem.name]}
                >
                  Add to Cart
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MenuDisplay;
