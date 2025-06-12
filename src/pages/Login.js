import React, { useState, useContext } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
      const response = await authAPI.login(formData);
      const { token, id, email, fullName, role, avatarUrl, phoneNumber } =
        response.data;

      localStorage.setItem("token", token);
      login({ id, email, fullName, role, avatarUrl, phoneNumber });

      const meResponse = await authAPI.getCurrentUser();

      login(meResponse.data);

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập");
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
        backgroundImage: `url('/bg-home.avif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, mb: 4, position: "relative" }}>
          {/* Nút X để quay về trang chủ */}
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
              Đăng nhập
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
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2" color="#1A3C34">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/register")}
                    sx={{ color: "#2E7D32", textDecoration: "underline" }}
                  >
                    Đăng ký
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

export default Login;
