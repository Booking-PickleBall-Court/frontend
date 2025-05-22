import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CourtList from "../components/CourtList";
import { courtAPI } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCourts = useCallback(async (params = {}) => {
    setIsSearching(true);
    try {
      setLoading(true);
      const response = await courtAPI.searchCourts({
        page: page - 1,
        size: 9,
        ...params
      });
      setCourts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch courts');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleSearch = ({ sport, where, when }) => {
    const params = {};
    if (sport) params.courtType = sport;
    if (where) params.address = where;
    if (when) params.date = when instanceof Date ? when.toISOString().slice(0, 10) : when;
    
    setPage(1);
    fetchCourts(params);
  };

  return (
    <>
      {/* SearchBar Section */}
      <Box sx={{ pt: 0, pb: 4 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <Container>
        {/* Featured Venues Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Featured Venues
          </Typography>

          {loading && !isSearching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}

              {isSearching && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress />
                  <Typography sx={{ ml: 1 }}>Đang tìm kiếm...</Typography>
                </Box>
              )}

              <CourtList
                courts={courts}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;
