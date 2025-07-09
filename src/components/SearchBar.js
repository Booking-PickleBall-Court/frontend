import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ query: query.trim() });
  };

  const handleClear = () => {
    setQuery("");
    onSearch({ query: "" }); 
  };

  return (
    <Box        sx={{
          width: "100%",
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/bg-home.avif")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          color: "#fff",
          py: { xs: 6, sm: 8, md: 10 },
          minHeight: { xs: "400px", sm: "450px", md: "500px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 2,
        }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 2,
          textShadow: "0 2px 12px rgba(0, 0, 0, 0.2)",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }
        }}
      >
        Tìm kiếm và đặt sân 
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
          maxWidth: "800px",
          mb: 5,
          color: "#e2e8f0",
          textShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
          px: { xs: 2, sm: 0 }
        }}
      >
        Tìm kiếm địa điểm pickle ball trên khắp Việt Nam theo tên sân hoặc địa chỉ.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", sm: "row" },
          backgroundColor: "rgba(255,255,255,0.95)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          backdropFilter: "blur(6px)",
          borderRadius: "48px",
          px: 3,
          py: 1.5,
          width: "100%",
          maxWidth: { xs: "100%", sm: "600px", md: "700px" },
          mx: { xs: 2, sm: 0 }
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Nhập tên sân hoặc địa chỉ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 2,
              py: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              backgroundColor: "#f7fafc",
              borderRadius: "32px",
              height: { xs: "44px", sm: "48px" },
            },
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<SearchIcon />}
          sx={{
            px: { xs: 3, sm: 4 },
            borderRadius: "32px",
            fontWeight: 600,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            background: "linear-gradient(to right, #4f46e5, #3b82f6)",
            height: { xs: "44px", sm: "48px" },
            minWidth: { xs: "auto", sm: "120px" },
            "&:hover": {
              background: "linear-gradient(to right, #4338ca, #2563eb)",
            },
          }}
        >
          Tìm
        </Button>
      </Box>
    </Box>
  );
}

export default SearchBar;
