import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import axios from "axios";

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
    categories: ["Pickleball", "Tennis"],
  },
  {
    name: "Biển Đông Pickleball Sport Club",
    description:
      "Sân Biển Đông Pickleball Sport Club nằm gần bãi biển Mỹ Khê, cung cấp một không gian chơi Pickleball tuyệt vời với khung cảnh biển trong lành.",
    price: "90.000 ~ 120.000 VND",
    address: "472/2 Võ Nguyên Giáp",
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMgXYjBpPZv0mmk7yeDjbqk60GUDaujU3o-rOFH=s1360-w1360-h1020",
      "https://lh3.googleusercontent.com/p/AF1QipOtisppeT2yV0UjrisbXnE3HYY93sFZJEIT4mUO=s1360-w1360-h1020",
    ],
    amenities: ["Parking", "Pro Shop", "Café"],
    categories: ["Pickleball", "Tennis"],
  },
  {
    name: "Nana Pickleball",
    description:
      "Sân Nana Pickleball là một sân chơi chất lượng, với đầy đủ các tiện ích đáp ứng hầu hết nhu cầu của người dân tại quận Ngũ Hành Sơn, TP. Đà Nẵng và các khu vực lân cận.",
    price: "90.000 ~ 140.000 VND",
    address: "1 Phan Tứ, Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng",
    images: [
      "https://cdn.shopvnb.com/uploads/images/bai_viet/san-pickleball-nana-1-1727403145.webp",
      "https://cdn.shopvnb.com/uploads/images/bai_viet/san-pickleball-nana-2-1727403145.webp",
    ],
    amenities: ["Parking", "Drinks", "Lockers"],
    categories: ["Pickleball", "Tennis"],
  },
  {
    name: "Picklehead My Khe Beach",
    description:
      "Sân Picklehead My Khe Beach được trang bị đầy đủ tiện nghi và hệ thống chiếu sáng hiện đại, đảm bảo những trải nghiệm chất lượng cho cả người mới bắt đầu và những vận động viên chuyên nghiệp.",
    price: "90.000 ~ 140.000 VND",
    address: "84 Chế Lan Viên, Mỹ An, Ngũ Hành Sơn, Đà Nẵng, Việt Nam",
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMa_JucyGUdZMZSAYP2L91bIRSO4ipajqtNt73k=s1360-w1360-h1020",
      "https://lh3.googleusercontent.com/p/AF1QipPZIayToFxMXw5GtCAZTgfKdkHNym5QcoqPBmpI=s1360-w1360-h1020",
    ],
    amenities: ["Parking", "Showers", "Wi-Fi"],
    categories: ["Pickleball", "Beach Sports"],
  },
  {
    name: "Thép Việt Pickleball",
    description:
      "Thép Việt Pickleball với chất lượng mặt sân đạt chuẩn quốc tế với 7 lớp sơn cùng với kích thước bao quanh sân rộng thoải mái để các vợt thủ thể hiện hết kĩ năng cũng như khả năng cứu bóng của mình.",
    price: "100.000 ~ 140.000 VND",
    address: "Sân Thể Thao Thép Việt",
    images: [
      "https://lh3.googleusercontent.com/p/AF1QipMgYzWnmxl_y1CgDIwS64pLz5hO7nRaoBi0teyX=s1360-w1360-h1020",
      "https://cdn.shopvnb.com/uploads/images/tin_tuc/san-pickleball-thep-viet-1-1720653499.webp",
    ],
    amenities: ["Parking", "Drinks", "Pro Shop"],
    categories: ["Pickleball", "Tennis"],
  },
  {
    name: "Lemon Pickleball",
    description:
      "Sân Lemon Pickleball được nhiều người chơi đánh giá cao bởi không gian rộng rãi, thoáng mát và là một trong những cụm sân Pickleball chất lượng tại quận Ngũ Hành Sơn, TP. Đà Nẵng.",
    price: "100.000 ~ 150.000 VND",
    address: "52 Lê Hy Cát, Phường Khuê Mỹ, Quận Ngũ Hành Sơn, TP. Đà Nẵng",
    images: [
      "https://shopvnb.com/uploads/images/san-lemon-pickleball-6.jpg",
      "https://cdn.shopvnb.com/uploads/images/bai_viet/san-lemon-pickleball-1-1733367806.webp",
    ],
    amenities: ["Parking", "Wi-Fi", "Café"],
    categories: ["Pickleball", "Tennis"],
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = ({ sport, where, when }) => {
    const params = new URLSearchParams();
    if (sport) params.append("sport", sport);
    if (where) params.append("where", where);
    if (when)
      params.append(
        "when",
        when instanceof Date ? when.toISOString().slice(0, 10) : when
      );
    navigate(`/explore?${params.toString()}`);
  };
  const handleViewCourtDetail = (venueName) => {
    // Encode tên sân để tránh lỗi với các ký tự đặc biệt trong URL
    const encodedName = encodeURIComponent(venueName);
    navigate(`/courts/${encodedName}`);
  };

  return (
    <>
      {/* SearchBar Section */}
      <Box sx={{ pt: 0, pb: 4 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>

      <Container maxWidth="lg">
        {/* Featured Venues Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Featured Venues
          </Typography>
          <Grid container spacing={3}>
            {venueData.map((venue, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "450px", // Fixed height for the card
                    overflow: "hidden",
                    justifyContent: "space-between", // To ensure proper distribution of content
                    width: "320px", // Set the width to 320px
                    margin: "auto", // Centers the cards
                  }}
                >
                  {/* Image */}
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    style={{
                      width: "100%",
                      height: "200px", // Fixed height for images
                      objectFit: "cover", // Ensures the image fits the box without distortion
                      borderRadius: "8px",
                    }}
                  />
                  {/* Venue Details */}
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      whiteSpace: "normal", // Allow text to break into multiple lines
                      overflow: "hidden",
                      textOverflow: "ellipsis", // Add ellipsis for overflowed text
                    }}
                  >
                    {venue.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "normal", // Allow text to break into multiple lines
                      overflow: "hidden",
                      textOverflow: "ellipsis", // Add ellipsis for overflowed text
                    }}
                  >
                    {venue.address}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", mt: 1 }}
                  >
                    {venue.price}
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
                      onClick={() => handleViewCourtDetail(venue.name)} // Navigate to CourtDetail
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
        </Box>
      </Container>
    </>
  );
};

export default Home;
