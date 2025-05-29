import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../services/api';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Alert } from '@mui/material';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingAPI.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>My Bookings</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {bookings.length === 0 && <Typography>No bookings found.</Typography>}
            {bookings.map((booking) => (
              <ListItem key={booking.id} sx={{ border: '1px solid #eee', mb: 1, borderRadius: 1 }}>
                <ListItemText
                  primary={`Court: ${booking.court?.name || booking.courtName || ''}`}
                  secondary={`Date: ${booking.courtSlot?.date || booking.courtSlot?.startTime?.split('T')[0]}
                  | Time: ${booking.courtSlot?.startTime?.split('T')[1]?.slice(0,5)} - ${booking.courtSlot?.endTime?.split('T')[1]?.slice(0,5)}
                  | Status: ${booking.status}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default MyBookings; 