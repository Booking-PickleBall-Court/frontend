import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation, useNavigate } from "react-router-dom";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          Booking details not found.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Container>
    );
  }

  const {
    selectedVenue,
    selectedDate,
    selectedTime,
    selectedDuration,
    selectedCourts,
  } = bookingDetails;

  const formattedDate = selectedDate ? selectedDate.toDateString() : "N/A";

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 1px 6px rgb(0 0 0 / 0.1)",
          textAlign: "center",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 60, color: "success.main", mb: 3 }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "700", mb: 1 }}>
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your booking. Here are your booking details:
        </Typography>

        {selectedVenue && (
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Venue Details:
            </Typography>
            {selectedVenue.images && selectedVenue.images.length > 0 && (
              <Box
                component="img"
                src={selectedVenue.images[0]}
                alt={selectedVenue.name}
                sx={{
                  width: "100%",
                  height: 200,
                  borderRadius: 1,
                  objectFit: "cover",
                  boxShadow: "0 1px 3px rgb(0 0 0 / 0.2)",
                  mb: 2,
                }}
              />
            )}
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Name: {selectedVenue.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Address: {selectedVenue.address}
            </Typography>
            <Typography variant="body2">
              Category: {selectedVenue.categories.join(", ")}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ textAlign: "left", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Booking Information:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Date: {formattedDate}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Start Time: {selectedTime || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Duration: {selectedDuration ? `${selectedDuration} minutes` : "N/A"}
          </Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            Courts:{" "}
            {selectedCourts && selectedCourts.length > 0
              ? selectedCourts.join(", ")
              : "No courts selected"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#4263eb",
            color: "#fff",
            textTransform: "none",
            fontWeight: "700",
            fontSize: 16,
            height: 44,
            "&:hover": {
              bgcolor: "#3651d4",
            },
          }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
}

export default BookingConfirmation;
