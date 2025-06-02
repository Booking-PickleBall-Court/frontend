import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Link,
  Paper,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useLocation, useNavigate } from "react-router-dom";

// Dữ liệu sân đầy đủ (Đã chỉnh sửa categories thành chỉ "Pickleball")
const venueData = [
  {
    name: "Kina Pickleball",
    description:
      "Sân pickleball Hòa Xuân, Đà Nẵng, với mặt sân chất lượng, không gian thoáng đãng, tiện ích đầy đủ, là nơi lý tưởng để trải nghiệm và thi đấu pickleball.",
    price: "90.000 ~ 120.000 VND",
    address: "263-265-267-269 Đường 29/3, Hoà Xuân, Cẩm Lệ, Đà Nẵng",
    images: [
      "https://baobariavungtau.com.vn/dataimages/202405/original/images1948391_Pickleball3.jpg",
      "https://pzone.vn/wp-content/uploads/2024/08/Kina-Pickleball-3.jpg",
    ],
    amenities: ["Parking", "Pro Shop", "Drinks"],
    categories: ["Pickleball"],
  },
  {
    name: "Biển Đông Pickleball Sport Club",
    price: "90.000 ~ 120.000 VND",
    description:
      "Sân Biển Đông Pickleball Sport Club nằm gần bãi biển Mỹ Khê, cung cấp một không gian chơi Pickleball tuyệt vời với khung cảnh biển trong lành.",
    address: "472/2 Võ Nguyên Giáp",
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMgXYjBpPZv0mmk7yeDjbqk60GUDaujU3o-rOFH=s1360-w1360-h1020",
      "https://lh3.googleusercontent.com/p/AF1QipOtisppeT2yV0UjrisbXnE3HYY93sFZJEIT4mUO=s1360-w1360-h1020",
    ],
    amenities: ["Parking", "Pro Shop", "Café"],
    categories: ["Pickleball"],
  },
  {
    name: "Nana Pickleball",
    price: "90.000 ~ 140.000 VND",
    description:
      "Sân Nana Pickleball là một sân chơi chất lượng, với đầy đủ các tiện ích đáp ứng hầu hết nhu cầu của người dân tại quận Ngũ Hành Sơn, TP. Đà Nẵng và các khu vực lân cận.",
    address: "1 Phan Tứ, Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng",
    images: [
      "https://cdn.shopvnb.com/uploads/images/bai_viet/san-pickleball-nana-1-1727403145.webp",
      "https://cdn.shopvnb.com/uploads/images/bai_viet/san-pickleball-nana-2-1727403145.webp",
    ],
    amenities: ["Parking", "Drinks", "Lockers"],
    categories: ["Pickleball"],
  },
  {
    name: "Picklehead My Khe Beach",
    price: "90.000 ~ 140.000 VND",
    description:
      "Sân Picklehead My Khe Beach được trang bị đầy đủ tiện nghi và hệ thống chiếu sáng hiện đại, đảm bảo những trải nghiệm chất lượng cho cả người mới bắt đầu và những vận động viên chuyên nghiệp.",
    address: "84 Chế Lan Viên, Mỹ An, Ngũ Hành Sơn, Đà Nẵng, Việt Nam",
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMa_JucyGUdZMZSAYP2L91bIRSO4ipajqtNt73k=s1360-w1360-h1020",
      "https://lh3.googleusercontent.com/p/AF1QipPZIayToFxMXw5GtCAZTgfKdkHNym5QcoqPBmpI=s1360-w1360-h1020",
    ],
    amenities: ["Parking", "Showers", "Wi-Fi"],
    categories: ["Pickleball"],
  },
  {
    name: "Thép Việt Pickleball",
    price: "100.000 ~ 140.000 VND",
    description:
      "Thép Việt Pickleball với chất lượng mặt sân đạt chuẩn quốc tế với 7 lớp sơn cùng với kích thước bao quanh sân rộng thoải mái để các vợt thủ thể hiện hết kĩ năng cũng như khả năng cứu bóng của mình.",
    address: "Sân Thể Thao Thép Việt",
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMgYzWnmxl_y1CgDIwS64pLz5hO7nRaoBi0teyX=s1360-w1360-h1020",
      "https://cdn.shopvnb.com/uploads/images/tin_tuc/san-pickleball-thep-viet-1-1720653499.webp",
    ],
    amenities: ["Parking", "Drinks", "Pro Shop"],
    categories: ["Pickleball"],
  },
  {
    name: "Lemon Pickleball",
    price: "100.000 ~ 150.000 VND",
    description:
      "Sân Lemon Pickleball được nhiều người chơi đánh giá cao bởi không gian rộng rãi, thoáng mát và là một trong những cụm sân Pickleball chất lượng tại quận Ngũ Hành Sơn, TP. Đà Nẵng.",
    address: "52 Lê Hy Cát, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    images: [
      "https://shopvnb.com/uploads/images/san-lemon-pickleball-6.jpg",
      "https://cdn.shopvnb.com/uploads/images/bai_viet/san-lemon-pickleball-1-1733367806.webp",
    ],
    amenities: ["Parking", "Wi-Fi", "Café"],
    categories: ["Pickleball"],
  },
];

