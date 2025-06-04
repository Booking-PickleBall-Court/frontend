import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingAPI, courtAPI } from "../services/api";
import dayjs from "dayjs";

function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId) {
        setError("Không tìm thấy mã đặt sân.");
        setLoading(false);
        return;
      }
      try {
        const bookingRes = await bookingAPI.getBooking(bookingId);
        setBooking(bookingRes.data);

        console.log("Booking data:", bookingRes.data);

        const courtRes = await courtAPI.getCourtById(bookingRes.data.court.id);
        setCourt(courtRes.data);
      } catch (err) {
        setError("Không thể tải thông tin đặt sân hoặc sân bóng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin đặt sân...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </Button>
      </Container>
    );
  }

  if (!booking || !court) return null;

  const { startTime, endTime, notes } = booking;
  const formattedDate = dayjs(startTime).format("YYYY-MM-DD");
  const formattedStart = dayjs(startTime).format("HH:mm");
  const formattedEnd = dayjs(endTime).format("HH:mm");

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: "0 1px 6px rgb(0 0 0 / 0.1)",
          textAlign: "center",
        }}
      >
        <CheckCircleOutlineIcon
          sx={{ fontSize: 60, color: "success.main", mb: 3 }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "700", mb: 1 }}>
          Đặt sân thành công!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Cảm ơn bạn đã đặt sân. Thông tin chi tiết:
        </Typography>

        <Box sx={{ textAlign: "left", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Thông tin sân:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tên sân: {court.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Địa chỉ: {court.address}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Loại sân: {court.courtType || "Không rõ"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ textAlign: "left", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Thông tin đặt sân:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ngày: {formattedDate}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Giờ: {formattedStart} - {formattedEnd}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ghi chú: {notes || "Không có"}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#4263eb",
            color: "#fff",
            textTransform: "none",
            fontWeight: "700",
            fontSize: 16,
            height: 44,
            "&:hover": {
              bgcolor: "#3651d4",
            },
          }}
          onClick={() => navigate("/bookings")}
        >
          Xem lịch sử đặt sân
        </Button>
      </Paper>
    </Container>
  );
}

export default BookingConfirmation;
