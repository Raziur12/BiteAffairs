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
  Chip
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const CartModal = ({ open, onClose }) => {
  const { items, totalItems, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Your Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add some delicious items to get started!
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                    <Box
                      component="img"
                      src={getItemImage(item.image, item.name)}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.name}
                      </Typography>
                      
                      {item.customizations && (
                        <Box sx={{ mb: 1 }}>
                          {item.customizations.starters?.length > 0 && (
                            <Box sx={{ mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Starters: {item.customizations.starters.join(', ')}
                              </Typography>
                            </Box>
                          )}
                          {item.customizations.mainCourse?.length > 0 && (
                            <Box sx={{ mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Main: {item.customizations.mainCourse.join(', ')}
                              </Typography>
                            </Box>
                          )}
                          {item.customizations.breads?.length > 0 && (
                            <Box sx={{ mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Breads: {item.customizations.breads.join(', ')}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                      
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a237e', mb: 1 }}>
                        ₹{item.price * item.quantity}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          sx={{ bgcolor: '#f5f5f5' }}
                        >
                          <Remove sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography variant="body1" sx={{ minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          sx={{ bgcolor: '#f5f5f5' }}
                        >
                          <Add sx={{ fontSize: 16 }} />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{ ml: 2, color: 'error.main' }}
                        >
                          <Delete sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < items.length - 1 && <Divider sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      {items.length > 0 && (
        <DialogActions sx={{ p: 3, pt: 1, flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CartModal;
