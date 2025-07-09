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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import HistoryIcon from "@mui/icons-material/History";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AuthContext } from "../contexts/AuthContext";

function Navbar() {
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const getNavigationItems = () => {
    if (!user || location.pathname === "/profile") return [];
    
    if (user.role === "CLIENT") {
      return [
        { to: "/", text: "Trang chủ", icon: <HomeIcon /> },
        { to: "/bookings", text: "Lịch sử đặt sân", icon: <HistoryIcon /> }
      ];
    }
    
    if (user.role === "OWNER") {
      return [
        { to: "/owner/dashboard", text: "Thống kê", icon: <DashboardIcon /> },
        { to: "/owner/courts", text: "Quản lý sân", icon: <BusinessIcon /> },
        { to: "/owner/booking-history", text: "Lịch sử đặt sân", icon: <HistoryIcon /> }
      ];
    }
    
    return [];
  };

  const navigationItems = getNavigationItems();

  const renderDesktopNav = () => (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
      {navigationItems.map((item) => (
        <NavLink key={item.to} to={item.to} style={navLinkStyle}>
          {item.icon && <Box sx={{ mr: 1, display: "flex" }}>{item.icon}</Box>}
          {item.text}
        </NavLink>
      ))}
    </Box>
  );

  const renderMobileDrawer = () => (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": { 
          boxSizing: "border-box", 
          width: 300,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      }}
    >
      {user ? (
        <Box sx={{ 
          p: 3, 
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.1)"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar 
              src={user.avatarUrl}
              sx={{ 
                width: 50, 
                height: 50, 
                mr: 2,
                border: "2px solid rgba(255,255,255,0.3)"
              }}
            >
              {user.fullName?.charAt(0) || "U"}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "white", 
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }}
              >
                {user.fullName}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.9rem"
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <img
            src="/logo.jpg"
            alt="PickleNet Logo"
            style={{ height: 40, cursor: "pointer" }}
            onClick={() => {
              navigate("/");
              handleDrawerToggle();
            }}
          />
        </Box>
      )}

      <List sx={{ pt: 1 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={handleDrawerToggle}
            sx={{
              color: "white",
              textDecoration: "none",
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              "&:hover": { 
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "translateX(4px)",
                transition: "all 0.2s ease"
              },
              "&.active": {
                bgcolor: "rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" }
              }
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem"
              }}
            />
          </ListItem>
        ))}
        
        {user && (
          <>
            <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />
            
            <ListItem
              component={NavLink}
              to="/profile"
              onClick={handleDrawerToggle}
              sx={{
                color: "white",
                textDecoration: "none",
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                }
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Thông tin cá nhân"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              />
            </ListItem>

            <ListItem
              onClick={() => {
                logout();
                navigate("/login");
                handleDrawerToggle();
              }}
              sx={{
                color: "white",
                cursor: "pointer",
                mx: 1,
                borderRadius: 2,
                "&:hover": { 
                  bgcolor: "rgba(255,100,100,0.2)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                }
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Đăng xuất"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              />
            </ListItem>
          </>
        )}
        
        {!user && (
          <>
            <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.1)" }} />
            
            <ListItem
              component={NavLink}
              to="/register"
              onClick={handleDrawerToggle}
              sx={{
                color: "white",
                textDecoration: "none",
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                }
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Đăng ký"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              />
            </ListItem>
            
            <ListItem
              component={NavLink}
              to="/login"
              onClick={handleDrawerToggle}
              sx={{
                color: "white",
                textDecoration: "none",
                mx: 1,
                borderRadius: 2,
                "&:hover": { 
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateX(4px)",
                  transition: "all 0.2s ease"
                }
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Đăng nhập"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem"
                }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
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
            justifyContent: isMobile ? "flex-start" : "space-between",
            minHeight: { xs: 64, sm: 72, md: 90, lg: 105 },
            px: { xs: 1, sm: 2, md: 3 },
            gap: { xs: 1, sm: 2 }
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            flex: isMobile ? 1 : "auto",
            justifyContent: isMobile ? "center" : "flex-start"
          }}>
            <img
              onClick={() => navigate("/")}
              src="/logo.jpg"
              alt="PickleNet Logo"
              style={{ 
                height: isMobile ? 36 : 46, 
                marginRight: isMobile ? 0 : 8, 
                verticalAlign: "middle",
                cursor: "pointer"
              }}
            />
          </Box>

          {!isMobile && renderDesktopNav()}

          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: { xs: 1, sm: 2 },
            ml: isMobile ? 0 : "auto"
          }}>
            {!user && !isMobile && (
              <>
                <Button
                  component={NavLink}
                  to="/register"
                  sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
                >
                  Đăng ký
                </Button>
                <Button
                  component={NavLink}
                  to="/login"
                  variant="contained"
                  sx={{
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "none",
                    fontSize: { sm: 16, md: 18 },
                    px: 3,
                    "&:hover": { background: "#1746a2" },
                  }}
                >
                  Đăng nhập
                </Button>
              </>
            )}

            {user && !isMobile && (
              <>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1
                }}>
                  <Typography 
                    sx={{ 
                      color: "#333", 
                      fontWeight: 500,
                      fontSize: 16,
                      display: { xs: "none", sm: "block" }
                    }}
                  >
                    {user.fullName}
                  </Typography>

                  <IconButton onClick={handleAvatarClick}>
                    <Avatar 
                      src={user.avatarUrl}
                      onError={(e) => {
                        console.error("Navbar Avatar load error:", e);
                        e.target.src = '';
                      }}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: user.avatarUrl ? 'transparent' : '#2563eb'
                      }}
                    >
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
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Đăng xuất
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {renderMobileDrawer()}
    </>
  );
}

export default Navbar;
