import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Restaurant,
  LocalDining,
  Cake,
  LocalBar,
  Search,
  FilterList
} from '@mui/icons-material';

const MenuTabs = ({ 
  selectedMenu, 
  setSelectedMenu, 
  dietaryFilter, 
  setDietaryFilter, 
  searchQuery, 
  setSearchQuery 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuTabs = [
    { value: 'jain', label: 'Jain Menu', icon: <Restaurant /> },
    { value: 'veg', label: 'Veg Menu', icon: <Restaurant /> },
    { value: 'customized', label: 'Customized Menu', icon: <Cake /> },
    { value: 'cocktail', label: 'Cocktail Party Menu', icon: <LocalBar /> },
    { value: 'packages', label: 'Package Menu', icon: <LocalDining /> }
  ];

  const dietaryOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'jain', label: 'Jain' },
    { value: 'veg', label: 'Vegetarian' },
    { value: 'non-veg', label: 'Non-Veg' }
  ];

  const handleMenuChange = (event, newValue) => {
    if (newValue !== null) {
      setSelectedMenu(newValue);
    }
  };

  const handleDietaryChange = (event, newFilter) => {
    if (newFilter !== null) {
      setDietaryFilter(newFilter);
    }
  };

  return (
    <Box id="menu" sx={{ mb: 4 }}>
      <Typography
        variant="h2"
        sx={{
          textAlign: 'center',
          mb: 4,
          color: 'text.primary',
          fontWeight: 'bold'
        }}
      >
        Our Menu Collection
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
          mb: 4
        }}
      >
        {/* Menu Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedMenu}
            onChange={handleMenuChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5
              }
            }}
          >
            {menuTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.icon}
                    <span>{tab.label}</span>
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          {/* Search */}
          <TextField
            placeholder="Search menu items..."
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
              minWidth: { xs: '100%', md: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Dietary Filter */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList color="action" />
              <Typography variant="body2" color="text.secondary">
                Filter:
              </Typography>
            </Box>
            
            <ToggleButtonGroup
              value={dietaryFilter}
              exclusive
              onChange={handleDietaryChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }
                }
              }}
            >
              {dietaryOptions.map((option) => (
                <ToggleButton key={option.value} value={option.value}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MenuTabs;
