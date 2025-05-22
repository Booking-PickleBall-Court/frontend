import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  Link,
} from "@mui/material";

import {
  Person,
  Folder,
  Group,
  Receipt,
  Edit,
  Link as LinkIcon,
  Lock,
  Language,
  HelpOutline,
  WhatsApp,
  ExpandLess,
  ExpandMore,
  Logout,
} from "@mui/icons-material";

import { authAPI } from "../services/api";

const sidebarItems = [
  { label: "My Profile", key: "profile", icon: <Person /> },
  { label: "My Bookings", key: "bookings", icon: <Folder /> },
  { label: "My Games", key: "games", icon: <Group /> },
  { label: "My Invoices", key: "invoices", icon: <Receipt /> },
];

const accountSettings = [
  { label: "Edit Profile", key: "editProfile", icon: <Edit /> },
  { label: "Link Social Accounts", key: "linkSocial", icon: <LinkIcon /> },
  { label: "Create Password", key: "createPassword", icon: <Lock /> },
  { label: "Language", key: "language", icon: <Language /> },
];

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  // Sidebar state
  const [openAccount, setOpenAccount] = useState(true);
  const [selectedKey, setSelectedKey] = useState("profile");
  const [language, setLanguage] = useState("EN");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setFormData({
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phoneNumber: response.data.phoneNumber || "",
      });
    } catch (err) {
      setError("Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // await authAPI.updateProfile(formData);
      setEditMode(false);
      await fetchUserProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccount = () => {
    setOpenAccount(!openAccount);
  };

  const handleSelect = (key) => {
    setSelectedKey(key);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f9ff" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: "white",
          borderRight: "1px solid #ddd",
          px: 2,
          py: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* ME */}
        <Typography variant="subtitle1" fontWeight={600}>
          ME
        </Typography>
        <List disablePadding>
          {sidebarItems.map((item) => (
            <ListItemButton
              key={item.key}
              selected={selectedKey === item.key}
              onClick={() => handleSelect(item.key)}
              sx={{ borderRadius: 1 }}
            >
              <ListItemIcon
                sx={{ color: selectedKey === item.key ? "#5372F0" : "inherit" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        {/* ACCOUNT SETTINGS */}
        <Box sx={{}}>
          <Box
            onClick={handleToggleAccount}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              ACCOUNT SETTINGS
            </Typography>
            {openAccount ? <ExpandLess /> : <ExpandMore />}
          </Box>

          <Collapse in={openAccount} timeout="auto" unmountOnExit>
            <List disablePadding>
              {accountSettings.map((item) =>
                item.key !== "language" ? (
                  <ListItemButton
                    key={item.key}
                    selected={selectedKey === item.key}
                    onClick={() => handleSelect(item.key)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemIcon
                      sx={{
                        color: selectedKey === item.key ? "#5372F0" : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ) : null
              )}
            </List>
          </Collapse>
        </Box>

        <Divider />

        {/* MORE ON COURTSITE */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => alert("More on Courtsite clicked")}
        >
          MORE ON COURTSITE
        </Typography>

        {/* FOR BUSINESS */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={() => alert("For Business clicked")}
        >
          FOR BUSINESS
        </Typography>

        {/* SUPPORT */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ cursor: "pointer" }}
        >
          SUPPORT
        </Typography>
        <List disablePadding>
          <ListItemButton onClick={() => alert("Help Centre clicked")}>
            <ListItemIcon>
              <HelpOutline />
            </ListItemIcon>
            <ListItemText primary="Help Centre" />
          </ListItemButton>
          <ListItemButton onClick={() => alert("WhatsApp Us clicked")}>
            <ListItemIcon>
              <WhatsApp />
            </ListItemIcon>
            <ListItemText primary="WhatsApp Us" />
          </ListItemButton>
        </List>

        {/* LOG OUT */}
        <Button
          variant="text"
          color="primary"
          startIcon={<Logout />}
          sx={{ mt: "auto", justifyContent: "flex-start" }}
          onClick={() => alert("Log out clicked")}
        >
          LOG OUT
        </Button>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Profile header */}
          <Box
            sx={{
              position: "relative",
              borderRadius: 3,
              bgcolor: "white",
              overflow: "visible",
              pb: 6,
              pt: 10,
              px: 2,
              minHeight: 300,
              textAlign: "center",
            }}
          >
            {/* Phần nền xanh gradient cong ở trên */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 160,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                background:
                  "linear-gradient(135deg, #4B6CB7 0%, #3751db 60%, #2a3eb1 100%)",
                clipPath: "ellipse(150% 110% at 50% 0%)",
                zIndex: 0,
              }}
            />

            {/* Avatar nằm nổi trên nền trắng, có viền trắng */}
            <Box
              sx={{
                position: "absolute",
                top: 90,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                borderRadius: "50%",
                border: "4px solid white",
                width: 120,
                height: 120,
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                backgroundColor: "#eee",
              }}
            >
              <Avatar
                src={user?.avatarUrl}
                alt={user?.fullName || "U"}
                sx={{ width: 120, height: 120 }}
              >
                {user?.fullName?.charAt(0) || "U"}
              </Avatar>

              {/* Icon bút chỉnh sửa nhỏ */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  bgcolor: "white",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                  zIndex: 2,
                }}
                onClick={() => setEditMode(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 3a2.828 2.828 0 0 1 4 4L7 21H3v-4L17 3z" />
                </svg>
              </Box>
            </Box>

            {/* Nội dung tên, email */}
            <Box sx={{ position: "relative", zIndex: 1, mt: 16.5 }}>
              <Typography
                variant="h5"
                fontWeight="700"
                color="text.primary"
                mb={0.5}
              >
                {user?.fullName || "User Name"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, fontWeight: 400 }}
              >
                {user?.email || "email@example.com"}
              </Typography>

              {/* Dòng Joined với gạch ngang 2 bên */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  color: "text.secondary",
                  fontStyle: "italic",
                  mb: 3,
                  fontSize: "0.9rem",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    borderBottom: "2px solid #5372F0",
                    maxWidth: 120,
                  }}
                />
                <Box>Joined since May, 2025</Box>
                <Box
                  sx={{
                    flex: 1,
                    borderBottom: "2px solid #5372F0",
                    maxWidth: 120,
                  }}
                />
              </Box>

              {/* Stats: 3 cột ngang, có đường dọc phân cách */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                {[
                  { label: "bookings made", value: 0 },
                  { label: "booking hours", value: 0 },
                  { label: "games joined", value: 0 },
                ].map((item, idx) => (
                  <React.Fragment key={item.label}>
                    <Box
                      sx={{
                        textAlign: "center",
                        px: 3,
                        color: "#5372F0",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography variant="h4">{item.value}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#5372F0", fontWeight: 500 }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    {idx !== 2 && (
                      <Box
                        sx={{
                          width: 1,
                          bgcolor: "#5372F0",
                          height: 40,
                          alignSelf: "center",
                          opacity: 0.5,
                          mx: 0.5,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Boxes like My Bookings, My Invoices, My Games, My Contact */}
          <Grid container spacing={3} sx={{ mt: 6 }}>
            {/* My Bookings */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>My Bookings</Typography>
                  <Link href="#" underline="hover" fontSize="0.9rem">
                    See all
                  </Link>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  No booking made
                </Typography>
                <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                  Dive into the world of sports and start booking your favorite
                  venues.
                </Typography>
                <Link
                  href="#"
                  underline="hover"
                  fontWeight={600}
                  fontSize="0.9rem"
                >
                  Book Now
                </Link>
              </Paper>
            </Grid>

            {/* My Invoices */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>My Invoices</Typography>
                  <Link href="#" underline="hover" fontSize="0.9rem">
                    See all
                  </Link>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  RM 0
                </Typography>
                <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                  spent on sports this year
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  Claim up to RM1,000 in tax relief while staying active and
                  healthy!
                </Typography>
                <Link
                  href="#"
                  underline="hover"
                  fontWeight={600}
                  fontSize="0.9rem"
                >
                  See last year's amount
                </Link>
              </Paper>
            </Grid>

            {/* My Games */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>My Games</Typography>
                  <Link href="#" underline="hover" fontSize="0.9rem">
                    See all
                  </Link>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  No games have been joined
                </Typography>
                <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                  Join our social game and meet new friends. Let's get the fun
                  rolling!
                </Typography>
                <Link
                  href="#"
                  underline="hover"
                  fontWeight={600}
                  fontSize="0.9rem"
                >
                  How to join a game?
                </Link>
              </Paper>
            </Grid>

            {/* My Contact */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>My Contact</Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                </Box>

                {!editMode ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {user?.email || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {user?.phoneNumber || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Location:</strong> 11000
                    </Typography>
                  </>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                      >
                        Save
                      </Button>
                    </Box>
                  </form>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Profile;
