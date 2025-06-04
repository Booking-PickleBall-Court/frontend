import { useEffect, useState, useCallback, useRef } from "react";
import {
  Typography,
  Grid,
  CircularProgress,
  Box,
  Pagination,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { courtAPI } from "../services/api";
import SearchBar from "../components/SearchBar";

function Explore() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearching, setIsSearching] = useState(false);

  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const result = {
      page: page - 1,
      size: 9,
    };

    const map = {
      where: "address",
      minPrice: "minPrice",
      maxPrice: "maxPrice",
      date: "date",
    };

    for (const [key, value] of Object.entries(map)) {
      const val = params.get(key)?.trim();
      if (val) {
        result[value] = val;
      }
    }

    return result;
  }, [location.search, page]);

  const searchCourts = useCallback(async (params) => {
    setIsSearching(true);
    try {
      setLoading(true);
      const response = await courtAPI.searchCourts(params);
      setCourts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch courts");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchCourts(buildSearchParams());
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [buildSearchParams, searchCourts]);

  const handleSearch = useCallback(
    (searchParams) => {
      const params = new URLSearchParams();

      if (searchParams.address) params.set("where", searchParams.address);
      if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
      if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
      if (searchParams.date) params.set("date", searchParams.date);

      setPage(1);
      navigate(`/explore?${params.toString()}`);
    },
    [navigate]
  );

  const handleCourtClick = useCallback(
    (courtId) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      navigate(user.id ? `/courts/${courtId}` : "/login");
    },
    [navigate]
  );

  if (loading && !isSearching) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <SearchBar onSearch={handleSearch} />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Danh sách sân hiện có
      </Typography>

      {isSearching && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 1 }}>Đang tìm kiếm...</Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {courts.map((court) => (
          <Grid item xs={12} sm={6} md={4} key={court.id}>
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
                src={court.imageUrls?.[0] || "/placeholder.jpg"} // fallback nếu không có ảnh
                alt={court.name}
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
                {court.name}
              </Typography>
              <Typography variant="body2">{court.address}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
                {court.hourlyPrice} VND / giờ
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
                  onClick={() => handleCourtClick(court.id)}
                >
                  Xem
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
                  Đặt ngay
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
}

export default Explore;
