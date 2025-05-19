import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

function Home() {
  const navigate = useNavigate();

  // Xử lý tìm kiếm: nhận dữ liệu từ SearchBar và chuyển hướng
  const handleSearch = ({ sport, where, when }) => {
    const params = new URLSearchParams();
    if (sport) params.append('sport', sport);
    if (where) params.append('where', where);
    if (when) params.append('when', when instanceof Date ? when.toISOString().slice(0, 10) : when);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <Container maxWidth="lg">
      {/* SearchBar ở đầu trang */}
      <Box sx={{ pt: { xs: 2, md: 8 }, pb: 4 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Pickleball App
          </Typography>
          <Typography variant="body1" paragraph>
            This is a platform for pickleball enthusiasts to connect, schedule games, and manage tournaments.
          </Typography>
          <Typography variant="body1">
            Get started by logging in or creating a new account.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Home; 