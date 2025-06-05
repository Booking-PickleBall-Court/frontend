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
    onSearch({ query: "" }); // reset kết quả khi xoá input
  };

  return (
    <Box
      sx={{
        width: "100%",
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/bg-home.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "#fff",
        py: 10,
        minHeight: "500px",
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
        }}
      >
        Get Active, Book Your Games Now
      </Typography>

      <Typography
        sx={{
          fontSize: "1.25rem",
          maxWidth: "800px",
          mb: 5,
          color: "#e2e8f0",
          textShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        Search for sports venues across Vietnam by court name or address.
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
          maxWidth: "700px",
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Enter court name or address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 2,
              py: 1,
              fontSize: "1rem",
              backgroundColor: "#f7fafc",
              borderRadius: "32px",
              height: "48px",
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
            px: 4,
            borderRadius: "32px",
            fontWeight: 600,
            fontSize: "1rem",
            background: "linear-gradient(to right, #4f46e5, #3b82f6)",
            height: "48px",
            "&:hover": {
              background: "linear-gradient(to right, #4338ca, #2563eb)",
            },
          }}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
}

export default SearchBar;
