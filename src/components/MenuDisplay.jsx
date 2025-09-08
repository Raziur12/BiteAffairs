import React, { useState, useMemo, useEffect } from 'react';
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

const MenuDisplay = ({ dietaryFilter, searchQuery }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    loadMenuData();
  }, [dietaryFilter]);

  const loadMenuData = async () => {
    setLoading(true);
    try {
      let data = {};
      switch (dietaryFilter?.toLowerCase()) {
        case 'jain':
          data = await import('../data/jain-menu.json');
          break;
        case 'veg':
          data = await import('../data/customized-menu.json');
          break;
        case 'non-veg':
          data = await import('../data/customized-menu.json');
          break;
        case 'cocktail':
          data = await import('../data/cocktail-party-menu.json');
          break;
        default:
          data = await import('../data/jain-menu.json');
      }
      setMenuData(data.default || data);
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const matchesDietary = !dietaryFilter || dietaryFilter === 'all' || 
        (dietaryFilter.toLowerCase() === 'jain' && item.isJain) ||
        (dietaryFilter.toLowerCase() === 'veg' && item.isVeg && !item.isNonVeg) ||
        (dietaryFilter.toLowerCase() === 'non-veg' && item.isNonVeg) ||
        (dietaryFilter.toLowerCase() === 'vegan' && item.isVeg && !item.isNonVeg);

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

  const getItemImage = (imagePath, itemName) => {
    // Primary: Use image path from JSON if provided
    if (imagePath && imagePath.startsWith('/images/menu/')) {
      return imagePath;
    }
    
    // Fallback: Use local images from public/images/menu directory based on item name
    const foodImages = {
      'paneer': '/images/menu/paneer-tikka.jpg',
      'tikka': '/images/menu/paneer-tikka.jpg',
      'aloo': '/images/menu/aloo-tikki.jpg',
      'dal': '/images/menu/dal-makhani.jpg',
      'biryani': '/images/menu/veg-biryani.jpg',
      'chicken': '/images/menu/chicken-curry.jpg',
      'gulab': '/images/menu/gulab-jamun.jpg',
      'samosa': '/images/menu/samosa.jpg',
      'naan': '/images/menu/butter-naan.jpg',
      'rice': '/images/menu/jeera-rice.jpg',
      'butter': '/images/menu/paneer-butter-masala.jpg',
      'masala': '/images/menu/paneer-butter-masala.jpg',
      'curry': '/images/menu/chicken-curry.jpg',
      'spring': '/images/menu/spring-rolls.jpg',
      'rasmalai': '/images/menu/rasmalai.jpg',
      'pakora': '/images/menu/paneer-pakora.jpg',
      'rajma': '/images/menu/rajma.jpg',
      'fish': '/images/menu/fish-curry.jpg',
      'bruschetta': '/images/menu/bruschetta.jpg',
      'canapes': '/images/menu/chicken-canapes.jpg',
      'cheese': '/images/menu/cheese-board.jpg',
      'mushrooms': '/images/menu/stuffed-mushrooms.jpg',
      'quiches': '/images/menu/mini-quiches.jpg',
      'prawn': '/images/menu/prawn-cocktail.jpg',
      'dessert': '/images/menu/mini-desserts.jpg',
      'chocolate': '/images/menu/chocolate-fountain.jpg',
      'wings': '/images/menu/chicken-wings.jpg',
      'package': '/images/menu/party-package.jpg'
    };
    
    // Find matching image based on item name
    const itemKey = Object.keys(foodImages).find(key => 
      itemName.toLowerCase().includes(key)
    );
    
    return itemKey ? foodImages[itemKey] : '/images/menu/default-food.jpg';
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Loading menu...</Typography>
      </Box>
    );
  }

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
              <CardMedia
                component="img"
                height="250"
                image={item.image || getItemImage(item.image, item.name)}
                alt={item.name}
                sx={{ 
                  objectFit: 'cover',
                  width: '100%',
                  maxWidth: '100%'
                }}
                onError={(e) => {
                  if (!imageErrors[item.id]) {
                    setImageErrors(prev => ({ ...prev, [item.id]: true }));
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
                  }
                }}
              />
              
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
              <Box sx={{ mb: 3 }}>
                <img
                  src={selectedItem.image || getItemImage(selectedItem.image, selectedItem.name)}
                  alt={selectedItem.name}
                  style={{
                    width: '100%',
                    height: '350px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </Box>
              
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
