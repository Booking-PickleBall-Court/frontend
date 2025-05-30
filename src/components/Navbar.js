import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLangClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setAnchorEl(null);
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
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.jpg"
            alt="PickleNet Logo"
            style={{ height: 46, marginRight: 8, verticalAlign: "middle" }}
          />
        </Box>

        {/* Center menu */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/explore" style={navLinkStyle}>Explore</NavLink>
          <NavLink to="/games" style={navLinkStyle}>Games</NavLink>
          <NavLink to="/deals" style={navLinkStyle}>Deals</NavLink>
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Language */}
          <IconButton onClick={handleLangClick}>
            <LanguageIcon sx={{ color: "#222" }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleLangClose}>
            <MenuItem onClick={handleLangClose}>EN</MenuItem>
            <MenuItem onClick={handleLangClose}>VI</MenuItem>
          </Menu>

          <Button sx={{ ...commonButtonStyle, color: "#222" }}>Help</Button>

          {!user && (
            <>
              <NavLink to="/register" style={navLinkStyle}>Sign Up</NavLink>
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
              {user.role === "owner" && (
                <>
                  <NavLink to="/owner/dashboard" style={navLinkStyle}>
                    <DashboardIcon sx={{ mr: 1 }} /> Dashboard
                  </NavLink>
                  <NavLink to="/owner/courts" style={navLinkStyle}>
                    <BusinessIcon sx={{ mr: 1 }} /> Manage Courts
                  </NavLink>
                </>
              )}

              <NavLink to="/bookings" style={navLinkStyle}>My Bookings</NavLink>
              <NavLink to="/profile" style={navLinkStyle}>Profile</NavLink>
              <Button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                sx={{ ...commonButtonStyle, color: "#222" }}
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
