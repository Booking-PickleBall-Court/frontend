import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import { bookingAPI } from "../services/api";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotesIcon from "@mui/icons-material/Notes";
import PaymentIcon from "@mui/icons-material/Payment";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getUserBookings();
        setBookings(res.data);
      } catch (err) {
        setError("Không thể tải danh sách đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return { bgcolor: "#d1fae5", color: "#065f46" };
      case 'pending':
        return { bgcolor: "#fef3c7", color: "#92400e" };
      case 'cancelled':
        return { bgcolor: "#fee2e2", color: "#991b1b" };
      default:
        return { bgcolor: "#f3f4f6", color: "#374151" };
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'paid':
        return "Đã xác nhận";
      case 'pending':
        return "Chờ xác nhận";
      case 'cancelled':
        return "Đã hủy";
      default:
        return status || "Không xác định";
    }
  };

  const handleCourtClick = (courtId) => {
    navigate(`/courts/${courtId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <CircularProgress sx={{ color: "#059669", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "#065f46" }}>
            Đang tải danh sách đặt sân...
          </Typography>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2
        }}
      >
        <Card sx={{ p: 4, textAlign: "center", borderRadius: 3, maxWidth: 400 }}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate("/")}
            sx={{
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              borderRadius: 2,
              px: 4,
              "&:hover": {
                background: "linear-gradient(135deg, #047857 0%, #065f46 100%)"
              }
            }}
          >
            Về trang chủ
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(5, 150, 105, 0.15)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)"
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isMobile && (
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{
                    bgcolor: "#ecfdf5",
                    color: "#059669",
                    "&:hover": { bgcolor: "#d1fae5" }
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
              <SportsTennisIcon 
                sx={{ 
                  fontSize: { xs: 28, md: 32 }, 
                  color: "#059669" 
                }} 
              />
              <Box>
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  sx={{ 
                    fontWeight: 700,
                    color: "#065f46",
                    mb: 0.5
                  }}
                >
                  Lịch sử đặt sân
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "#059669",
                    fontSize: { xs: "0.9rem", md: "1rem" }
                  }}
                >
                  Quản lý và theo dõi các lần đặt sân của bạn
                </Typography>
              </Box>
            </Box>
            
            {bookings.length > 0 && (
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: "#ecfdf5", 
                borderRadius: 2,
                border: "1px solid #a7f3d0"
              }}>
                <Typography variant="body2" sx={{ color: "#065f46", fontWeight: 500 }}>
                  Tổng số lần đặt sân: <strong>{bookings.length}</strong>
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card
            sx={{
              borderRadius: 3,
              textAlign: "center",
              p: 6,
              background: "rgba(255,255,255,0.95)"
            }}
          >
            <SportsTennisIcon 
              sx={{ 
                fontSize: 80, 
                color: "#a7f3d0", 
                mb: 2 
              }} 
            />
            <Typography variant="h6" sx={{ color: "#065f46", mb: 2 }}>
              Chưa có lịch sử đặt sân
            </Typography>
            <Typography variant="body1" sx={{ color: "#059669", mb: 3 }}>
              Bạn chưa thực hiện đặt sân nào. Hãy khám phá các sân có sẵn!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
              sx={{
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                borderRadius: 3,
                px: 4,
                py: 1.5,
                "&:hover": {
                  background: "linear-gradient(135deg, #047857 0%, #065f46 100%)"
                }
              }}
            >
              Khám phá sân ngay
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => {
              const start = dayjs(booking.startTime);
              const end = dayjs(booking.endTime);
              const statusColor = getStatusColor(booking.status);

              return (
                <Grid item xs={12} md={6} lg={4} key={booking.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 20px rgba(5, 150, 105, 0.1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 30px rgba(5, 150, 105, 0.2)"
                      }
                    }}
                    onClick={() => handleCourtClick(booking.courtId)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Court Name & Status */}
                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "flex-start",
                        mb: 2
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: "#065f46",
                            flex: 1,
                            mr: 1
                          }}
                        >
                          {booking.courtName}
                        </Typography>
                        <Chip
                          label={getStatusText(booking.status)}
                          size="small"
                          sx={{
                            ...statusColor,
                            fontWeight: 600,
                            fontSize: "0.75rem"
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2, borderColor: "#d1fae5" }} />

                      {/* Booking Details */}
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{ 
                              bgcolor: "#ecfdf5", 
                              color: "#059669", 
                              width: 32, 
                              height: 32 
                            }}
                          >
                            <CalendarTodayIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                              Ngày đặt
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#065f46", fontWeight: 600 }}>
                              {start.format("DD/MM/YYYY")}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{ 
                              bgcolor: "#ecfdf5", 
                              color: "#059669", 
                              width: 32, 
                              height: 32 
                            }}
                          >
                            <AccessTimeIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                              Thời gian
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#065f46", fontWeight: 600 }}>
                              {start.format("HH:mm")} - {end.format("HH:mm")}
                            </Typography>
                          </Box>
                        </Box>

                        {booking.notes && (
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                            <Avatar
                              sx={{ 
                                bgcolor: "#ecfdf5", 
                                color: "#059669", 
                                width: 32, 
                                height: 32 
                              }}
                            >
                              <NotesIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                                Ghi chú
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: "#065f46",
                                  fontSize: "0.875rem",
                                  lineHeight: 1.4
                                }}
                              >
                                {booking.notes}
                              </Typography>
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{ 
                              bgcolor: "#ecfdf5", 
                              color: "#059669", 
                              width: 32, 
                              height: 32 
                            }}
                          >
                            <PaymentIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500 }}>
                              Tổng tiền
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: "#059669", 
                                fontWeight: 700,
                                fontSize: "1.1rem"
                              }}
                            >
                              {booking.totalPrice?.toLocaleString('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }) || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      {/* Payment Method */}
                      <Box sx={{ 
                        mt: 3, 
                        pt: 2, 
                        borderTop: "1px solid #d1fae5",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          Phương thức thanh toán
                        </Typography>
                        <Chip
                          label={booking.paymentMethod || 'N/A'}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#a7f3d0",
                            color: "#059669",
                            fontSize: "0.75rem"
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MyBooking;
