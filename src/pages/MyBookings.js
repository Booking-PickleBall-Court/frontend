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
        const mergedBookings = mergeConsecutiveBookings(res.data);
        setBookings(mergedBookings);
      } catch (err) {
        setError("Không thể tải danh sách đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to merge consecutive bookings
  const mergeConsecutiveBookings = (bookings) => {
    if (!bookings || bookings.length === 0) return [];

    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = dayjs(a.startTime);
      const dateB = dayjs(b.startTime);
      if (!dateA.isSame(dateB, 'day')) {
        return dateB.isAfter(dateA) ? 1 : -1;
      }
      if (a.courtId !== b.courtId) {
        return String(a.courtId).localeCompare(String(b.courtId));
      }
      const aSubcourt = a.subCourts?.[0]?.name || a.subCourts?.[0]?.id || '';
      const bSubcourt = b.subCourts?.[0]?.name || b.subCourts?.[0]?.id || '';
      if (aSubcourt !== bSubcourt) {
        return String(aSubcourt).localeCompare(String(bSubcourt));
      }
      return dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1;
    });

    const mergedBookings = [];
    
    if (sortedBookings.length === 0) {
      return mergedBookings;
    }
    
    let currentGroup = [sortedBookings[0]];

    for (let i = 1; i < sortedBookings.length; i++) {
      const current = sortedBookings[i];
      const lastInGroup = currentGroup[currentGroup.length - 1];

      const isSameCourt = current.courtId === lastInGroup.courtId;
      const currentSubcourt = current.subCourts?.[0]?.name || current.subCourts?.[0]?.id;
      const lastSubcourt = lastInGroup.subCourts?.[0]?.name || lastInGroup.subCourts?.[0]?.id;
      const isSameSubcourt = currentSubcourt === lastSubcourt;
      const isSameStatus = current.status === lastInGroup.status;
      const isSamePayment = current.paymentMethod === lastInGroup.paymentMethod;
      const isSameDate = dayjs(current.startTime).format('YYYY-MM-DD') === dayjs(lastInGroup.startTime).format('YYYY-MM-DD');
      const isConsecutive = dayjs(current.startTime).isSame(dayjs(lastInGroup.endTime)) || 
                           Math.abs(dayjs(current.startTime).diff(dayjs(lastInGroup.endTime), 'minute')) <= 5;

      const shouldMerge = isSameCourt && isSameSubcourt && isSameStatus && isSamePayment && isSameDate && isConsecutive;

      if (shouldMerge) {
        currentGroup.push(current);
      } else {
        mergedBookings.push(mergeBookingGroup(currentGroup));
        currentGroup = [current];
      }
    }

    if (currentGroup.length > 0) {
      mergedBookings.push(mergeBookingGroup(currentGroup));
    }

    return mergedBookings.filter(booking => booking !== null);
  };

  const mergeBookingGroup = (bookingGroup) => {
    if (!bookingGroup || bookingGroup.length === 0) {
      return null;
    }
    
    if (bookingGroup.length === 1) {
      return {
        ...bookingGroup[0],
        mergedCount: 1,
        originalBookings: [bookingGroup[0]]
      };
    }

    const sortedGroup = bookingGroup.sort((a, b) => 
      dayjs(a.startTime).isBefore(dayjs(b.startTime)) ? -1 : 1
    );

    const firstBooking = sortedGroup[0];
    const lastBooking = sortedGroup[sortedGroup.length - 1];

    const allNotes = bookingGroup
      .map(b => b.notes)
      .filter(note => note && note.trim())
      .filter((note, index, arr) => arr.indexOf(note) === index);

    const totalPrice = bookingGroup.reduce((sum, booking) => {
      return sum + (booking.totalPrice || 0);
    }, 0);

    return {
      ...firstBooking,
      id: `merged_${firstBooking.id}_${lastBooking.id}`,
      startTime: firstBooking.startTime,
      endTime: lastBooking.endTime,
      totalPrice: totalPrice,
      notes: allNotes.length > 0 ? allNotes.join('; ') : (firstBooking.notes || ""),
      mergedCount: bookingGroup.length,
      originalBookings: bookingGroup
    };
  };

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

  const handleCourtClick = (booking) => {
    const courtId = booking.originalBookings ? booking.originalBookings[0].courtId : booking.courtId;
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
                  {bookings.some(b => b.mergedCount > 1) && (
                    <Typography variant="caption" sx={{ display: "block", color: "#6b7280", mt: 0.5 }}>
                      * Các booking liên tiếp đã được gộp lại để dễ xem
                    </Typography>
                  )}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

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
          <Box 
            sx={{ 
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh"
            }}
          >
            <Grid 
              container 
              spacing={4} 
              sx={{ 
                alignItems: "stretch",
                justifyContent: "center",
                maxWidth: { xs: "100%", lg: "1200px" },
                mx: "auto"
              }}
            >
            {bookings.map((booking) => {
              const start = dayjs(booking.startTime);
              const end = dayjs(booking.endTime);
              const statusColor = getStatusColor(booking.status);

              return (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  lg={4} 
                  key={booking.id} 
                  sx={{ 
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: 580,
                      width: { xs: "100%", lg: 360 },
                      maxWidth: 360,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 4px 20px rgba(5, 150, 105, 0.1)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 40px rgba(5, 150, 105, 0.25)"
                      }
                    }}
                    onClick={() => handleCourtClick(booking)}
                  >
                    <CardContent 
                      sx={{ 
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        gap: 0
                      }}
                    >
                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "flex-start",
                        mb: 2.5,
                        minHeight: 50
                      }}>
                        <Box sx={{ flex: 1, mr: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: "#065f46",
                              fontSize: "1.1rem",
                              lineHeight: 1.3,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            title={`${booking.courtName}${booking.subCourts?.[0]?.name ? ` - Sân ${booking.subCourts[0].name}` : ''}`}
                          >
                            {booking.courtName}
                          </Typography>
                          {booking.subCourts?.[0]?.name && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: "#0277bd",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                display: "block",
                                mt: 0.2
                              }}
                            >
                              Sân {booking.subCourts[0].name}
                            </Typography>
                          )}
                          {booking.mergedCount > 1 && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: "#059669",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                display: "block",
                                mt: 0.5
                              }}
                            >
                              Đặt {booking.mergedCount} khung giờ liên tiếp
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={getStatusText(booking.status)}
                          size="small"
                          sx={{
                            ...statusColor,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            minWidth: 85,
                            height: 26
                          }}
                        />
                      </Box>

                      <Divider sx={{ mb: 2.5, borderColor: "#d1fae5" }} />

                      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
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
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500, fontSize: "0.8rem", lineHeight: 1.2 }}>
                              Ngày đặt
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#065f46", fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.3 }}>
                              {start.format("DD/MM/YYYY")}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <Avatar
                            sx={{ 
                              bgcolor: "#ecfdf5", 
                              color: "#059669", 
                              width: 32, 
                              height: 32,
                              mt: 0.2
                            }}
                          >
                            <AccessTimeIcon fontSize="small" />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
                              <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500, fontSize: "0.8rem" }}>
                                Thời gian đặt sân
                              </Typography>
                              {booking.mergedCount > 1 && (
                                <Chip
                                  label={`${booking.mergedCount} khung giờ`}
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: "0.6rem",
                                    bgcolor: "#e0f2fe",
                                    color: "#0277bd",
                                    "& .MuiChip-label": {
                                      px: 1
                                    }
                                  }}
                                />
                              )}
                            </Box>
                            <Typography variant="body1" sx={{ color: "#065f46", fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.3 }}>
                              {start.format("HH:mm")} - {end.format("HH:mm")}
                            </Typography>
                            {booking.mergedCount > 1 && (
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="caption" sx={{ color: "#0277bd", fontSize: "0.7rem", lineHeight: 1.2, fontWeight: 500 }}>
                                  Tổng cộng: {Math.round(dayjs(booking.endTime).diff(dayjs(booking.startTime), 'minute') / 30)} × 30 phút
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.65rem", display: "block", lineHeight: 1.2 }}>
                                  Các khung: {booking.originalBookings.map((b, index) => 
                                    `${dayjs(b.startTime).format("HH:mm")}-${dayjs(b.endTime).format("HH:mm")}`
                                  ).join(", ")}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                          <Avatar
                            sx={{ 
                              bgcolor: "#ecfdf5", 
                              color: "#059669", 
                              width: 32, 
                              height: 32,
                              mt: 0.2
                            }}
                          >
                            <NotesIcon fontSize="small" />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500, fontSize: "0.8rem", lineHeight: 1.2 }}>
                              {booking.mergedCount > 1 ? "Thông tin đặt sân" : "Ghi chú"}
                            </Typography>
                            {booking.mergedCount > 1 ? (
                              <Box>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: "#065f46",
                                    fontSize: "0.85rem",
                                    lineHeight: 1.3,
                                    fontWeight: 500
                                  }}
                                >
                                  Đã đặt {booking.mergedCount} booking liên tiếp
                                  {booking.subCourts?.[0]?.name && ` tại Sân ${booking.subCourts[0].name}`}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: "#6b7280",
                                    fontSize: "0.7rem",
                                    lineHeight: 1.2,
                                    display: "block"
                                  }}
                                >
                                  Cùng sân{booking.subCourts?.[0]?.name ? ` (Sân ${booking.subCourts[0].name})` : ''}, cùng trạng thái, cùng phương thức thanh toán
                                </Typography>
                              </Box>
                            ) : (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: "#065f46",
                                  fontSize: "0.85rem",
                                  lineHeight: 1.3,
                                  overflow: "hidden",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  minHeight: "2.2em",
                                  maxHeight: "2.2em"
                                }}
                              >
                                {booking.notes || "Không có ghi chú"}
                              </Typography>
                            )}
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
                            <PaymentIcon fontSize="small" />
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 500, fontSize: "0.8rem", lineHeight: 1.2 }}>
                              Tổng tiền
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: "#059669", 
                                fontWeight: 700,
                                fontSize: "1rem",
                                lineHeight: 1.3
                              }}
                            >
                              {booking.totalPrice?.toLocaleString('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                              }) || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ 
                        mt: "auto",
                        pt: 2.5, 
                        borderTop: "1px solid #d1fae5",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        minHeight: 45
                      }}>
                        <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                          Phương thức thanh toán
                        </Typography>
                        <Chip
                          label={booking.paymentMethod || 'N/A'}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: "#a7f3d0",
                            color: "#059669",
                            fontSize: "0.7rem",
                            height: 24,
                            minWidth: 65
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default MyBooking;
