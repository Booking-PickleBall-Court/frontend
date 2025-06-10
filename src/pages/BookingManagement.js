import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const localizer = momentLocalizer(moment);

const BookingManagement = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedCourt, setSelectedCourt] = useState("");
  const [courts, setCourts] = useState([]); // Danh sách sân
  const [newBooking, setNewBooking] = useState({
    title: "",
    start: null,
    end: null,
    court: "",
    customerName: "",
    customerPhone: "",
    note: "",
    type: "offline", // 'offline' hoặc 'online'
  });

  // Fetch danh sách sân và đặt sân khi component mount
  useEffect(() => {
    // TODO: Gọi API để lấy danh sách sân và đặt sân
    fetchCourts();
    fetchBookings();
  }, []);

  const fetchCourts = async () => {
    try {
      // TODO: Gọi API để lấy danh sách sân
      const mockCourts = [
        { id: 1, name: "Sân 1" },
        { id: 2, name: "Sân 2" },
        { id: 3, name: "Sân 3" },
      ];
      setCourts(mockCourts);
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      // TODO: Gọi API để lấy danh sách đặt sân
      const mockBookings = [
        {
          id: 1,
          title: "Đặt sân offline - Nguyễn Văn A",
          start: moment().add(1, "day").toDate(),
          end: moment().add(1, "day").add(2, "hours").toDate(),
          court: "Sân 1",
          customerName: "Nguyễn Văn A",
          customerPhone: "0123456789",
          note: "Đặt sân offline",
          type: "offline",
        },
      ];
      setEvents(mockBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewBooking({
      ...newBooking,
      start,
      end,
    });
    setOpenDialog(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewBooking(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setNewBooking({
      title: "",
      start: null,
      end: null,
      court: "",
      customerName: "",
      customerPhone: "",
      note: "",
      type: "offline",
    });
  };

  const handleSaveBooking = async () => {
    try {
      if (selectedEvent) {
        // TODO: Gọi API để cập nhật đặt sân
        console.log("Update booking:", newBooking);
      } else {
        // TODO: Gọi API để tạo đặt sân mới
        console.log("Create new booking:", newBooking);
      }
      handleCloseDialog();
      fetchBookings(); // Refresh danh sách đặt sân
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedEvent) return;
    try {
      // TODO: Gọi API để xóa đặt sân
      console.log("Delete booking:", selectedEvent.id);
      handleCloseDialog();
      fetchBookings(); // Refresh danh sách đặt sân
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý lịch đặt sân
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth variant="outlined" />
                )}
                minDate={moment()}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Sân"
              fullWidth
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              variant="outlined"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">Tất cả sân</MenuItem>
              {courts.map((court) => (
                <MenuItem key={court.id} value={court.id}>
                  {court.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              fullWidth
              sx={{
                height: 56,
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
              }}
            >
              Thêm đặt sân mới
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        sx={{
          height: "calc(100vh - 250px)",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          views={["month", "week", "day"]}
          defaultView="week"
          step={60}
          timeslots={1}
          eventPropGetter={(event) => {
            const backgroundColor =
              event.type === "offline" ? "#ff9800" : "#1976d2"; // Cam cho offline, Xanh cho online
            const color = "white";
            const borderRadius = "8px";
            const border = "none";
            return { style: { backgroundColor, color, borderRadius, border } };
          }}
        />
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "16px 24px",
          }}
        >
          {selectedEvent ? "Chỉnh sửa đặt sân" : "Thêm đặt sân mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tên khách hàng"
                  fullWidth
                  value={newBooking.customerName}
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      customerName: e.target.value,
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={newBooking.customerPhone}
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      customerPhone: e.target.value,
                    })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Sân"
                  fullWidth
                  sx={{ minWidth: 100 }}
                  value={newBooking.court}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, court: e.target.value })
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                >
                  {courts.map((court) => (
                    <MenuItem key={court.id} value={court.id}>
                      {court.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={newBooking.start ? moment(newBooking.start) : null}
                    onChange={(newValue) =>
                      setNewBooking({ ...newBooking, start: newValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="outlined" />
                    )}
                    minDate={moment()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Giờ bắt đầu"
                  type="time"
                  fullWidth
                  value={
                    newBooking.start
                      ? moment(newBooking.start).format("HH:mm")
                      : ""
                  }
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newStart = moment(newBooking.start || moment())
                      .hours(hours)
                      .minutes(minutes);
                    setNewBooking({ ...newBooking, start: newStart.toDate() });
                  }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Ngày kết thúc"
                    value={newBooking.end ? moment(newBooking.end) : null}
                    onChange={(newValue) =>
                      setNewBooking({ ...newBooking, end: newValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth variant="outlined" />
                    )}
                    minDate={moment()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Giờ kết thúc"
                  type="time"
                  fullWidth
                  value={
                    newBooking.end ? moment(newBooking.end).format("HH:mm") : ""
                  }
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newEnd = moment(newBooking.end || moment())
                      .hours(hours)
                      .minutes(minutes);
                    setNewBooking({ ...newBooking, end: newEnd.toDate() });
                  }}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Ghi chú"
                  fullWidth
                  multiline
                  rows={3}
                  value={newBooking.note}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, note: e.target.value })
                  }
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px 24px",
            borderTop: "1px solid #eee",
          }}
        >
          {selectedEvent && (
            <Button
              onClick={handleDeleteBooking}
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
            >
              Xóa
            </Button>
          )}
          <Button onClick={handleCloseDialog} sx={{ color: "#757575" }}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveBooking}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#115293" },
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingManagement;
