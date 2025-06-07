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
  CircularProgress,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Home,
} from "@mui/icons-material";
import { authAPI } from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "Home", key: "home", icon: <Home /> },
  { label: "My Bookings", key: "bookings", icon: <Folder /> },
];

const accountSettings = [
  { label: "Edit Profile", key: "editProfile", icon: <Edit /> },
  { label: "Change Password", key: "changePassword", icon: <Lock /> },
  { label: "Language", key: "language", icon: <Language /> },
];

function Profile() {
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
    if (key === "home") {
      navigate("/");
    } else if (key === "bookings") {
      navigate("/bookings");
    }
  };

  const handleLogout = () => {
    // Handle logout logic here
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
      await authAPI.updateProfile(formData);
      await fetchUserProfile();
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
        sidebarItems={sidebarItems}
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
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" onSubmit={handleEditProfile}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                  position: "relative",
                  width: "fit-content",
                  margin: "0 auto",
                }}
              >
                <Avatar
                  src={user?.avatarUrl}
                  alt={user?.fullName || "U"}
                  sx={{
                    width: 100,
                    height: 100,
                    border: "4px solid #fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {user?.fullName?.charAt(0) || "U"}
                </Avatar>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    minWidth: "auto",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    p: 0,
                    bgcolor: "#5372F0",
                    "&:hover": {
                      bgcolor: "#4263eb",
                    },
                  }}
                >
                  <Edit sx={{ fontSize: 20 }} />
                  <input type="file" hidden accept="image/*" />
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#5372F0",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#5372F0",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                },
              }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#5372F0",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666",
                },
              }}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid #eee",
          }}
        >
          <Button
            onClick={handleCloseEditModal}
            sx={{
              color: "#666",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditProfile}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: "#5372F0",
              color: "white",
              px: 3,
              "&:hover": {
                bgcolor: "#4263eb",
              },
              "&.Mui-disabled": {
                bgcolor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
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
