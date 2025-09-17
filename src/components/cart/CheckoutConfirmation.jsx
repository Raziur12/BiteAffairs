import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import { Close, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckoutConfirmation = ({ open, onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is being rendered as a full page (route-based) or as a modal
  const isFullPage = location.pathname === '/bite-affair/checkout';
  
  const handleGoBack = () => {
    navigate('/bite-affair/cart');
  };

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    setLoading(true);
    // Simulate API call to send confirmation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);

    if (isFullPage) {
      navigate('/bite-affair/payment');
    } else {
      onConfirm({ name, email, phone });
    }
  };

  // Render as full page if accessed via route
  if (isFullPage) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ borderRadius: 3, p: 4 }}>
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
                Confirm Your Order
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Please provide your contact details to confirm your order.
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={!!errors.phone}
                helperText={errors.phone}
                variant="outlined"
                placeholder="10-digit phone number"
              />

              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={loading}
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
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Confirm Order'
                  )}
                </Button>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
              By confirming, you agree to proceed with the payment for your order.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Render as modal (original behavior)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3,
          background: '#f8f5f0 url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80) center/cover',
          backgroundBlendMode: 'overlay'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, position: 'relative', zIndex: 2 }}>
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
              Confirm Your Order
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please provide your details to receive order confirmation via Email, WhatsApp, or SMS.
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            required
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{ inputMode: 'tel' }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, position: 'relative', zIndex: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          sx={{
            bgcolor: '#1a237e',
            py: 1,
            fontSize: '1rem',
            fontWeight: 600,
            position: 'relative'
          }}
        >
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: 'white',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
          {loading ? 'Confirming...' : 'Proceed to Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutConfirmation;
