import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Container,
  Paper
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartModal = ({ open, onClose, onCheckout }) => {
  const { items, totalItems, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is being rendered as a full page (route-based) or as a modal
  const isFullPage = location.pathname === '/bite-affair/cart';
  
  const handleGoBack = () => {
    navigate('/bite-affair/home');
  };
  
  const handleProceedToCheckout = () => {
    if (isFullPage) {
      navigate('/bite-affair/checkout');
    } else {
      onCheckout();
    }
  };

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

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // Render as full page if accessed via route
  if (isFullPage) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 2, sm: 4 }, maxWidth: '500px', mx: 'auto' }}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton 
                onClick={handleGoBack}
                sx={{ 
                  mr: 2,
                  bgcolor: '#f0f0f0',
                  '&:hover': {
                    bgcolor: '#e0e0e0'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 'bold', flex: 1 }}>
                Your Cart ({totalItems} items)
              </Typography>
            </Box>

            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Your cart is empty
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Add some delicious items from our menu!
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleGoBack}
                  sx={{ bgcolor: '#1a237e' }}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <>
                <List sx={{ mb: 3 }}>
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      <ListItem sx={{ py: 2, px: 0 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          width: '100%', 
                          alignItems: 'flex-start',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 2, sm: 0 }
                        }}>
                          {/* Item Image */}
                          <Box
                            component="img"
                            src={getItemImage(item.image, item.name)}
                            alt={item.name}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              objectFit: 'cover',
                              mr: 2
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          
                          {/* Item Details */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600, 
                                mb: 0.5,
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                lineHeight: 1.2,
                                wordBreak: 'break-word'
                              }}
                            >
                              {item.name}
                            </Typography>
                            {item.customizations && Object.keys(item.customizations).length > 0 && (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                {Object.entries(item.customizations).map(([key, value]) => (
                                  <Chip
                                    key={key}
                                    label={`${key}: ${value}`}
                                    size="small"
                                    sx={{ 
                                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                      height: { xs: 20, sm: 24 },
                                      maxWidth: '100%',
                                      '& .MuiChip-label': {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                            >
                              ₹{item.price} each
                            </Typography>
                          </Box>

                          {/* Quantity Controls and Price - Mobile Responsive */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            width: { xs: '100%', sm: 'auto' },
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 2, sm: 1 },
                            mt: { xs: 1, sm: 0 }
                          }}>
                            {/* Quantity Controls */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, order: { xs: 2, sm: 1 } }}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                sx={{ 
                                  bgcolor: '#f5f5f5',
                                  '&:hover': { bgcolor: '#e0e0e0' }
                                }}
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                              <Typography sx={{ 
                                minWidth: '24px', 
                                textAlign: 'center', 
                                fontWeight: 600,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                sx={{ 
                                  bgcolor: '#f5f5f5',
                                  '&:hover': { bgcolor: '#e0e0e0' }
                                }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => removeItem(item.id)}
                                sx={{ 
                                  color: 'error.main',
                                  ml: 1,
                                  '&:hover': { bgcolor: 'error.light', color: 'white' }
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>

                            {/* Price */}
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                color: '#1a237e',
                                order: { xs: 1, sm: 2 }
                              }}
                            >
                              ₹{item.price * item.quantity}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>

                {/* Cart Summary */}
                <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Total: ₹{getTotalPrice()}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={clearCart}
                      size="small"
                      sx={{ color: 'error.main', borderColor: 'error.main' }}
                    >
                      Clear Cart
                    </Button>
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleProceedToCheckout}
                    sx={{
                      bgcolor: '#1a237e',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#303f9f'
                      }
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  // Render as modal with improved mobile responsiveness
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: { xs: '85vh', sm: '70vh' },
          maxWidth: { xs: '95vw', sm: '500px' },
          width: '100%',
          margin: { xs: 1, sm: 2 }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={onClose}
              sx={{ 
                mr: 1,
                p: 0.5,
                '&:hover': {
                  bgcolor: '#f0f0f0'
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Your Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, px: { xs: 2, sm: 3 } }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Add some delicious items from our menu!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                  <Box
                    component="img"
                    src={getItemImage(item.image, item.name)}
                    alt={item.name}
                    sx={{
                      width: { xs: 50, sm: 60 },
                      height: { xs: 50, sm: 60 },
                      borderRadius: 2,
                      objectFit: 'cover',
                      mr: { xs: 1.5, sm: 2 },
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 0.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.2
                      }}
                    >
                      {item.name}
                    </Typography>
                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {Object.entries(item.customizations).map(([key, value]) => (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            size="small"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                        ))}
                      </Box>
                    )}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      ₹{item.price} each
                    </Typography>
                    
                    {/* Mobile: Stack quantity controls and price */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mt: 1,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 0 }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, order: { xs: 2, sm: 1 } }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          sx={{ 
                            p: { xs: 0.3, sm: 0.5 },
                            bgcolor: '#f5f5f5',
                            '&:hover': { bgcolor: '#e0e0e0' }
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ 
                          minWidth: '24px', 
                          textAlign: 'center', 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          sx={{ 
                            p: { xs: 0.3, sm: 0.5 },
                            bgcolor: '#f5f5f5',
                            '&:hover': { bgcolor: '#e0e0e0' }
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{ 
                            p: { xs: 0.3, sm: 0.5 }, 
                            color: 'error.main', 
                            ml: 1,
                            '&:hover': { bgcolor: 'error.light', color: 'white' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          color: '#1a237e',
                          order: { xs: 1, sm: 2 }
                        }}
                      >
                        ₹{item.price * item.quantity}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
                {items.indexOf(item) < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      {items.length > 0 && (
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: 1, 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 2 } 
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%', 
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: '#1a237e'
              }}
            >
              Total: ₹{getTotalPrice()}
            </Typography>
            <Button
              variant="outlined"
              onClick={clearCart}
              size="small"
              sx={{ 
                color: 'error.main', 
                borderColor: 'error.main',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 2, sm: 3 }
              }}
            >
              Clear Cart
            </Button>
          </Box>
          
          <Button
            fullWidth
            variant="contained"
            onClick={handleProceedToCheckout}
            sx={{
              bgcolor: '#1a237e',
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#303f9f'
              }
            }}
          >
            Proceed to Checkout
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CartModal;
