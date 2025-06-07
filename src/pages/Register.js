import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Link,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    role: "CLIENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: "url('/bg-home.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 4, position: "relative" }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
            aria-label="close"
          >
            <CloseIcon sx={{ color: "#1A3C34" }} />
          </IconButton>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={{ color: "#1A3C34", fontWeight: "bold" }}
            >
              Đăng ký
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ color: "#2E7D32", mb: 2 }}
            >
              PickleNET - Đặt lịch online sân thể thao
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1A3C34" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1A3C34" },
                    "&:hover fieldset": { borderColor: "#2E7D32" },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1A3C34" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1A3C34" },
                    "&:hover fieldset": { borderColor: "#2E7D32" },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                helperText="Format: +1234567890"
                sx={{
                  "& .MuiInputLabel-root": { color: "#1A3C34" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1A3C34" },
                    "&:hover fieldset": { borderColor: "#2E7D32" },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1A3C34" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1A3C34" },
                    "&:hover fieldset": { borderColor: "#2E7D32" },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1A3C34" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1A3C34" },
                    "&:hover fieldset": { borderColor: "#2E7D32" },
                  },
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                select
                label="Vai trò"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiInputLabel-root": { color: "#1A3C34" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#1A3C34" },
                    "&:hover fieldset": { borderColor: "#2E7D32" },
                  },
                }}
              >
                <MenuItem value="CLIENT">Khách hàng</MenuItem>
                <MenuItem value="OWNER">Chủ sân</MenuItem>
              </TextField>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#2E7D32",
                  "&:hover": { backgroundColor: "#1A3C34" },
                  fontWeight: "bold",
                  padding: "10px 0",
                }}
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" color="#1A3C34">
                  Bạn đã có tài khoản?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/login")}
                    sx={{ color: "#2E7D32", textDecoration: "underline" }}
                  >
                    Đăng nhập
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;
