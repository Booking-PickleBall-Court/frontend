import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Grid, Paper, CircularProgress } from "@mui/material";
import { Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExploreIcon from "@mui/icons-material/Explore";
import { courtAPI } from "../services/api";

const CourtDetail = () => {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourtDetails();
  }, [id]);

  const fetchCourtDetails = async () => {
    try {
      setLoading(true);
      const response = await courtAPI.getCourtById(id);
      setCourt(response.data);
    } catch (err) {
      setError('Failed to fetch court details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!court) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" sx={{ mt: 4 }}>
          Court not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Top Section with Name, Address, and Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        {/* Left side: Venue Name and Address */}
        <Box sx={{ flex: 1, paddingRight: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "600", marginBottom: 2 }}>
            {court.name}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Address:</strong> {court.address}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Price:</strong> {court.hourlyPrice.toLocaleString('vi-VN')} VND/giờ
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <strong>Description:</strong> {court.description}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <strong>Type:</strong> {court.courtType}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <strong>Status:</strong> {court.status}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <strong>Owner:</strong> {court.ownerName}
          </Typography>
        </Box>

        {/* Right side: Availability and Book Now buttons */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            sx={{
              borderRadius: "50px",
              width: "100%",
              background: "#fff",
              color: "#4263eb",
              border: "2px solid #4263eb",
              "&:hover": { background: "#4263eb", color: "#fff" },
            }}
          >
            Availability
          </Button>
          <Button
            variant="contained"
            startIcon={<ExploreIcon />}
            sx={{
              backgroundColor: "#4263eb",
              color: "white",
              borderRadius: "50px",
              width: "100%",
              "&:hover": { backgroundColor: "#2541b2" },
            }}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      {/* Venue Images */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {court.imageUrls && court.imageUrls.map((image, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper elevation={3} sx={{ padding: 1 }}>
              <img
                src={image}
                alt={`court-image-${index}`}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Categories & Pricing Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Categories & Pricing
        </Typography>
        <Typography variant="body1">Type: {court.courtType}</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Price: {court.hourlyPrice.toLocaleString('vi-VN')} VND/giờ
        </Typography>
      </Box>

      {/* Amenities Section */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Court Information
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Chip label={`Type: ${court.courtType}`} variant="outlined" />
          <Chip label={`Status: ${court.status}`} variant="outlined" />
          <Chip label={`Owner: ${court.ownerName}`} variant="outlined" />
        </Box>
      </Box>

      {/* Directions Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Getting There
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body1">{court.address}</Typography>
          <Button 
            variant="contained" 
            sx={{ borderRadius: "50px" }}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(court.address)}`, '_blank')}
          >
            Open in Google Maps
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CourtDetail;
