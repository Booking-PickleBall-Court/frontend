import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { courtAPI } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [venueData, setVenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await courtAPI.getAllCourts();
        setVenueData(response.data);
      } catch (error) {
        console.error("Error fetching court data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const handleSearch = ({ sport, where, when }) => {
    const params = new URLSearchParams();
    if (sport) params.append("sport", sport);
    if (where) params.append("where", where);
    if (when)
      params.append(
        "when",
        when instanceof Date ? when.toISOString().slice(0, 10) : when
      );
    navigate(`/explore?${params.toString()}`);
  };

  const handleViewCourtDetail = useCallback(
    (courtId) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      navigate(user.id ? `/courts/${courtId}` : "/login");
    },
    [navigate]
  );

  return (
    <>
      <Box sx={{ pt: 0, pb: 4 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Featured Venues
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {venueData.map((venue, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: "450px",
                      overflow: "hidden",
                      justifyContent: "space-between",
                      width: "320px",
                      margin: "auto",
                    }}
                  >
                    <img
                      src={venue.imageUrls?.[0]}
                      alt={venue.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        mt: 2,
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {venue.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {venue.address}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mt: 1 }}
                    >
                      {venue.hourlyPrice || "Liên hệ để biết giá"}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          borderRadius: "50px",
                          width: "48%",
                          background: "#fff",
                          color: "#4263eb",
                          border: "2px solid #4263eb",
                          "&:hover": { background: "#4263eb", color: "#fff" },
                        }}
                        onClick={() => handleViewCourtDetail(venue.id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "50px",
                          width: "48%",
                          backgroundColor: "#4263eb",
                          color: "white",
                          "&:hover": { backgroundColor: "#2541b2" },
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
