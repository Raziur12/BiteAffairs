import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Remove,
  ShoppingCart,
  Close,
  Phone,
  Instagram,
  YouTube,
  WhatsApp
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import ItemCustomizationModal from './ItemCustomizationModal';
import { CartSummary, CartModal } from '../cart';

const PartyPlatters = ({ id }) => {
  const { addItem, getItemQuantity, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('customized');
  const [sortBy, setSortBy] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [menuData, setMenuData] = useState({ categories: [] });
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [vegFilter, setVegFilter] = useState(true);
  const [nonVegFilter, setNonVegFilter] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const menuOptions = [
    { value: 'jain', label: 'Jain Menu' },
    { value: 'packages', label: 'Packages' },
    { value: 'customized', label: 'Customized' },
    { value: 'cocktail', label: 'Cocktail Menu' }
  ];

  const sortOptions = [
    { value: '', label: 'Sort By' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Load menu data dynamically
  const loadMenuData = async () => {
    setLoading(true);
    try {
      let data = {};
      switch (selectedMenu?.toLowerCase()) {
        case 'jain':
          data = await import('../../data/jain-menu.json');
          break;
        case 'customized':
          data = await import('../../data/customized-menu.json');
          break;
        case 'cocktail':
          data = await import('../../data/cocktail-party-menu.json');
          break;
        case 'packages':
          data = await import('../../data/packages-menu.json');
          break;
        default:
          data = await import('../../data/jain-menu.json');
      }
      setMenuData(data.default || data);
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, [selectedMenu]);

  // Get all items from all categories with proper filtering
  const getAllItems = () => {
    if (!menuData) return [];
    
    // Handle different menu structures
    if (selectedMenu === 'customized') {
      return menuData.categories ? menuData.categories.flatMap(category => category.items || []) : [];
    } else if (selectedMenu === 'cocktail') {
      // For cocktail menu, get items from COCKTAIL_PARTY_MENU
      const cocktailMenu = menuData.COCKTAIL_PARTY_MENU;
      if (cocktailMenu) {
        const allItems = [];
        // Get items from veg_starters
        if (cocktailMenu.veg_starters) {
          allItems.push(...cocktailMenu.veg_starters);
        }
        // Get items from non_veg_starters
        if (cocktailMenu.non_veg_starters) {
          allItems.push(...cocktailMenu.non_veg_starters);
        }
        return allItems;
      }
    } else if (selectedMenu === 'jain') {
      // For jain menu, get items from JAIN_MENU
      const jainMenu = menuData.JAIN_MENU;
      if (jainMenu && jainMenu.categories) {
        return jainMenu.categories.flatMap(category => category.items || []);
      }
    }
    
    return menuData.categories ? menuData.categories.flatMap(category => category.items || []) : [];
  };

  // Get categories for filtering
  const getCategories = () => {
    const categories = ['All', 'Starters', 'Breads', 'Desserts'];
    return categories;
  };

  // Filter items based on search query, dietary preferences, and category
  const filteredItems = getAllItems().filter(item => {
    if (!item) return false;
    
    const matchesSearch = searchQuery === '' || 
                         (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // More flexible diet filtering
    const matchesDiet = (!vegFilter && !nonVegFilter) || 
                       (vegFilter && item.isVeg) || 
                       (nonVegFilter && item.isNonVeg) ||
                       (vegFilter && !item.isNonVeg) || // If not explicitly non-veg, consider as veg option
                       (nonVegFilter && !item.isVeg); // If not explicitly veg, consider as non-veg option
    
    // More flexible category matching
    const matchesCategory = !selectedCategory || selectedCategory === 'All' ||
                           (selectedCategory === 'Starters' && 
                            (item.category === 'starters' || 
                             (item.name && (item.name.toLowerCase().includes('tikka') || 
                                          item.name.toLowerCase().includes('kabab') ||
                                          item.name.toLowerCase().includes('starter'))))) ||
                           (selectedCategory === 'Breads' && 
                            (item.category === 'breads' || 
                             (item.name && (item.name.toLowerCase().includes('naan') || 
                                          item.name.toLowerCase().includes('roti') ||
                                          item.name.toLowerCase().includes('bread'))))) ||
                           (selectedCategory === 'Desserts' && 
                            (item.category === 'desserts' || 
                             (item.name && (item.name.toLowerCase().includes('jamun') || 
                                          item.name.toLowerCase().includes('phirni') ||
                                          item.name.toLowerCase().includes('dessert')))));
    
    return matchesSearch && matchesDiet && matchesCategory;
  });

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    setSelectedItem(item);
    setCustomizationModalOpen(true);
  };

  // Handle customized item addition
  const handleCustomizedItemAdd = (customizedItem) => {
    addItem(customizedItem);
  };

  // Get item image with fallback
  const getItemImage = (imagePath, itemName) => {
    // Use online images since local images are not available
    const fallbackImages = {
      'paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'kabab': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'roll': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'fish': 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'wings': 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'aloo': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'mutton': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'prawn': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'seekh': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'malai': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'tandoori': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'chilli': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'haryali': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'soya': 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'mushroom': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'tofu': 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'momo': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'dimsum': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'potato': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      'default': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    };
    
    // Always use online images for now since local images are not working
    const itemNameLower = itemName?.toLowerCase() || '';
    
    // Find appropriate image based on item name
    for (const [key, url] of Object.entries(fallbackImages)) {
      if (itemNameLower.includes(key)) {
        return url;
      }
    }
    
    return fallbackImages.default;
  };

  // Services data
  const services = [
    {
      id: 1,
      title: 'Professional Chefs',
      description: 'Experienced chefs who specialize in authentic Indian cuisine with modern presentation.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹500'
    },
    {
      id: 2,
      title: 'Serving Staff',
      description: 'Well-trained serving staff to ensure your guests receive excellent hospitality.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹300'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Amazing food quality and excellent service. Our guests loved the Jain menu options!',
      avatar: 'PS'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Perfect catering for our office party. Everything was fresh and delicious.',
      avatar: 'RK'
    },
    {
      id: 3,
      name: 'Anita Gupta',
      rating: 4,
      comment: 'Great variety in the menu and very professional team. Highly recommended!',
      avatar: 'AG'
    }
  ];

  return (
    <Box id={id} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Choose Your Party Platters Title */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              mb: 1
            }}
          >
            Choose Your Party Platters
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for Dishes/Services"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              bgcolor: 'white', 
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
        </Box>

        {/* Menu Dropdown */}
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <Select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
              displayEmpty
              sx={{ 
                bgcolor: 'white', 
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            >
              {menuOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Category Buttons */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getCategories().map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "contained" : "outlined"}
                onClick={() => setSelectedCategory(category)}
                size="small"
                sx={{
                  borderRadius: 20,
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  bgcolor: selectedCategory === category ? '#1a237e' : 'white',
                  color: selectedCategory === category ? 'white' : '#1a237e',
                  border: '1px solid #1a237e'
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Box>

        {/* All Controls in One Row */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          <FormControlLabel
            control={
              <Switch
                checked={vegFilter}
                onChange={(e) => setVegFilter(e.target.checked)}
                color="success"
                size="small"
              />
            }
            label="Veg"
            sx={{ 
              '& .MuiFormControlLabel-label': { fontSize: '0.75rem', fontWeight: 500 },
              mr: 1
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={nonVegFilter}
                onChange={(e) => setNonVegFilter(e.target.checked)}
                color="error"
                size="small"
              />
            }
            label="Non Veg"
            sx={{ 
              '& .MuiFormControlLabel-label': { fontSize: '0.75rem', fontWeight: 500 },
              mr: 2
            }}
          />
          <FormControl size="small" sx={{ minWidth: 90, mr: 1 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
              sx={{ 
                bgcolor: 'white', 
                borderRadius: 1,
                fontSize: '0.75rem',
                height: 32
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', mr: 0.5 }}>No of Pax</Typography>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <FilterList sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Menu Items Grid */}
        {!loading && (
          <Grid container spacing={2}>
            {filteredItems.map((item) => (
              <Grid item xs={6} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {/* Veg/Non-Veg Indicator */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: item.isVeg ? '#4caf50' : '#f44336',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'white'
                      }}
                    />
                  </Box>

                  <CardMedia
                    component="img"
                    image={getItemImage(item.image, item.name)}
                    alt={item.name}
                    sx={{ 
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '8px 8px 0 0',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  
                  <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        fontSize: '0.75rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.description}
                    </Typography>
                    
                    {item.portion_size && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mb: 1,
                          color: 'text.secondary',
                          fontSize: '0.7rem'
                        }}
                      >
                        Serves: {item.portion_size}
                      </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#1a237e',
                          fontSize: '1rem'
                        }}
                      >
                        ₹{item.price}
                      </Typography>
                      
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        sx={{
                          bgcolor: '#1a237e',
                          borderRadius: 1,
                          px: 2,
                          py: 0.5,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: '#303f9f'
                          }
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                    
                    {getItemQuantity(item.id) > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ 
                          bgcolor: '#1a237e', 
                          color: 'white', 
                          px: 2, 
                          py: 0.5, 
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600 
                        }}>
                          {getItemQuantity(item.id)} Added
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No items found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}

        {/* Cart Summary */}
        <CartSummary onViewCart={() => setCartModalOpen(true)} />

        {/* Item Customization Modal */}
        <ItemCustomizationModal
          open={customizationModalOpen}
          onClose={() => {
            setCustomizationModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onAddToCart={handleCustomizedItemAdd}
        />

        {/* Cart Modal */}
        <CartModal
          open={cartModalOpen}
          onClose={() => setCartModalOpen(false)}
        />


      </Container>
    </Box>
  );
};

export default PartyPlatters;
