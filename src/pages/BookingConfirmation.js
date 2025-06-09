import { useEffect, useState, useMemo } from "react";
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
import { bookingAPI } from "../services/api";
import dayjs from "dayjs";

function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");
  const bookingIdsParam = searchParams.get("bookingIds");

  // Sử dụng useMemo để đảm bảo bookingIds chỉ thay đổi khi bookingIdsParam thay đổi
  const bookingIds = useMemo(() => {
    return bookingIdsParam ? bookingIdsParam.split(',').map(Number) : [];
  }, [bookingIdsParam]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (status !== "success" || bookingIds.length === 0) {
        setError("Thanh toán không thành công hoặc không tìm thấy mã đặt sân.");
        setLoading(false);
        return;
      }
      try {
        const fetchedBookings = await Promise.all(
          bookingIds.map(id => bookingAPI.getBooking(id).then(res => res.data))
        );
        setBookings(fetchedBookings);
        console.log("Fetched bookings data:", fetchedBookings);
      } catch (err) {
        setError("Không thể tải thông tin đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingIds, status]);

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

  if (bookings.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
        <Alert severity="info">Không tìm thấy thông tin đặt sân nào.</Alert>
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

        {bookings.map((booking, index) => {
          console.log("Current booking object in render:", booking);
          const { startTime, endTime, notes, totalPrice, paymentStatus, paymentMethod } = booking;
          const courtName = booking.court ? booking.court.name : "N/A";
          const subCourts = booking.court ? booking.court.subCourts : [];

          const formattedDate = dayjs(startTime).format("YYYY-MM-DD");
          const formattedStart = dayjs(startTime).format("HH:mm");
          const formattedEnd = dayjs(endTime).format("HH:mm");

          return (
            <Box key={booking.id} sx={{ textAlign: "left", mb: 4, mt: index > 0 ? 4 : 0 }}>
              {bookings.length > 1 && (
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  Booking #{index + 1}
                </Typography>
              )}
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Thông tin sân:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Tên sân: {courtName}
              </Typography>
              {subCourts && subCourts.length > 0 && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Sân nhỏ: {subCourts.map(sc => sc.name).join(", ")}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mb: 1 }}>
                Tổng giá: {totalPrice ? totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : "N/A"}
              </Typography>
            
              <Divider sx={{ my: 3 }} />

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
              <Typography variant="body2" sx={{ mb: 1 }}>
                Trạng thái thanh toán: {paymentStatus || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Phương thức thanh toán: {paymentMethod || "N/A"}
              </Typography>
            </Box>
          );
        })}

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
