import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { courtSlotAPI, paymentAPI } from '../services/api';
import { Container, Typography, Box, Paper, Button, Alert, CircularProgress } from '@mui/material';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Payment() {
  const query = useQuery();
  const slotId = query.get('slotId');
  const [slot, setSlot] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (slotId) fetchSlot();
  }, [slotId]);

  const fetchSlot = async () => {
    try {
      const res = await courtSlotAPI.getCourtSlot(slotId);
      console.log('Slot data:', res.data);
      setSlot(res.data);
      if (res.data.available === false || res.data.status !== 'AVAILABLE') {
        setError('Slot này đã được book hoặc không còn khả dụng.');
      }
    } catch (err) {
      setError('Failed to load slot info');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!slot) return;

    setPaying(true);
    try {
      const res = await paymentAPI.createCheckoutSession({
        courtSlotId: slot.id, 
        paymentMethod: 'CARD',
        notes: '',
        amount: slot.price * 100,
        currency: 'usd',
        productName: 'Court Slot Booking'
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError('Failed to initiate payment');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading slot information...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Payment</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {slot && (
            <>
              <Typography>Date: {slot.date || slot.startTime?.split('T')[0]}</Typography>
              <Typography>Time: {slot.startTime?.split('T')[1]?.slice(0, 5)} - {slot.endTime?.split('T')[1]?.slice(0, 5)}</Typography>
              <Typography>Price: ${slot.price}</Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleCheckout}
                disabled={paying || !slot || slot.available === false || slot.status !== 'AVAILABLE'}
                fullWidth
              >
                {paying ? 'Redirecting...' : 'Pay with Stripe'}
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Payment;
