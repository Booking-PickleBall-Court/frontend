import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLangClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLangClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={1} sx={{ background: '#fff', color: '#222', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        {/* Logo + Tên app */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SportsTennisIcon sx={{ color: '#2563eb', fontSize: 36, mr: 1 }} />
          <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: '#2563eb', fontWeight: 700, fontSize: 24 }}>
            PickleNet
          </Typography>
        </Box>

        {/* Menu giữa */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button color="inherit" component={RouterLink} to="/" sx={{ textTransform: 'none', fontWeight: 500 }}>Home</Button>
          <Button color="inherit" component={RouterLink} to="/explore" sx={{ textTransform: 'none', fontWeight: 500 }}>Explore</Button>
          <Button color="inherit" component={RouterLink} to="/games" sx={{ textTransform: 'none', fontWeight: 500 }}>Games</Button>
          <Button color="inherit" component={RouterLink} to="/deals" sx={{ textTransform: 'none', fontWeight: 500 }}>Deals</Button>
        </Box>

        {/* Bên phải */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Ngôn ngữ */}
          <IconButton onClick={handleLangClick} color="inherit">
            <LanguageIcon />
            <Typography variant="body2" sx={{ ml: 0.5 }}>EN</Typography>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLangClose}>
            <MenuItem onClick={handleLangClose}>EN</MenuItem>
            <MenuItem onClick={handleLangClose}>VI</MenuItem>
          </Menu>
          <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>Help</Button>
          {!user.id && (
            <>
              <Button color="inherit" component={RouterLink} to="/register" sx={{ textTransform: 'none', fontWeight: 500 }}>Sign Up</Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: 'none',
                  ml: 1,
                  '&:hover': { background: '#1746a2' }
                }}
              >
                Log In
              </Button>
            </>
          )}
          {user.id && (
            <>
              <Button color="inherit" component={RouterLink} to="/bookings" sx={{ textTransform: 'none', fontWeight: 500 }}>My Bookings</Button>
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 