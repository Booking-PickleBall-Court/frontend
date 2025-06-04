import { useState } from "react";
import { useLocation } from "react-router-dom";
import { paymentAPI } from "../services/api";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
} from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Payment() {
  const query = useQuery();
  const courtId = query.get("courtId");
  const date = query.get("date");
  const startTime = query.get("startTime");
  const endTime = query.get("endTime");

  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const handleCheckout = async () => {
    if (!courtId || !date || !startTime || !endTime) {
      setError("Thiếu thông tin đặt sân.");
      return;
    }

    const startDateTime = `${date}T${startTime}:00`;
    const endDateTime = `${date}T${endTime}:00`;

    setPaying(true);
    try {
      const res = await paymentAPI.createCheckoutSession({
        courtId,
        date,
        startTime: startDateTime,
        endTime: endDateTime,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setError("Phản hồi không hợp lệ từ máy chủ.");
      }
    } catch (err) {
      setError("Không thể khởi tạo thanh toán.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Thanh toán
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleCheckout}
            disabled={paying}
            fullWidth
          >
            {paying ? "Đang chuyển hướng..." : "Thanh toán với Stripe"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Payment;
