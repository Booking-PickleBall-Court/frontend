import React, { useState, useEffect, useContext, useRef } from "react";
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
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
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
  PhotoCamera,
} from "@mui/icons-material";
import { authAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const accountSettings = [
  { label: "Edit Profile", key: "editProfile", icon: <Edit /> },
];

function Profile() {
  const { user: authUser, login, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedKey, setSelectedKey] = useState("profile");
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);

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
    {
      label: authUser?.role === "ADMIN" ? "Admin Dashboard" : "Home",
      key: authUser?.role === "ADMIN" ? "adminDashboard" : "home",
      icon: <Home />,
    },
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
      setLoading(false);
    }
  }, [authUser]);

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
      const response = await authAPI.updateProfile(formData);
      login(response.data);
      setUser(response.data);
      toast.success("Profile updated successfully!");
      setOpenEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      toast.error(err.response?.data?.message || "Failed to update profile.");
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
      case "adminDashboard":
        navigate("/admin");
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
    logout();
    navigate("/login");
  };

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
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

      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: 4, p: 2, background: "#f9f9f9" },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 700, fontSize: 22, textAlign: "center", mb: 1 }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Thông tin cá nhân */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, color: "#2563eb" }}
              >
                Personal Info
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Avatar
                  src={
                    selectedAvatar
                      ? URL.createObjectURL(selectedAvatar)
                      : user?.avatarUrl
                  }
                  alt={formData.fullName || "U"}
                  sx={{
                    width: 80,
                    height: 80,
                    mb: 1,
                    border: "2px solid #2563eb",
                  }}
                >
                  {formData.fullName?.charAt(0) || "U"}
                </Avatar>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ borderRadius: 2, fontWeight: 500 }}
                >
                  Change Avatar
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setSelectedAvatar(e.target.files[0])}
                  />
                </Button>
              </Box>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
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
            {/* Đổi mật khẩu */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ mb: 2, color: "#2563eb" }}
              >
                Change Password
              </Typography>
              <TextField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={formData.currentPassword || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            sx={{ borderRadius: 2, px: 4 }}
          >
            Cancel
          </Button>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              setError("");
              setLoading(true);
              try {
                const formDataToSend = new FormData();
                formDataToSend.append("fullName", formData.fullName);
                formDataToSend.append("email", formData.email);
                formDataToSend.append("phoneNumber", formData.phoneNumber);
                if (selectedAvatar)
                  formDataToSend.append("avatar", selectedAvatar);
                if (
                  formData.currentPassword &&
                  formData.newPassword &&
                  formData.confirmPassword
                ) {
                  if (formData.newPassword !== formData.confirmPassword) {
                    toast.error("New passwords do not match!");
                    setLoading(false);
                    return;
                  }
                  formDataToSend.append(
                    "currentPassword",
                    formData.currentPassword
                  );
                  formDataToSend.append("newPassword", formData.newPassword);
                }
                const response = await authAPI.updateProfile(formDataToSend);
                login(response.data);
                setUser(response.data);
                toast.success("Profile updated successfully!");
                setOpenEditModal(false);
                setSelectedAvatar(null);
              } catch (err) {
                setError(
                  err.response?.data?.message || "Failed to update profile"
                );
                toast.error(
                  err.response?.data?.message || "Failed to update profile."
                );
              } finally {
                setLoading(false);
              }
            }}
            variant="contained"
            sx={{
              background: "#2563eb",
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
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
              <Typography variant="body2" color="text.secondary">
                {user?.email || "email@example.com"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                {[
                  { label: "Bookings", value: user?.paymentsMade },
                  { label: "Hours", value: user?.bookingHours },
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
                    {idx !== 1 && (
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
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>My Bookings</Typography>
                  <Link href="/bookings" underline="hover" fontSize="0.9rem">
                    See all
                  </Link>
                </Box>
                <Typography variant="caption" sx={{ mb: 1, display: "block" }}>
                  Dive into the world of sports and start booking your favorite
                  venues.
                </Typography>
                <Link
                  href="/"
                  underline="hover"
                  fontWeight={600}
                  fontSize="0.9rem"
                >
                  Book Now
                </Link>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography fontWeight={600}>My Contact</Typography>
                </Box>

                {!editMode ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {user?.email || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {user?.phoneNumber || "-"}
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
