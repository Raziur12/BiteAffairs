import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Add,
  Remove
} from '@mui/icons-material';

const PartyPlatters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenu, setSelectedMenu] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');

  const menuOptions = [
    { value: '', label: 'Jain Menu' },
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

  const sampleItems = [
    {
      id: 1,
      name: 'Paneer Tikka Platter',
      description: 'Grilled cottage cheese cubes with aromatic spices',
      price: 280,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isJain: true,
      isVeg: true,
      category: 'Appetizers'
    },
    {
      id: 2,
      name: 'Mixed Veg Platter',
      description: 'Assorted vegetarian appetizers and snacks',
      price: 450,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isJain: false,
      isVeg: true,
      category: 'Platters'
    },
    {
      id: 3,
      name: 'Deluxe Party Package',
      description: 'Complete meal for 15-20 people with multiple courses',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      isJain: false,
      isVeg: true,
      category: 'Packages'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Choose Your Party Platters
        </Typography>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
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
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              />
            </Grid>

            {/* Menu Filter */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <Select
                  value={selectedMenu}
                  onChange={(e) => setSelectedMenu(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                >
                  {menuOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: 'white' }}
                  startAdornment={<LocationOn sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="">Location</MenuItem>
                  <MenuItem value="gurugram">Gurugram</MenuItem>
                  <MenuItem value="delhi">Delhi</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Event Date */}
            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                sx={{ bgcolor: 'white' }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Items Grid */}
        <Grid container spacing={3}>
          {sampleItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {item.isJain && (
                        <Chip label="Jain" size="small" color="success" variant="outlined" />
                      )}
                      {item.isVeg && (
                        <Chip label="Veg" size="small" color="success" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ₹{item.price}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" color="primary">
                        <Remove />
                      </IconButton>
                      <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                        0
                      </Typography>
                      <IconButton size="small" color="primary">
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PartyPlatters;
