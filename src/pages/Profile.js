import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Folder,
  Edit,
  Link as LinkIcon,
  Lock,
  Language,
  Home,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { authAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const accountSettings = [
  { label: "Edit Profile", key: "editProfile", icon: <Edit /> },
  { label: "Change Password", key: "changePassword", icon: <Lock /> },
  { label: "Language", key: "language", icon: <Language /> },
];

function Profile() {
  const { user: authUser, login } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [selectedKey, setSelectedKey] = useState("profile");
  const navigate = useNavigate();

  const ownerSidebarItems = [
    { label: "Dashboard", key: "ownerDashboard", icon: <DashboardIcon /> },
    { label: "Manage Courts", key: "ownerCourts", icon: <BusinessIcon /> },
    {
      label: "Booking History",
      key: "ownerBookingHistory",
      icon: <HistoryIcon />,
    },
  ];

  const clientSidebarItems = [
    { label: "Home", key: "home", icon: <Home /> },
    { label: "My Bookings", key: "bookings", icon: <Folder /> },
  ];

  const currentSidebarItems =
    authUser && authUser.role === "OWNER"
      ? ownerSidebarItems
      : clientSidebarItems;

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phoneNumber: authUser.phoneNumber || "",
      });
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      login(response.data);
      setFormData({
        fullName: response.data.fullName || "",
        email: response.data.email || "",
        phoneNumber: response.data.phoneNumber || "",
      });
    } catch (err) {
      setError("Failed to fetch user profile");
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
      setEditMode(false);
      await fetchUserProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (key) => {
    setSelectedKey(key);
    switch (key) {
      case "home":
        navigate("/");
        break;
      case "bookings":
        navigate("/bookings");
        break;
      case "ownerDashboard":
        navigate("/owner/dashboard");
        break;
      case "ownerCourts":
        navigate("/owner/courts");
        break;
      case "ownerBookingHistory":
        navigate("/owner/booking-history");
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      setUser(response.data);
      login(response.data);
      handleCloseEditModal();
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
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
    <Box sx={{ display: "flex" }}>
      <Sidebar
        sidebarItems={currentSidebarItems}
        accountSettings={accountSettings}
        selectedKey={selectedKey}
        onSelect={handleSelect}
        onLogout={handleLogout}
        onEditProfile={handleOpenEditModal}
      />

      {/* Edit Profile Modal */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: "1px solid #eee",
            pb: 2,
            "& .MuiTypography-root": {
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#1a1a1a",
            },
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditProfile}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              background: "#2563eb",
              "&:hover": { background: "#1746a2" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
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

          <Grid container spacing={3} sx={{ mt: 6 }}>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Profile;
