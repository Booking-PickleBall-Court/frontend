import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
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

  const bookingIds = useMemo(() => {
    return bookingIdsParam ? bookingIdsParam.split(",").map(Number) : [];
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
          bookingIds.map((id) =>
            bookingAPI.getBooking(id).then((res) => res.data)
          )
        );
        setBookings(fetchedBookings);
      } catch (err) {
        setError("Không thể tải thông tin đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingIds, status]);

  const groupedBookings = useMemo(() => {
    const map = new Map();

    bookings.forEach((booking) => {
      const courtId = booking.court?.id;
      const courtName = booking.court?.name || "N/A";

      if (!map.has(courtId)) {
        map.set(courtId, {
          courtName,
          items: [],
          totalPrice: 0,
        });
      }

      const group = map.get(courtId);
      group.items.push({
        subCourtName: booking.subCourts?.[0]?.name || "Sân",
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
      group.totalPrice += booking.totalPrice || 0;
    });

    return Array.from(map.values());
  }, [bookings]);

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

        {groupedBookings.map((group, index) => (
          <Box key={index} sx={{ textAlign: "left", mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {group.courtName}
            </Typography>

            {group.items.map((item, i) => (
              <Typography key={i} variant="body2">
                {item.subCourtName} –{" "}
                {dayjs(item.startTime).format("YYYY-MM-DD")} |{" "}
                {dayjs(item.startTime).format("HH:mm")} –{" "}
                {dayjs(item.endTime).format("HH:mm")}
              </Typography>
            ))}

            <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
              Tổng tiền:{" "}
              {group.totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Typography>
          </Box>
        ))}

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
