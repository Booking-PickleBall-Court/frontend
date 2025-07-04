import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import HistoryIcon from "@mui/icons-material/History";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLangClick = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const commonButtonStyle = {
    fontFamily: "Inter, Arial, sans-serif",
    fontSize: 18,
    fontWeight: 500,
    textTransform: "none",
  };

  const navLinkStyle = ({ isActive }) => ({
    ...commonButtonStyle,
    color: isActive ? "#2563eb" : "#222",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  });

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img onClick={() => navigate("/")}
            src="/logo.jpg"
            alt="PickleNet Logo"
            style={{ height: 46, marginRight: 8, verticalAlign: "middle" }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          {user &&
            user.role === "CLIENT" &&
            location.pathname !== "/profile" && (
              <>
                <NavLink to="/" style={navLinkStyle}>
                  Home
                </NavLink>
                <NavLink to="/bookings" style={navLinkStyle}>
                  Booking history
                </NavLink>
              </>
            )}
          {user &&
            user.role === "OWNER" &&
            location.pathname !== "/profile" && (
              <>
                <NavLink to="/owner/dashboard" style={navLinkStyle}>
                  <DashboardIcon sx={{ mr: 1 }} /> Dashboard
                </NavLink>
                <NavLink to="/owner/courts" style={navLinkStyle}>
                  <BusinessIcon sx={{ mr: 1 }} /> Manage Courts
                </NavLink>
                <NavLink to="/owner/booking-history" style={navLinkStyle}>
                  <HistoryIcon sx={{ mr: 1 }} /> Booking History
                </NavLink>
              </>
            )}
          {user && user.role === "ADMIN" && <></>}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!user && (
            <>
              <NavLink to="/register" style={navLinkStyle}>
                Sign Up
              </NavLink>
              <Button
                component={NavLink}
                to="/login"
                variant="contained"
                sx={{
                  ...commonButtonStyle,
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 2,
                  boxShadow: "none",
                  ml: 1,
                  "&:hover": { background: "#1746a2" },
                }}
              >
                Log In
              </Button>
            </>
          )}

          {user && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ color: "#333", fontWeight: 500 }}>
                  {user.fullName}
                </Typography>

                <IconButton onClick={handleAvatarClick}>
                  <Avatar src={user.avatarUrl}>
                    {user.fullName?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
              </Box>
              <Menu
                anchorEl={avatarAnchorEl}
                open={Boolean(avatarAnchorEl)}
                onClose={handleAvatarClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleAvatarClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
