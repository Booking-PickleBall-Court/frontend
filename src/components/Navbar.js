import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLangClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLangClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        background: "#fff",
        color: "#222",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          minHeight: { xs: 72, sm: 90, md: 150, lg: 105 },
        }}
      >
        {/* Logo + Tên app */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.jpg"
            alt="PickleNet Logo"
            style={{ height: 46, marginRight: 8, verticalAlign: "middle" }}
          />
        </Box>

        {/* Menu giữa */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#222",
              textTransform: "none",
            }}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/explore"
            sx={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#222",
              textTransform: "none",
            }}
          >
            Explore
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/games"
            sx={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#222",
              textTransform: "none",
            }}
          >
            Games
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/deals"
            sx={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#222",
              textTransform: "none",
            }}
          >
            Deals
          </Button>
        </Box>

        {/* Bên phải */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Ngôn ngữ */}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleLangClose}
          >
            <MenuItem onClick={handleLangClose}>EN</MenuItem>
            <MenuItem onClick={handleLangClose}>VI</MenuItem>
          </Menu>
          <Button
            color="inherit"
            sx={{
              fontFamily: "Inter, Arial, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "#222",
              textTransform: "none",
            }}
          >
            Help
          </Button>
          {!user.id && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#222",
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                sx={{
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 2,
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  textTransform: "none",
                  boxShadow: "none",
                  ml: 1,
                  "&:hover": { background: "#1746a2" },
                }}
              >
                Log In
              </Button>
            </>
          )}
          {user.id && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/bookings"
                sx={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#222",
                  textTransform: "none",
                }}
              >
                My Bookings
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#222",
                  textTransform: "none",
                }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                sx={{
                  fontFamily: "Inter, Arial, sans-serif",
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#222",
                  textTransform: "none",
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