const StepNumber = ({ number, active }) => (
  <Box
    sx={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: active ? "none" : "2px solid #999",
      bgcolor: active ? "#4263eb" : "transparent",
      color: active ? "#fff" : "#999",
      fontWeight: "bold",
      fontSize: "0.9rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      mr: 1.5,
      userSelect: "none",
    }}
  >
    {number}
  </Box>
);

const StepHeader = ({ number, active, label, rightLink, icon }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 1,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <StepNumber number={number} active={active} />
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "700", fontSize: 16, color: "#000" }}
      >
        {label}
      </Typography>
      {icon && (
        <Box sx={{ ml: 1, color: "#4263eb", fontSize: 20, opacity: 0.8 }}>
          {icon}
        </Box>
      )}
    </Box>
    {rightLink && (
      <Link
        href="#"
        underline="none"
        sx={{ color: "#4263eb", fontSize: 14 }}
        onClick={(e) => e.preventDefault()}
      >
        {rightLink}
      </Link>
    )}
  </Box>
);

function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedCourts, setSelectedCourts] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const venueName = searchParams.get("court");
  const navigate = useNavigate();

  const selectedVenue = venueData.find((venue) => venue.name === venueName);

  const availableTimes = [
    "09:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const availableDurations = [
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  const availableCourts = [
    { id: 1, name: "Court A", type: "Indoor" },
    { id: 2, name: "Court B", type: "Outdoor" },
    { id: 3, name: "Court C", type: "Indoor" },
  ];

  const dummyVenue = {
    category: "PICKLEBALL",
    name: "YMCA Pickleball Court",
    address: "YMCA Pickleball Court, Jalan Raja Musa Aziz, Ipoh, Perak",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Pickleball_court.png",
  };

  const handleCourtSelection = (courtId) => {
    setSelectedCourts((prev) =>
      prev.includes(courtId)
        ? prev.filter((id) => id !== courtId)
        : [...prev, courtId]
    );
  };

  const selectedCourtDetails = availableCourts.filter((court) =>
    selectedCourts.includes(court.id)
  );

  const handleCheckout = () => {
    navigate("/confirmBooking", {
      state: {
        bookingDetails: {
          selectedVenue,
          selectedDate,
          selectedTime,
          selectedDuration,
          selectedCourts,
        },
      },
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            minHeight: "100%",
          }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: "0 1px 6px rgb(0 0 0 / 0.1)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 5 }}>
              <StepHeader
                number={2}
                active={true}
                label="Pick a date"
                rightLink="View Live Availability"
                icon={<EventNoteIcon fontSize="small" />}
              />
              <DatePicker
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                minDate={new Date()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Date"
                    sx={{
                      height: 44,
                      "& .MuiInputBase-root": {
                        height: 44,
                        fontSize: 14,
                      },
                      "& .MuiInputBase-input": {
                        height: 44,
                        padding: "10px 14px",
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 5 }}>
              <StepHeader
                number={3}
                active={selectedDate !== null}
                label="Select available start time"
                icon={<AccessTimeIcon fontSize="small" />}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {availableTimes.map((time) => (
                  <Chip
                    key={time}
                    label={time}
                    onClick={() => setSelectedTime(time)}
                    sx={{
                      bgcolor: selectedTime === time ? "#4263eb" : "#f5f5f5",
                      color: selectedTime === time ? "#fff" : "#333",
                      "&:hover": {
                        bgcolor: selectedTime === time ? "#4263eb" : "#e0e0e0",
                      },
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mb: 5 }}>
              <StepHeader
                number={4}
                active={selectedTime !== null}
                label="Select available duration"
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {availableDurations.map((duration) => (
                  <Chip
                    key={duration.value}
                    label={duration.label}
                    onClick={() => setSelectedDuration(duration.value)}
                    sx={{
                      bgcolor:
                        selectedDuration === duration.value
                          ? "#4263eb"
                          : "#f5f5f5",
                      color:
                        selectedDuration === duration.value ? "#fff" : "#333",
                      "&:hover": {
                        bgcolor:
                          selectedDuration === duration.value
                            ? "#4263eb"
                            : "#e0e0e0",
                      },
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mb: 4 }}>
              <StepHeader
                number={5}
                active={selectedDuration !== null}
                label="Select court(s)"
                rightLink="View Layout"
                icon={<SportsTennisIcon fontSize="small" />}
              />
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {availableCourts.map((court) => (
                  <Chip
                    key={court.id}
                    label={`${court.name} (${court.type})`}
                    onClick={() => handleCourtSelection(court.id)}
                    sx={{
                      bgcolor: selectedCourts.includes(court.id)
                        ? "#4263eb"
                        : "#f5f5f5",
                      color: selectedCourts.includes(court.id)
                        ? "#fff"
                        : "#333",
                      "&:hover": {
                        bgcolor: selectedCourts.includes(court.id)
                          ? "#4263eb"
                          : "#e0e0e0",
                      },
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: 4,
              borderRadius: 2,
              boxShadow: "0 1px 6px rgb(0 0 0 / 0.1)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "700", mb: 4 }}
            >
              My Cart
            </Typography>

            {selectedVenue ? (
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#4263eb", fontWeight: "700", mb: 0.5 }}
                    >
                      {selectedVenue.categories.join(", ")}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "700", mb: 1 }}>
                      {selectedVenue.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedVenue.address}
                    </Typography>
                  </Box>

                  {selectedVenue.images && selectedVenue.images.length > 0 && (
                    <Box
                      component="img"
                      src={selectedVenue.images[0]}
                      alt={selectedVenue.name}
                      sx={{
                        width: 110,
                        height: 70,
                        borderRadius: 1,
                        objectFit: "cover",
                        boxShadow: "0 1px 3px rgb(0 0 0 / 0.2)",
                      }}
                    />
                  )}
                </Box>
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Venue information not available.
              </Typography>
            )}

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "700" }}>
                Booking Details
              </Typography>
              <Link
                href="#"
                underline="hover"
                onClick={(e) => e.preventDefault()}
              >
                Edit
              </Link>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">RM 0.00</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Link
                href="#"
                underline="hover"
                sx={{ fontSize: 14 }}
                onClick={(e) => e.preventDefault()}
              >
                Promo (Enter code)
              </Link>
              <Typography variant="body2">RM 0.00</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "700",
                fontSize: 16,
                mb: 4,
              }}
            >
              <Typography>Total</Typography>
              <Typography>RM 0.00</Typography>
            </Box>

            <Button
              variant="contained"
              disabled={
                !selectedDate ||
                !selectedTime ||
                !selectedDuration ||
                selectedCourts.length === 0
              }
              fullWidth
              onClick={handleCheckout}
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
                "&.Mui-disabled": {
                  bgcolor: "#e0e0e0",
                  color: "#999",
                },
              }}
            >
              Checkout Cart
            </Button>
          </Paper>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}

export default BookingPage;
