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
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Folder,
  Edit,
  Home,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { authAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const accountSettings = [
  { label: "Cập nhật thông tin", key: "editProfile", icon: <Edit /> },
];

function Profile() {
  const { user: authUser, login, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      label: authUser?.role === "ADMIN" ? "Admin Dashboard" : "Trang chủ",
      key: authUser?.role === "ADMIN" ? "adminDashboard" : "home",
      icon: <Home />,
    },
    { label: "Lịch sử đặt sân", key: "bookings", icon: <Folder /> },
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
    setLoading(true);
    try {
      setEditMode(false);
      const response = await authAPI.updateProfile(formData);
      login(response.data);
      setUser(response.data);
      toast.success("Profile updated successfully!");
      setOpenEditModal(false);
    } catch (err) {
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
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      {!isMobile && (
        <Sidebar
          sidebarItems={currentSidebarItems}
          accountSettings={accountSettings}
          selectedKey={selectedKey}
          onSelect={handleSelect}
          onLogout={handleLogout}
          onEditProfile={handleOpenEditModal}
        />
      )}

      <Box sx={{ 
        flex: 1,
        width: { xs: "100%", md: "calc(100% - 280px)" }
      }}>
        <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3, 
            boxShadow: 4, 
            p: { xs: 1, sm: 2 }, 
            background: "#f9f9f9",
            mx: { xs: 1, sm: 2 }
          },
        }}
      >
        <DialogTitle
          sx={{ 
            fontWeight: 700, 
            fontSize: { xs: 18, sm: 20, md: 22 }, 
            textAlign: "center", 
            mb: 1,
            px: { xs: 2, sm: 3 }
          }}
        >
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Thông tin cá nhân */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ 
                  mb: 2, 
                  color: "#2563eb",
                  fontSize: { xs: "1rem", sm: "1.1rem" }
                }}
              >
                Thông tin cá nhân
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
                    width: { xs: 60, sm: 70, md: 80 },
                    height: { xs: 60, sm: 70, md: 80 },
                    mb: 1,
                    border: "2px solid #2563eb",
                  }}
                >
                  {formData.fullName?.charAt(0) || "U"}
                </Avatar>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ 
                    borderRadius: 2, 
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  Thay ảnh đại diện
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
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ 
                  mb: 2, 
                  color: "#2563eb",
                  fontSize: { xs: "1rem", sm: "1.1rem" }
                }}
              >
                Thay đổi mật khẩu
              </Typography>
              <TextField
                label="Mật khẩu hiện tại"
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
                label="Mật khẩu mới"
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
                label="Nhâp lại mật khẩu mới"
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
        <DialogActions sx={{ 
          justifyContent: "center", 
          pb: 2,
          px: { xs: 2, sm: 3 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 2 }
        }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              px: { xs: 3, sm: 4 },
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.9rem", sm: "1rem" }
            }}
          >
            Đóng
          </Button>
          <Button
            onClick={async (e) => {
              e.preventDefault();
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
              px: { xs: 3, sm: 4 },
              fontWeight: 600,
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.9rem", sm: "1rem" }
            }}
          >
            Lưu các thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              position: "relative",
              borderRadius: 3,
              bgcolor: "white",
              overflow: "visible",
              pb: { xs: 4, sm: 5, md: 6 },
              pt: { xs: 8, sm: 9, md: 10 },
              px: { xs: 1, sm: 2 },
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
                height: { xs: 120, sm: 140, md: 160 },
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
                top: { xs: 60, sm: 75, md: 90 },
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                borderRadius: "50%",
                border: "4px solid white",
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                backgroundColor: "#eee",
              }}
            >
              <Avatar
                src={user?.avatarUrl}
                alt={user?.fullName || "U"}
                sx={{ 
                  width: { xs: 80, sm: 100, md: 120 }, 
                  height: { xs: 80, sm: 100, md: 120 }
                }}
              >
                {user?.fullName?.charAt(0) || "U"}
              </Avatar>

              <Box
                component="label"
                sx={{
                  position: "absolute",
                  bottom: { xs: 6, sm: 8 },
                  right: { xs: 6, sm: 8 },
                  bgcolor: "white",
                  width: { xs: 24, sm: 28, md: 30 },
                  height: { xs: 24, sm: 28, md: 30 },
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  cursor: "pointer",
                  zIndex: 2,
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formDataToSend = new FormData();
                    formDataToSend.append("avatar", file);

                    try {
                      const response = await authAPI.updateProfile(
                        formDataToSend
                      );
                      login(response.data);
                      toast.success("Avatar updated successfully!");
                    } catch (err) {
                      toast.error(
                        err.response?.data?.message ||
                          "Failed to update avatar."
                      );
                    }
                  }}
                />
                <Edit fontSize="small" />
              </Box>
            </Box>

            <Box sx={{ position: "relative", zIndex: 1, mt: { xs: 12, sm: 14, md: 16.5 } }}>
              <Typography
                variant="h5"
                fontWeight="700"
                color="text.primary"
                mb={0.5}
                sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" } }}
              >
                {user?.fullName || "User Name"}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {user?.email || "email@example.com"}
              </Typography>

              {isMobile && (
                <Button
                  variant="outlined"
                  onClick={handleOpenEditModal}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    px: 3,
                    alignSelf: "center"
                  }}
                >
                  Chỉnh sửa thông tin
                </Button>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  color: "text.primary",
                  fontWeight: 600,
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 0 },
                  mt: { xs: 2, sm: 0 }
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
                        px: { xs: 2, sm: 3 },
                        color: "#5372F0",
                        fontWeight: "bold",
                      }}
                    >
                      <Typography 
                        variant="h4" 
                        sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" } }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: "#5372F0", 
                          fontWeight: 500,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" }
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                    {idx !== 1 && (
                      <Box
                        sx={{
                          width: { xs: "100%", sm: 1 },
                          height: { xs: 1, sm: 40 },
                          bgcolor: "#5372F0",
                          alignSelf: "center",
                          display: { xs: "block", sm: "block" },
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

          <Grid container spacing={3} sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: { xs: 1.5, sm: 2 }, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                  flexDirection={{ xs: "column", sm: "row" }}
                  gap={{ xs: 1, sm: 0 }}
                >
                  <Typography 
                    fontWeight={600}
                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    Lịch sử đặt sân
                  </Typography>
                  <Link 
                    href="/bookings" 
                    underline="hover" 
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                  >
                    Xem tất cả
                  </Link>
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mb: 1, 
                    display: "block",
                    fontSize: { xs: "0.7rem", sm: "0.75rem" }
                  }}
                >
                  Hãy đắm mình vào thế giới thể thao và bắt đầu đặt chỗ tại địa
                  điểm yêu thích của bạn.
                </Typography>
                <Link
                  href="/"
                  underline="hover"
                  fontWeight={600}
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                >
                  Đặt sân ngay
                </Link>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: { xs: 1.5, sm: 2 }, height: "100%" }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography 
                    fontWeight={600}
                    sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    My Contact
                  </Typography>
                </Box>

                {!editMode ? (
                  <>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" }
                      }}
                    >
                      <strong>Email:</strong> {user?.email || "-"}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" }
                      }}
                    >
                      <strong>Số điện thoại:</strong> {user?.phoneNumber || "-"}
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
                    <Box 
                      display="flex" 
                      justifyContent="flex-end" 
                      gap={{ xs: 1, sm: 2 }}
                      flexDirection={{ xs: "column", sm: "row" }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                        disabled={loading}
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          px: { xs: 2, sm: 3 }
                        }}
                      >
                        Đóng
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          px: { xs: 2, sm: 3 }
                        }}
                      >
                        Lưu
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
    </Box>
  );
}

export default Profile;
