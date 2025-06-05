import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import { courtAPI, paymentAPI } from "../services/api";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CourtDetail = () => {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleConfirmBooking = async () => {
    if (selectedDate && selectedTime && selectedDuration) {
      const startTime = selectedTime;
      const startDateTime = dayjs(`${selectedDate}T${startTime}`);
      const endDateTime = startDateTime.add(selectedDuration, "minute");
      const endTime = endDateTime.format("HH:mm");

      console.log("Booking infotmation:", {
        courtId: id,
        startTime: `${selectedDate}T${startTime}:00`,
        endTime: `${selectedDate}T${endTime}:00`,
        notes: `Booking for ${selectedDuration} minutes`,
      });

      setPaying(true);
      setPayError("");
      try {
        const res = await paymentAPI.createCheckoutSession({
          courtId: parseInt(id),
          startTime: `${selectedDate}T${startTime}:00`,
          endTime: `${selectedDate}T${endTime}:00`,
          notes: `Booking for ${selectedDuration} minutes`,
          paymentMethod: "CARD",
        });

        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          setPayError("Phản hồi không hợp lệ từ máy chủ.");
        }
      } catch (err) {
        setPayError("Không thể khởi tạo thanh toán.");
      } finally {
        setPaying(false);
      }
    }
  };

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const res = await courtAPI.getCourtById(id);
        setCourt(res.data);
      } catch (err) {
        setError("Không thể tải thông tin sân.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải thông tin sân...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!court) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6">Không tìm thấy sân.</Typography>
      </Container>
    );
  }

  const availableTimes = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"];
  const availableDurations = [60, 90, 120];

  const {
    name,
    address,
    description,
    hourlyPrice,
    imageUrls = [],
    amenities = [],
    categories = [],
  } = court;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Box sx={{ flex: 1, paddingRight: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "600", marginBottom: 2 }}>
            {name}
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <strong>Address:</strong> {address}
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <strong>Price:</strong> {hourlyPrice} VND / giờ
          </Typography>
          <Typography sx={{ marginBottom: 1 }}>
            <strong>Description:</strong> {description}
          </Typography>
        </Box>
        <Box sx={{ flex: 0.4 }}>
          <Button
            variant="contained"
            startIcon={<ExploreIcon />}
            sx={{
              backgroundColor: "#4263eb",
              color: "white",
              borderRadius: "50px",
              width: "250px",
              height: "50px",
              "&:hover": { backgroundColor: "#2541b2" },
            }}
            onClick={handleOpenDialog}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {imageUrls.map((image, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper elevation={3} sx={{ p: 1 }}>
              <img
                src={image}
                alt={`court-image-${idx}`}
                style={{
                  height: "330px",
                  objectFit: "cover",
                  width: "100%",
                  borderRadius: "8px",
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#1A3C34",
            fontSize: 22,
            textAlign: "center",
            py: 2,
          }}
        >
          Thông tin đặt sân
        </DialogTitle>

        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(value) => {
                if (value) setSelectedDate(value.format("YYYY-MM-DD"));
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { my: 2 },
                },
              }}
            />

            <TextField
              select
              label="Chọn giờ bắt đầu"
              fullWidth
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              sx={{ my: 2 }}
            >
              {availableTimes.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </LocalizationProvider>

          <TextField
            select
            label="Thời lượng (phút)"
            fullWidth
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
            sx={{ my: 2 }}
          >
            {availableDurations.map((duration) => (
              <MenuItem key={duration} value={duration}>
                {duration} phút
              </MenuItem>
            ))}
          </TextField>

          {payError && <Alert severity="error">{payError}</Alert>}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={!selectedDate || !selectedTime || paying}
          >
            {paying ? "Đang xử lý..." : "Thanh toán"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourtDetail;
