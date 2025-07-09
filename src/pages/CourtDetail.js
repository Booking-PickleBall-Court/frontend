import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { courtAPI } from "../services/api";

const CourtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await courtAPI.getCourtById(id);
        setCourt(res.data);
      } catch (err) {
        setError("Không thể tải thông tin sân.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin sân...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!court) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6">Không tìm thấy sân.</Typography>
      </Container>
    );
  }

  const {
    name,
    address,
    description,
    hourlyPrice,
    imageUrls = [],
  } = court;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)",
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 } }}>
        {isMobile && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 3,
            bgcolor: "white",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>                <IconButton
                  onClick={() => navigate(-1)}
                  sx={{ mr: 2, color: "#059669" }}
                >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a202c" }}>
              Chi tiết sân
            </Typography>
          </Box>
        )}

        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              p: { xs: 3, md: 4 }
            }}
          >
            <Box sx={{ flex: 1, mb: { xs: 3, md: 0 }, pr: { md: 3 } }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: "#1a202c",
                  lineHeight: 1.2
                }}
              >
                {name}
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOnIcon sx={{ color: "#059669", fontSize: 20 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#4a5568",
                      fontSize: { xs: "0.95rem", md: "1rem" }
                    }}
                  >
                    {address}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon sx={{ color: "#059669", fontSize: 20 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "#4a5568",
                      fontSize: { xs: "0.95rem", md: "1rem" },
                      fontWeight: 600
                    }}
                  >
                    {hourlyPrice?.toLocaleString('vi-VN')} VND / giờ
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#718096",
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    lineHeight: 1.6,
                    mt: 1
                  }}
                >
                  {description}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: "flex", 
              justifyContent: { xs: "center", md: "flex-end" },
              alignItems: "center"
            }}>
              <Button
                variant="contained"
                startIcon={<ExploreIcon />}
                size={isMobile ? "large" : "large"}
                sx={{
                  background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                  color: "white",
                  borderRadius: "25px",
                  width: { xs: "100%", md: "auto" },
                  minWidth: { md: "200px" },
                  height: { xs: "56px", md: "56px" },
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(5, 150, 105, 0.3)",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #047857 0%, #059669 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 25px rgba(5, 150, 105, 0.4)"
                  },
                  transition: "all 0.3s ease"
                }}
                onClick={() => navigate(`/schedule-calendar?courtId=${id}`)}
              >
                Đặt sân ngay
              </Button>
            </Box>
          </Box>
        </Card>

        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            mb: 3, 
            color: "#1a202c",
            fontSize: { xs: "1.5rem", md: "1.875rem" }
          }}
        >
          Hình ảnh sân
        </Typography>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {imageUrls.map((image, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={image}
                  alt={`court-image-${idx}`}
                  sx={{
                    height: { xs: 200, sm: 250, md: 300 },
                    objectFit: "cover"
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CourtDetail;
