import React from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
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
            {/* <SportsTennisIcon sx={{ color: "#2563eb", fontSize: 36, mr: 1 }} /> */}
            {/* <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#2563eb" }}
            >
              PickleNet
            </Typography> */}
            <img
              src="/logo.jpg"
              alt="PickleNet Logo"
              style={{ height: 46, marginRight: 8 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Simplify your court booking and management experience.
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            For Business
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Facility Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Schedule a Demo
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            About
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            About Us
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Blog
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Careers
          </Typography>
        </Grid>

        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Support
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Help Centre
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Contact Us
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
