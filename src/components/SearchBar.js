import React, { useState, useCallback } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfDay } from "date-fns";

function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    sport: "",
    address: "",
    date: null,
  });

  const [errors, setErrors] = useState({});

  const validateParams = useCallback((params) => {
    const newErrors = {};

    if (params.date) {
      const today = startOfDay(new Date());
      const selectedDate = startOfDay(new Date(params.date));

      if (selectedDate < today) {
        newErrors.date = "Không thể chọn ngày trong quá khứ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!validateParams(searchParams)) {
      return;
    }

    if (onSearch) {
      const filteredParams = Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
          if (value !== null && value !== "" && value !== undefined) {
            if (key === "date" && value) {
              const date = startOfDay(new Date(value));
              acc[key] = format(date, "yyyy-MM-dd");
            } else {
              acc[key] = value;
            }
          }
          return acc;
        },
        {}
      );
      onSearch(filteredParams);
    }
  };

  const handleChange = (field) => (event) => {
    setSearchParams((prev) => {
      const newParams = { ...prev, [field]: event.target.value };
      validateParams(newParams);
      return newParams;
    });
  };

  const handleDateChange = (newValue) => {
    setSearchParams((prev) => {
      const newParams = { ...prev, date: newValue };
      validateParams(newParams);
      return newParams;
    });
  };

  return (
    <Box
      className="hero-section"
      sx={{
        position: "relative",
        width: "100%",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/bg-home.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        color: "white",
        padding: "90px 10px 70px 10px",
        textAlign: "center",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Hero Content */}
      <Box className="hero-content" sx={{ maxWidth: 2000, margin: "0 auto" }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "2.8rem",
            fontWeight: "600",
            marginBottom: "18px",
            textShadow: "0 2px 12px rgba(0, 0, 0, 0.18)",
          }}
        >
          Get Active, Book Your Games Now
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "38px",
            textShadow: "0 2px 8px rgba(0, 0, 0, 0.13)",
            color: "#fff",
          }}
        >
          From favorites like badminton and futsal to trendy pickleball and
          frisbee, play all kinds of sports nationwide!
        </Typography>

        {/* Search Box */}
        <Box
          className="search-container"
          sx={{
            backgroundColor: "white",
            borderRadius: "48px",
            padding: "40px 32px",
            maxWidth: "1200px", // Increased width of the container for better spacing
            boxShadow: "0 4px 32px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "row", // Changed to row for horizontal layout
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            gap: "16px", // Reduced gap for a more compact design
          }}
        >
          {/* Sport Selection */}
          <Box className="search-item" sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "1.18rem",
                marginBottom: "8px",
              }}
            >
              Sport
            </Typography>
            <TextField
              label="Select a sport"
              value={searchParams.sport}
              onChange={handleChange("sport")}
              size="small"
              variant="filled"
              sx={{
                width: "100%",
                padding: "12px",
                borderRadius: "50px", // Rounded corners
                fontSize: "1.15rem",
                background: "#fafbfc",
                boxShadow: "none",
                "& .MuiInputBase-root": {
                  backgroundColor: "#fafbfc",
                  textAlign: "center", // Center text
                },
                "& .MuiFilledInput-root": {
                  backgroundColor: "#fafbfc",
                },
              }}
              InputProps={{
                disableUnderline: true, // Disable underline
              }}
            />
          </Box>

          {/* Venue Search */}
          <Box className="search-item" sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "1.18rem",
                marginBottom: "8px",
              }}
            >
              Where
            </Typography>
            <TextField
              label="Search district, city"
              value={searchParams.address}
              onChange={handleChange("address")}
              size="small"
              variant="filled"
              sx={{
                width: "100%",
                padding: "12px",
                borderRadius: "50px",
                fontSize: "1.15rem",
                background: "#fafbfc",
                boxShadow: "none",
                "& .MuiInputBase-root": {
                  backgroundColor: "#fafbfc",
                  textAlign: "center",
                },
                "& .MuiFilledInput-root": {
                  backgroundColor: "#fafbfc",
                },
              }}
              InputProps={{
                disableUnderline: true, // Disable underline
              }}
            />
          </Box>

          {/* Date Picker */}
          <Box className="search-item" sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: "1.18rem",
                marginBottom: "8px",
              }}
            >
              When
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Pick a date"
                value={searchParams.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !!errors.date,
                    helperText: errors.date,
                    variant: "filled", // Using filled variant for the date picker
                    sx: {
                      padding: "12px",
                      borderRadius: "50px", // Rounded corners
                      backgroundColor: "#fafbfc",
                      textAlign: "center",
                      "& .MuiInputBase-root": {
                        backgroundColor: "#fafbfc",
                        border: "none",
                      },
                    },
                  },
                }}
                minDate={startOfDay(new Date())}
              />
            </LocalizationProvider>
          </Box>

          {/* Search Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            sx={{
              background: "#4263eb",
              color: "white",
              borderRadius: "50px",
              padding: "12px 40px", // Reduced padding
              fontWeight: 700,
              fontSize: "1.15rem", // Reduced font size
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "background 0.2s",
              "&:hover": { background: "#2541b2" },
              width: "100%",
              maxWidth: "240px",
              marginTop: "22px", // Reduced margin-top
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SearchBar;
