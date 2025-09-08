import React from 'react';
import {
  Box,
  Button,
  Typography,
  Slide,
  Paper
} from '@mui/material';
import { useCart } from '../context/CartContext';

const CartSummary = ({ onViewCart }) => {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <Slide direction="up" in={totalItems > 0} mountOnEnter unmountOnExit>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          bgcolor: '#1a237e',
          color: 'white',
          px: 3,
          py: 2,
          borderRadius: 3,
          minWidth: 200,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          {totalItems} Item{totalItems > 1 ? 's' : ''} Added
        </Typography>
        <Button
          variant="contained"
          onClick={onViewCart}
          sx={{
            bgcolor: 'white',
            color: '#1a237e',
            fontWeight: 600,
            px: 3,
            py: 0.5,
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
