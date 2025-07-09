import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  Button, 
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Alert
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import PaymentIcon from "@mui/icons-material/Payment";
import { courtAPI, bookingAPI, paymentAPI } from "../services/api";

dayjs.extend(isSameOrAfter);

const times = [
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

const lockedSlots = ["05:00", "05:30", "06:00", "06:30", "07:00"];

const ScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentLockedSlots, setCurrentLockedSlots] = useState([]);
  const [subCourts, setSubCourts] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [courtHourlyPrice, setCourtHourlyPrice] = useState(0);
  const [courtName, setCourtName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Lấy courtId từ query param
  const searchParams = new URLSearchParams(location.search);
  const courtId = searchParams.get("courtId");

  // Fetch subCourts và hourlyPrice khi courtId thay đổi
  useEffect(() => {
    if (courtId) {
      courtAPI.getCourtById(courtId).then(res => {
        setSubCourts(res.data.subCourts || []);
        setCourtHourlyPrice(res.data.hourlyPrice || 0);
        setCourtName(res.data.name || "");
      });
    }
  }, [courtId]);

  useEffect(() => {
    if (courtId && selectedDate) {
      bookingAPI.getBookedSlots(courtId, dayjs(selectedDate).format("YYYY-MM-DD"))
        .then(res => setBookedSlots(res.data.bookedSlots || []));
    } else {
      setBookedSlots([]);
    }
  }, [courtId, selectedDate]);

  const updateLockedSlots = useCallback(() => {
    const now = dayjs();
    const currentTime = now.format("HH:mm");
    const isToday =
      now.format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD");

    if (isToday) {
      const newLockedSlots = times.filter((time) => time <= currentTime);
      setCurrentLockedSlots([...lockedSlots, ...newLockedSlots]);
    } else {
      setCurrentLockedSlots(lockedSlots);
    }
  }, [selectedDate]);

  useEffect(() => {
    updateLockedSlots();
    const interval = setInterval(updateLockedSlots, 60000);
    return () => clearInterval(interval);
  }, [selectedDate, updateLockedSlots]);

  const toggleSlot = (time, court) => {
    if (
      bookedSlots.includes(`${time}-${court}`) ||
      currentLockedSlots.includes(time)
    )
      return;
    const slot = `${time}-${court}`;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const totalMinutes = selectedSlots.length * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalHours = `${hours}:${minutes === 0 ? "00" : minutes}`;

  const isSlotBooked = (time, subCourtId) => {
    const date = dayjs(selectedDate).format("YYYY-MM-DD");
    const slotStart = dayjs(`${date}T${time}:00`);
    return bookedSlots.some(bs => {
      const bsStart = dayjs(bs.startTime);
      const bsEnd = dayjs(bs.endTime);
      return (
        slotStart.isSameOrAfter(bsStart) &&
        slotStart.isBefore(bsEnd) &&
        bs.subCourtIds.includes(subCourtId)
      );
    });
  };

  const handleBooking = () => {
    if (!courtId || selectedSlots.length === 0) {
      alert("Vui lòng chọn khung giờ!");
      return;
    }
    const date = dayjs(selectedDate).format("YYYY-MM-DD");

    const bookings = selectedSlots.map(slot => {
      const [timeStr, subCourtIdStr] = slot.split("-");
      const subCourtId = Number(subCourtIdStr);
      const startTime = `${date}T${timeStr}:00`;
      const endTime = dayjs(startTime).add(30, "minute").format("YYYY-MM-DDTHH:mm:ss");

      return {
        subCourtId,
        startTime,
        endTime,
      };
    });

    const bookingData = {
      courtId: Number(courtId),
      bookings,
      notes: `Booking for ${selectedSlots.length} slots`,
      paymentMethod: "CARD",
    };
    paymentAPI.createCheckoutSession(bookingData)
      .then(res => {
        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          alert("Không nhận được link thanh toán!");
        }
      })
      .catch(() => alert("Đặt sân hoặc thanh toán thất bại!"));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: "100%", md: "1400px" },
          mx: "auto",
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* Header */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)"
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{
                    bgcolor: "#f1f5f9",
                    color: "#4263eb",
                    "&:hover": { bgcolor: "#e2e8f0" }
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    sx={{ 
                      fontWeight: 700,
                      color: "#1a202c",
                      mb: 0.5
                    }}
                  >
                    {courtName || "Đặt lịch sân"}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5
                    }}
                  >
                    <SportsTennisIcon fontSize="small" />
                    Chọn khung giờ phù hợp
                  </Typography>
                </Box>
              </Box>
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Chọn ngày"
                  value={dayjs(selectedDate)}
                  onChange={(newValue) => {
                    setSelectedDate(newValue.toDate());
                  }}
                  slotProps={{
                    textField: {
                      size: isMobile ? "small" : "medium",
                      sx: {
                        minWidth: { xs: 150, md: 200 },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "white"
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Box>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.95)"
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#1a202c" }}>
              Chú thích
            </Typography>
            <Box sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: { xs: 1, md: 2 },
              alignItems: "center"
            }}>
              <Chip
                label="Có thể đặt"
                sx={{
                  bgcolor: "#f0f9ff",
                  color: "#0369a1",
                  border: "2px solid #bae6fd",
                  fontWeight: 500
                }}
              />
              <Chip
                label="Đã chọn ✔"
                sx={{
                  bgcolor: "#dcfce7",
                  color: "#15803d",
                  border: "2px solid #86efac",
                  fontWeight: 500
                }}
              />
              <Chip
                label="Đã đặt ✖"
                sx={{
                  bgcolor: "#fef2f2",
                  color: "#dc2626",
                  border: "2px solid #fecaca",
                  fontWeight: 500
                }}
              />
              <Chip
                label="Đã khóa 🔒"
                sx={{
                  bgcolor: "#f8fafc",
                  color: "#64748b",
                  border: "2px solid #e2e8f0",
                  fontWeight: 500
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.95)",
            overflow: "hidden"
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {isMobile ? (
              /* Mobile Layout */
              <Box>
                {subCourts.map((court) => (
                  <Box key={court.id} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0"
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "#1a202c",
                          textAlign: "center"
                        }}
                      >
                        {court.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
                        gap: 1,
                        p: 2
                      }}
                    >
                      {times.map((time) => {
                        const slot = `${time}-${court.id}`;
                        const isSelected = selectedSlots.includes(slot);
                        const isBooked = isSlotBooked(time, court.id);
                        const isLocked = currentLockedSlots.includes(time);
                        
                        return (
                          <Button
                            key={slot}
                            variant={isSelected ? "contained" : "outlined"}
                            size="small"
                            disabled={isBooked || isLocked}
                            onClick={() => toggleSlot(time, court.id)}
                            sx={{
                              minWidth: 60,
                              height: 50,
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              borderRadius: 2,
                              border: "2px solid",
                              borderColor: isSelected 
                                ? "#10b981" 
                                : isBooked 
                                ? "#ef4444" 
                                : isLocked 
                                ? "#94a3b8" 
                                : "#e2e8f0",
                              bgcolor: isSelected 
                                ? "#10b981" 
                                : isBooked 
                                ? "#fef2f2" 
                                : isLocked 
                                ? "#f8fafc" 
                                : "white",
                              color: isSelected 
                                ? "white" 
                                : isBooked 
                                ? "#dc2626" 
                                : isLocked 
                                ? "#64748b" 
                                : "#374151",
                              "&:hover": {
                                transform: (!isBooked && !isLocked) ? "translateY(-2px)" : "none",
                                boxShadow: (!isBooked && !isLocked) ? "0 4px 12px rgba(0,0,0,0.15)" : "none"
                              },
                              "&:disabled": {
                                cursor: "not-allowed"
                              }
                            }}
                          >
                            {time}
                            <br />
                            {isSelected ? "✔" : isBooked ? "✖" : isLocked ? "🔒" : ""}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              /* Desktop Layout */
              <Box sx={{ overflow: "auto" }}>
                <Box sx={{ display: "flex", minWidth: "max-content" }}>
                  {/* Court Names Column */}
                  <Box sx={{ minWidth: 120, bgcolor: "#f8fafc", borderRight: "1px solid #e2e8f0" }}>
                    <Box sx={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #e2e8f0" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b" }}>
                        Sân
                      </Typography>
                    </Box>
                    {subCourts.map((court) => (
                      <Box
                        key={court.id}
                        sx={{
                          height: 70,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderBottom: "1px solid #e2e8f0",
                          bgcolor: "#f8fafc"
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: "#1a202c", textAlign: "center" }}
                        >
                          {court.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Time Slots Grid */}
                  <Box sx={{ flex: 1 }}>
                    {/* Time Headers */}
                    <Box sx={{ display: "flex", borderBottom: "1px solid #e2e8f0" }}>
                      {times.map((time) => (
                        <Box
                          key={time}
                          sx={{
                            minWidth: 80,
                            height: 60,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid #e2e8f0",
                            bgcolor: "#f8fafc"
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "#64748b" }}
                          >
                            {time}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Court Rows */}
                    {subCourts.map((court) => (
                      <Box
                        key={court.id}
                        sx={{
                          display: "flex",
                          borderBottom: "1px solid #e2e8f0"
                        }}
                      >
                        {times.map((time) => {
                          const slot = `${time}-${court.id}`;
                          const isSelected = selectedSlots.includes(slot);
                          const isBooked = isSlotBooked(time, court.id);
                          const isLocked = currentLockedSlots.includes(time);

                          return (
                            <Box
                              key={slot}
                              onClick={() => toggleSlot(time, court.id)}
                              sx={{
                                minWidth: 80,
                                height: 70,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRight: "1px solid #e2e8f0",
                                cursor: (isBooked || isLocked) ? "not-allowed" : "pointer",
                                bgcolor: isSelected 
                                  ? "#dcfce7" 
                                  : isBooked 
                                  ? "#fef2f2" 
                                  : isLocked 
                                  ? "#f8fafc" 
                                  : "white",
                                border: isSelected ? "2px solid #10b981" : "none",
                                "&:hover": {
                                  bgcolor: (!isBooked && !isLocked) 
                                    ? isSelected 
                                      ? "#bbf7d0" 
                                      : "#f0f9ff"
                                    : undefined
                                },
                                transition: "all 0.2s ease"
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  color: isSelected 
                                    ? "#15803d" 
                                    : isBooked 
                                    ? "#dc2626" 
                                    : isLocked 
                                    ? "#64748b" 
                                    : "#374151",
                                  fontWeight: 600
                                }}
                              >
                                {isSelected ? "✔" : isBooked ? "✖" : isLocked ? "🔒" : ""}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Summary and Booking */}
        {selectedSlots.length > 0 && (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              border: "2px solid #0ea5e9"
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0c4a6e" }}>
                Tóm tắt đặt sân
              </Typography>
              
              <Box sx={{ 
                display: "grid", 
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                mb: 3
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <AccessTimeIcon sx={{ color: "#0369a1" }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Tổng thời gian
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#0c4a6e" }}>
                      {totalHours}h
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PaymentIcon sx={{ color: "#10b981" }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      Tổng tiền
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#059669" }}>
                      {selectedSlots.reduce((total, slot) => {
                        const time = slot.split("-")[0];
                        const hour = parseInt(time.split(":")[0], 10);
                        let currentSlotPrice = courtHourlyPrice / 2;
                        if (hour >= 17) {
                          currentSlotPrice *= 1.10;
                        }
                        return total + currentSlotPrice;
                      }, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleBooking}
                sx={{
                  height: 56,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #4263eb 0%, #06b6d4 100%)",
                  boxShadow: "0 8px 20px rgba(66, 99, 235, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #3730a3 0%, #0891b2 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 25px rgba(66, 99, 235, 0.4)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                TIẾP THEO - THANH TOÁN
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedSlots.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 3,
              "& .MuiAlert-message": {
                fontSize: "1rem"
              }
            }}
          >
            Vui lòng chọn khung giờ để tiếp tục đặt sân
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ScheduleCalendar;
