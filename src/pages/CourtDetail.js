import React from "react";
import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import { Chip } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ExploreIcon from "@mui/icons-material/Explore";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

// Dữ liệu sân đầy đủ
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

const CourtDetail = () => {
  const { id } = useParams(); // Lấy tham số sân từ URL
  const decodedId = decodeURIComponent(id); // Decode tên sân từ URL
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = React.useState(false);

  let venue = null;
  if (decodedId) {
    venue = venueData.find((v) => v.name === decodedId);
  }

  // Nếu không tìm thấy sân theo ID, hoặc không có ID, sử dụng sân đầu tiên
  if (!venue && venueData.length > 0) {
    venue = venueData[0];
  }

  if (!venue) return <Typography variant="h6">Venue not found.</Typography>;

  const { name, description, price, address, images, amenities, categories } =
    venue;

  return (
    <Container maxWidth="lg">
      {/* Top Section with Name, Address, and Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Box sx={{ flex: 1, paddingRight: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "600", marginBottom: 2 }}>
            {name}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Address:</strong> {address}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            <strong>Price:</strong> {price}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <strong>Description:</strong> {description}
          </Typography>
        </Box>

        <Box sx={{ flex: 0.4 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ExploreIcon />}
              sx={{
                backgroundColor: "#4263eb",
                color: "white",
                borderRadius: "50px",
                width: "250px",
                "&:hover": { backgroundColor: "#2541b2" },
                height: "50px",
              }}
              onClick={() => navigate(`/bookings?court=${decodedId}`)}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </Box>

      {showCalendar && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Select Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disablePast 
              onChange={(date) => {
                console.log("Selected Date:", date);
                setShowCalendar(false); 
              }}
            />
          </LocalizationProvider>
        </Box>
      )}

      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ padding: 1 }}>
              <img
                src={image}
                alt={`venue-image-${index}`}
                style={{
                  height: "330px",
                  borderRadius: "8px",
                  objectFit: "cover", 
                  display: "block",
                  margin: "0 auto", 
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Categories & Pricing
        </Typography>
        <Typography variant="body1">{categories.join(", ")}</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          {price}
        </Typography>
      </Box>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Amenities
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {amenities.map((amenity, index) => (
            <Chip label={amenity} key={index} variant="outlined" />
          ))}
        </Box>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Getting There
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body1">Directions</Typography>
          <Button variant="contained" sx={{ borderRadius: "50px" }}>
            Open in Google Maps
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CourtDetail;
