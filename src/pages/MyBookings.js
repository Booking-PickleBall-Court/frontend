import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { bookingAPI } from "../services/api";
import dayjs from "dayjs";

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getUserBookings(); 
        setBookings(res.data);
      } catch (err) {
        setError("Không thể tải danh sách đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải danh sách đặt sân...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} href="/">
          Về trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "700", mb: 3 }}>
        Lịch sử đặt sân của bạn
      </Typography>

      {bookings.length === 0 ? (
        <Typography>Hiện tại bạn chưa có đặt sân nào.</Typography>
      ) : (
        bookings.map((booking) => {
          const start = dayjs(booking.startTime);
          const end = dayjs(booking.endTime);

          return (
            <Paper key={booking.id} sx={{ p: 3, mb: 3 }} elevation={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {booking.court.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Địa chỉ: {booking.court.address}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography>Ngày: {start.format("YYYY-MM-DD")}</Typography>
              <Typography>
                Giờ: {start.format("HH:mm")} - {end.format("HH:mm")}
              </Typography>
              <Typography>Ghi chú: {booking.notes || "Không có"}</Typography>
            </Paper>
          );
        })
      )}
    </Container>
  );
}

export default MyBooking;
