import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  Badge,
  Stack,
  Avatar,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsIcon from "@mui/icons-material/Sports";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingAPI } from "../services/api";
import dayjs from "dayjs";

function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const bookingIdsParam = searchParams.get("bookingIds");

  const bookingIds = useMemo(() => {
    return bookingIdsParam ? bookingIdsParam.split(",").map(Number) : [];
  }, [bookingIdsParam]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (status !== "success" || bookingIds.length === 0) {
        setError("Thanh toán không thành công hoặc không tìm thấy mã đặt sân.");
        setLoading(false);
        return;
      }
      try {
        const fetchedBookings = await Promise.all(
          bookingIds.map((id) =>
            bookingAPI.getBooking(id).then((res) => res.data)
          )
        );
        setBookings(fetchedBookings);
      } catch (err) {
        setError("Không thể tải thông tin đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingIds, status]);

  const groupedBookings = useMemo(() => {
    const map = new Map();

    bookings.forEach((booking) => {
      const courtId = booking.court?.id;
      const courtName = booking.court?.name || "N/A";

      if (!map.has(courtId)) {
        map.set(courtId, {
          courtName,
          items: [],
          totalPrice: 0,
        });
      }

      const group = map.get(courtId);
      group.items.push({
        subCourtName: booking.subCourts?.[0]?.name || "Sân",
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
      group.totalPrice += booking.totalPrice || 0;
    });

    return Array.from(map.values());
  }, [bookings]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ color: "#4263eb", mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Đang tải thông tin đặt sân...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 500, width: "100%" }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }}
            icon={<CheckCircleOutlineIcon />}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            size="large"
            startIcon={<EventAvailableIcon />}
            sx={{
              bgcolor: "#4263eb",
              color: "#fff",
              textTransform: "none",
              fontWeight: "600",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                bgcolor: "#3651d4",
              },
            }}
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
            bgcolor: "#fff",
            maxWidth: 600,
            width: "100%",
            border: "1px solid #e2e8f0",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#10b981",
              width: 80,
              height: 80,
              mx: "auto",
              mb: 3,
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Avatar>
          
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: "800", 
              mb: 2,
              color: "#1e293b",
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Đặt sân thành công!
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#64748b", 
              mb: 1,
              fontWeight: "400",
              lineHeight: 1.6
            }}
          >
            Cảm ơn bạn đã đặt sân tại hệ thống của chúng tôi
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#94a3b8", 
              mb: 5,
              fontSize: "0.95rem"
            }}
          >
            Thông tin chi tiết đặt sân của bạn được hiển thị bên dưới
          </Typography>

          <Divider sx={{ my: 4, borderColor: "#e2e8f0" }} />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 4 }}>
            <ReceiptIcon sx={{ color: "#64748b", fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: "600", color: "#475569" }}>
              Chi tiết đặt sân
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {groupedBookings.map((group, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#4263eb",
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    <SportsIcon sx={{ fontSize: 24, color: "#fff" }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: "700", 
                        color: "#1e293b",
                        lineHeight: 1.2
                      }}
                    >
                      {group.courtName}
                    </Typography>
                    <Badge 
                      badgeContent={group.items.length} 
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#10b981",
                          color: "#fff",
                          fontSize: "0.75rem",
                          fontWeight: "600"
                        }
                      }}
                    >
                      <Chip 
                        label="Slot đã đặt" 
                        size="small" 
                        sx={{
                          bgcolor: "#f1f5f9",
                          color: "#64748b",
                          fontWeight: "500",
                          fontSize: "0.75rem"
                        }}
                      />
                    </Badge>
                  </Box>
                </Box>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  {group.items.map((item, i) => (
                    <Paper 
                      key={i} 
                      elevation={0}
                      sx={{
                        p: 2.5,
                        bgcolor: "#f8fafc",
                        borderRadius: 2,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                        <Chip
                          label={item.subCourtName}
                          size="small"
                          sx={{
                            bgcolor: "#4263eb",
                            color: "#fff",
                            fontWeight: "600",
                            fontSize: "0.75rem",
                            mr: 1.5
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: "600", 
                            color: "#475569"
                          }}
                        >
                          {dayjs(item.startTime).format("DD/MM/YYYY")}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, color: "#64748b" }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#64748b",
                            fontWeight: "500"
                          }}
                        >
                          {dayjs(item.startTime).format("dddd")}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: "#64748b" }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#1e293b",
                            fontWeight: "600"
                          }}
                        >
                          {dayjs(item.startTime).format("HH:mm")} - {dayjs(item.endTime).format("HH:mm")}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>

                <Divider sx={{ my: 3, borderColor: "#e2e8f0" }} />

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PaymentIcon sx={{ fontSize: 20, color: "#64748b" }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#64748b",
                        fontWeight: "500"
                      }}
                    >
                      Tổng tiền:
                    </Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: "700", 
                      color: "#10b981",
                      fontSize: "1.1rem"
                    }}
                  >
                    {group.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<EventAvailableIcon />}
          sx={{
            bgcolor: "#4263eb",
            color: "#fff",
            textTransform: "none",
            fontWeight: "600",
            fontSize: "1rem",
            px: 5,
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(66, 99, 235, 0.3)",
            "&:hover": {
              bgcolor: "#3651d4",
              boxShadow: "0 6px 20px rgba(66, 99, 235, 0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
          onClick={() => navigate("/bookings")}
        >
          Xem lịch sử đặt sân
        </Button>
      </Box>
    </Container>
  );
}

export default BookingConfirmation;
