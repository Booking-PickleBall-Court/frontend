import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 'CLIENT', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              helperText="Format: +1234567890"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="CLIENT">Client</MenuItem>
              <MenuItem value="OWNER">Court Owner</MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register; 