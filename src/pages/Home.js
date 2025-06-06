import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { courtAPI } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [allVenues, setAllVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(6);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await courtAPI.getAllCourts();
        setAllVenues(response.data);
        setFilteredVenues(response.data);
      } catch (error) {
        console.error("Error fetching court data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s]/g, "");

  const handleSearch = ({ query }) => {
    const searchTerm = normalize(query || "");

    if (!searchTerm) {
      setFilteredVenues(allVenues);
    } else {
      const filtered = allVenues.filter((venue) => {
        const name = normalize(venue.name);
        const address = normalize(venue.address);
        return name.includes(searchTerm) || address.includes(searchTerm);
      });
      setFilteredVenues(filtered);
    }
    setCurrentPage(1);
  };

  const handleViewCourtDetail = useCallback(
    (courtId) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      navigate(user.id ? `/courts/${courtId}` : "/login");
    },
    [navigate]
  );

  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(
    indexOfFirstVenue,
    indexOfLastVenue
  );

  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
          ) : filteredVenues.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 3 }}>
              Không tìm thấy sân phù hợp.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {currentVenues.map((venue, index) => (
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
                      width: "366px",
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
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {venue.name}
                    </Typography>
                    <Typography variant="body2">{venue.address}</Typography>
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

          {filteredVenues.length > venuesPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
