import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Link,
} from "@mui/material";
import { bookingAPI } from "../services/api";
import dayjs from "dayjs";
import "../styles/MyBookings.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotesIcon from "@mui/icons-material/Notes";
import { useNavigate } from "react-router-dom";

function MyBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getUserBookings();
        setBookings(res.data);
        console.log("Bookings fetched successfully:", res.data);
        
      } catch (err) {
        setError("Không thể tải danh sách đặt sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const originalStyle = document.body.style.cssText;
    document.body.style.cssText = `
      background-image: url(${process.env.PUBLIC_URL}/bg-home.avif);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    `;
    return () => {
      document.body.style.cssText = originalStyle;
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const paginatedBookings = bookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCourtClick = (courtId) => {
    navigate(`/courts/${courtId}`);
  };

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
    <Container maxWidth="xl" className="my-bookings-container">
      <Typography variant="h5" className="my-bookings-title">
        Lịch sử đặt sân của bạn
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Sân</strong>
              </TableCell>
              <TableCell>
                <CalendarTodayIcon
                  fontSize="small"
                  sx={{ mr: 0.5, verticalAlign: "bottom" }}
                />
                Ngày
              </TableCell>
              <TableCell>
                <AccessTimeIcon
                  fontSize="small"
                  sx={{ mr: 0.5, verticalAlign: "bottom" }}
                />
                Giờ
              </TableCell>
              <TableCell>
                <NotesIcon
                  fontSize="small"
                  sx={{ mr: 0.5, verticalAlign: "bottom" }}
                />
                Ghi chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => {
              const start = dayjs(booking.startTime);
              const end = dayjs(booking.endTime);

              return (
                <TableRow key={booking.id} className="table-row">
                  <TableCell
                    onClick={() => handleCourtClick(booking.courtId)}
                  >
                    {booking.courtName}
                  </TableCell>
                  <TableCell>{start.format("YYYY-MM-DD")}</TableCell>
                  <TableCell>
                    {start.format("HH:mm")} - {end.format("HH:mm")}
                  </TableCell>
                  <TableCell>{booking.notes || "Không có"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
}

export default MyBooking;
