import React from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

function Footer() {
  return (
    <Box
      sx={{ backgroundColor: "#f9fafb", pt: 7.1, pb: 4, px: { xs: 3, md: 10 } }}
    >
      <Grid container spacing={12}>
        <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/logo.jpg"
              alt="PickleNet Logo"
              style={{ height: 46, marginRight: 8 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Đơn giản hóa trải nghiệm đặt sân và quản lý sân của bạn.
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Dành cho doanh nghiệp
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Quản lý cơ sở
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Lên lịch trình demo
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Giới thiệu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Giới thiệu về chúng tôi
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Blog
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Công việc
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Hỗ trợ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Trung tâm trợ giúp
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Liên hệ với chúng tôi
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={3}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Legal
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Terms of Use
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Privacy Policy
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 | Pickle Ball Web Solutions
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton color="primary">
            <WhatsAppIcon />
          </IconButton>
          <IconButton color="primary">
            <FacebookIcon />
          </IconButton>
          <IconButton color="primary">
            <InstagramIcon />
          </IconButton>
          <IconButton color="primary">
            <MusicNoteIcon />
          </IconButton>
          <IconButton color="primary">
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default Footer;
