import React from 'react';
import {
  Box,
  Button,
  Typography,
  Slide,
  Paper
} from '@mui/material';
import { useCart } from '../../context/CartContext';

const CartSummary = ({ onViewCart }) => {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <Slide direction="up" in={totalItems > 0} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          bottom: { xs: 0, md: 20 },
          left: { xs: 0, md: '50%' },
          right: { xs: 0, md: 'auto' },
          transform: { xs: 'none', md: 'translateX(-50%)' },
          zIndex: 1000,
          bgcolor: '#1a237e',
          color: 'white',
          px: { xs: 2, md: 3 },
          py: { xs: 1.5, md: 2 },
          borderRadius: { xs: 0, md: 3 },
          minWidth: { xs: 'auto', md: 200 },
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'row', md: 'column' }
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {totalItems} Item{totalItems !== 1 ? 's' : ''} Added
        </Typography>
        <Button
          variant="contained"
          onClick={onViewCart}
          sx={{
            bgcolor: 'white',
            color: '#1a237e',
            fontWeight: 600,
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: '#f5f5f5'
            }
          }}
        >
          View Cart →
        </Button>
      </Paper>
    </Slide>
  );
};

export default CartSummary;
