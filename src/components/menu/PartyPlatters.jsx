import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  WhatsApp,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import ItemCustomizationModal from './ItemCustomizationModal';
import { CartSummary, CartModal } from '../cart';
import CheckoutConfirmation from '../cart/CheckoutConfirmation';
import { MenuGridSkeleton, EnhancedLoader, MenuLoadError, EmptyState } from '../common';

const PartyPlatters = ({ id, onOpenCart, bookingConfig }) => {
  const navigate = useNavigate();
  const { addItem, getItemQuantity, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(() => {
    // Set initial menu based on booking config if available
    if (bookingConfig?.menu) {
      return bookingConfig.menu;
    }
    return 'customized';
  });
  const [sortBy, setSortBy] = useState('');
  const [numberOfPax, setNumberOfPax] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [menuData, setMenuData] = useState({ categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [vegFilter, setVegFilter] = useState(true);
  const [nonVegFilter, setNonVegFilter] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  const baseMenuOptions = [
    { value: 'jain', label: 'Jain Menu' },
    { value: 'veg', label: 'Veg Menu' },
    { value: 'customized', label: 'Customized Menu' },
    { value: 'cocktail', label: 'Cocktail Party Menu' },
    { value: 'packages', label: 'Package Menu' }
  ];

  // Reorder menu options to show selected menu from booking first
  const menuOptions = (() => {
    if (bookingConfig?.menu) {
      const selectedOption = baseMenuOptions.find(option => option.value === bookingConfig.menu);
      const otherOptions = baseMenuOptions.filter(option => option.value !== bookingConfig.menu);
      return selectedOption ? [selectedOption, ...otherOptions] : baseMenuOptions;
    }
    return baseMenuOptions;
  })();

  const sortOptions = [
    { value: '', label: 'Sort By' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Load menu data dynamically
  const loadMenuData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = {};
      switch (selectedMenu?.toLowerCase()) {
        case 'jain':
          data = await import('../../data/jain-menu.json');
          break;
        case 'veg':
          data = await import('../../data/customized-menu.json');
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
      setError(error.message || 'Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, [selectedMenu]);

  // Update selected menu when booking config changes
  useEffect(() => {
    if (bookingConfig?.menu && bookingConfig.menu !== selectedMenu) {
      setSelectedMenu(bookingConfig.menu);
    }
  }, [bookingConfig]);

  // Get all items from all categories with proper filtering
  const getAllItems = () => {
    if (!menuData) return [];
    
    // Handle different menu structures
    if (selectedMenu === 'customized' || selectedMenu === 'veg') {
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

  // Filter and sort items based on search query, dietary preferences, category, and sorting
  const filteredAndSortedItems = (() => {
    // First filter items
    const filtered = getAllItems().filter(item => {
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

    // Then sort items based on sortBy value
    if (!sortBy || sortBy === '') return filtered;

    return [...filtered].sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;

      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'popular':
          // Sort by name alphabetically as a proxy for popularity
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });
  })();

  // Handle adding item to cart
  const handleAddToCart = (item) => {
    setSelectedItem(item);
    setCustomizationModalOpen(true);
  };

  // Handle customized item addition
  const handleCustomizedItemAdd = (customizedItem) => {
    addItem(customizedItem);
  };

  const handleProceedToCheckout = () => {
    setCartModalOpen(false);
    setConfirmationOpen(true);
  };

  // Navigation functions for service cards
  const handlePrevService = () => {
    setCurrentServiceIndex((prev) => (prev > 0 ? prev - 1 : services.length - 1));
  };

  const handleNextService = () => {
    setCurrentServiceIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
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
      price: '₹500',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Serving Staff',
      description: 'Well-trained serving staff to ensure your guests receive excellent hospitality.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹300',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Professional Bartender',
      description: 'Expert bartenders who can craft signature cocktails and manage your bar service.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹400',
      rating: 4.7
    },
    {
      id: 4,
      title: 'Event Coordinator',
      description: 'Professional event coordinators to manage your party timeline and logistics.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹600',
      rating: 4.9
    },
    {
      id: 5,
      title: 'Kitchen Helper',
      description: 'Skilled kitchen assistants to support food preparation and service.',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹250',
      rating: 4.6
    },
    {
      id: 6,
      title: 'Cleanup Crew',
      description: 'Professional cleanup team to handle post-event cleaning and organization.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      price: '₹200',
      rating: 4.5
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
    <Box id={id} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>

      <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1, sm: 2 }, width: '100%', maxWidth: '100%' }}>
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

        {/* Search Bar and Menu Dropdown in Same Row */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            size="small"
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
              flex: { xs: 1, sm: 2 },
              bgcolor: 'white', 
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  border: '1px solid #bdbdbd'
                },
                '&.Mui-focused': {
                  border: '1px solid #1976d2'
                }
              }
            }}
          />
          <Box sx={{ flex: { xs: 1, sm: 0.5 }, Width: { xs: '100%', sm: 200 }, position: 'relative' }}>
            {bookingConfig?.menu && (
              <Typography 
                variant="caption" 
                sx={{ 
                  position: 'absolute', 
                  top: -8, 
                  left: 12, 
                  bgcolor: '#1976d2', 
                  color: 'white', 
                  px: 1, 
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  zIndex: 1
                }}
              >
                Selected from booking
              </Typography>
            )}
            <FormControl size="small" sx={{ width: '100%' }}>
              <Select
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value)}
                displayEmpty
                sx={{ 
                  bgcolor: bookingConfig?.menu === selectedMenu ? '#e3f2fd' : 'white',
                  borderRadius: '25px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px !important',
                    border: bookingConfig?.menu === selectedMenu ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': {
                      border: bookingConfig?.menu === selectedMenu ? '2px solid #1565c0' : '1px solid #bdbdbd'
                    },
                    '&.Mui-focused': {
                      border: '2px solid #1976d2'
                    }
                  },
                  '& .MuiSelect-select': {
                    borderRadius: '25px'
                  },
                  '& fieldset': {
                    borderRadius: '25px !important'
                  }
                }}
              >
                {menuOptions.map((option, index) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.label}
                      {bookingConfig?.menu === option.value && index === 0 && (
                        <Chip 
                          label="Your Selection" 
                          size="small" 
                          color="primary" 
                          sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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

        {/* Controls Layout - Responsive */}
        <Box sx={{ mb: 3 }}>
          {/* Mobile Layout - All controls in one row */}
          <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            alignItems: 'center', 
            gap: 1, 
            flexWrap: 'wrap', 
            justifyContent: 'flex-start' 
          }}>
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
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  height: 32,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    border: '1px solid #bdbdbd'
                  },
                  '&.Mui-focused': {
                    border: '1px solid #1976d2'
                  }
                }}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              placeholder="No. of Pax"
              value={numberOfPax}
              onChange={(e) => setNumberOfPax(e.target.value)}
              type="number"
              inputProps={{ min: 1, max: 1000 }}
              sx={{ 
                width: 100,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  height: 32,
                  fontSize: '0.75rem',
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    border: '1px solid #bdbdbd'
                  },
                  '&.Mui-focused': {
                    border: '1px solid #1976d2'
                  }
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.75rem',
                  padding: '6px 12px'
                }
              }}
            />
          </Box>

          {/* Desktop Layout - Split controls */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left side - Veg/Non-Veg filters */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  '& .MuiFormControlLabel-label': { fontSize: '0.75rem', fontWeight: 500 }
                }}
              />
            </Box>

            {/* Right side - Sort By and No of Pax */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                  sx={{ 
                    bgcolor: 'white', 
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    height: 32,
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      border: '1px solid #bdbdbd'
                    },
                    '&.Mui-focused': {
                      border: '1px solid #1976d2'
                    }
                  }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.75rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="No. of Pax"
                value={numberOfPax}
                onChange={(e) => setNumberOfPax(e.target.value)}
                type="number"
                inputProps={{ min: 1, max: 1000 }}
                sx={{ 
                  width: 100,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    height: 32,
                    fontSize: '0.75rem',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      border: '1px solid #bdbdbd'
                    },
                    '&.Mui-focused': {
                      border: '1px solid #1976d2'
                    }
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '0.75rem',
                    padding: '6px 12px'
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Error State */}
        {error && (
          <MenuLoadError 
            onRetry={loadMenuData}
            menuType={selectedMenu}
          />
        )}

        {/* Enhanced Loading State */}
        {loading && !error && (
          <MenuGridSkeleton count={8} />
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedItems.length === 0 && (
          <EmptyState
            title="No items found"
            message="Try adjusting your search filters or select a different menu type."
          />
        )}

        {/* Menu Items Grid */}
        {!loading && !error && filteredAndSortedItems.length > 0 && (
          <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
            {filteredAndSortedItems.map((item) => (
              <Grid item xs={6} sm={4} md={3} lg={3} key={item.id}>
                <Card
                  tabIndex={0}
                  className="menu-item-card"
                  role="button"
                  aria-label={`${item.name} - ${item.description} - ₹${item.price}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAddToCart(item);
                    }
                  }}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '100%',
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
                        startIcon={<Add />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(item);
                          }
                        }}
                        aria-label={`Add ${item.name} to cart`}
                        sx={{
                          bgcolor: '#1976d2',
                          color: 'white',
                          fontWeight: 'normal',
                          borderRadius: '20px',
                          '&:hover': {
                            bgcolor: '#1565c0'
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
        {!loading && filteredAndSortedItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No items found matching your criteria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        )}

        {/* Bespoke Services Section */}
        <Box 
          sx={{ 
            mt: 6, 
            mb: 4,
            py: 6,
            px: 3,
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: 3,
            position: 'relative'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 1,
              textAlign: 'center'
            }}
          >
            Bespoke Services
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Bite Affair offers professional, well-trained party waiters, bartenders, and bespoke services staff to 
            elevate your specific party needs and guarantee seamless service that matches the energy and elegance of your gathering.
          </Typography>

          <Box sx={{ position: 'relative', px: { xs: 2, sm: 6 } }}>
            {/* Left Arrow Button */}
            <IconButton
              onClick={handlePrevService}
              sx={{
                position: 'absolute',
                left: { xs: -10, sm: 0 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#1a237e',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronLeft sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>

            {/* Right Arrow Button */}
            <IconButton
              onClick={handleNextService}
              sx={{
                position: 'absolute',
                right: { xs: -10, sm: 0 },
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#1a237e',
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  transform: 'translateY(-50%) scale(1.1)',
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'hidden',
                pb: 2,
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  transform: `translateX(-${currentServiceIndex * 300}px)`,
                  transition: 'transform 0.3s ease-in-out',
                }}
              >
                {services.map((service) => (
                  <Card
                    key={service.id}
                    sx={{
                      minWidth: 280,
                      maxWidth: 280,
                      height: 'auto',
                      borderRadius: 3,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={service.image}
                      alt={service.title}
                      sx={{ 
                        height: 180,
                        objectFit: 'cover'
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 'bold',
                          mb: 1,
                          color: '#1a237e',
                          fontSize: '1.1rem'
                        }}
                      >
                        {service.title}
                      </Typography>
                      
                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', mr: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <Typography
                              key={i}
                              sx={{
                                color: i < Math.floor(service.rating) ? '#ffc107' : '#e0e0e0',
                                fontSize: '1rem'
                              }}
                            >
                              ★
                            </Typography>
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                          {service.rating}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, lineHeight: 1.5, fontSize: '0.875rem' }}
                      >
                        {service.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1a237e',
                            fontSize: '1rem'
                          }}
                        >
                          Starting {service.price}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: '#1976d2',
                            color: 'white',
                            borderRadius: '20px',
                            px: 2.5,
                            py: 0.5,
                            fontSize: '0.875rem',
                            '&:hover': {
                              bgcolor: '#1565c0'
                            }
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Dot Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 1 }}>
            {services.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentServiceIndex(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: currentServiceIndex === index ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    transform: 'scale(1.2)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Cart Summary */}
        <CartSummary onViewCart={onOpenCart || (() => setCartModalOpen(true))} />

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

        <CheckoutConfirmation
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={(details) => {
            console.log('Order confirmed with details:', details);
            setConfirmationOpen(false);
            navigate('/bite-affair/payment');
          }}
        />

        <CheckoutConfirmation
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={(details) => {
            console.log('Order confirmed with details:', details);
            setConfirmationOpen(false);
            navigate('/bite-affair/payment');
          }}
        />

        <CheckoutConfirmation
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={(details) => {
            console.log('Order confirmed with details:', details);
            setConfirmationOpen(false);
            navigate('/bite-affair/payment');
          }}
        />

        <CheckoutConfirmation
          open={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={(details) => {
            console.log('Order confirmed with details:', details);
            setConfirmationOpen(false);
            navigate('/bite-affair/payment');
          }}
        />

        <CartModal
          open={cartModalOpen}
          onClose={() => setCartModalOpen(false)}
          onCheckout={handleProceedToCheckout}
        />


      </Container>
    </Box>
  );
};

export default PartyPlatters;
