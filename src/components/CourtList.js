import React from 'react';
import { Grid, Paper, Typography, Box, Button, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CourtList({ courts, page, totalPages, onPageChange }) {
  const navigate = useNavigate();

  const handleCourtClick = (courtId) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    navigate(user.id ? `/courts/${courtId}` : '/login');
  };

  return (
    <>
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
              {/* Image */}
              {court.imageUrls && court.imageUrls.length > 0 && (
                <img
                  src={court.imageUrls[0]}
                  alt={court.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              {/* Venue Details */}
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
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "normal",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {court.address}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mt: 1 }}
              >
                {court.hourlyPrice.toLocaleString('vi-VN')} VND/giờ
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                Loại sân: {court.courtType}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                Trạng thái: {court.status}
              </Typography>

              {/* Buttons */}
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

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => onPageChange(value)}
            color="primary"
          />
        </Box>
      )}
    </>
  );
}

export default CourtList; 