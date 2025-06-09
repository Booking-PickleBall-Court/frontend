import React, { useState, useEffect } from "react";
import "../styles/ScheduleCalendar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { courtAPI, bookingAPI, paymentAPI } from "../services/api";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";

dayjs.extend(isSameOrAfter);

const times = [
  "05:00",
  "05:30",
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
];

const lockedSlots = ["05:00", "05:30", "06:00", "06:30", "07:00"];

const ScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentLockedSlots, setCurrentLockedSlots] = useState([]);
  const [subCourts, setSubCourts] = useState([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [courtHourlyPrice, setCourtHourlyPrice] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy courtId từ query param
  const searchParams = new URLSearchParams(location.search);
  const courtId = searchParams.get("courtId");

  // Fetch subCourts và hourlyPrice khi courtId thay đổi
  useEffect(() => {
    if (courtId) {
      courtAPI.getCourtById(courtId).then(res => {
        setSubCourts(res.data.subCourts || []);
        setCourtHourlyPrice(res.data.hourlyPrice || 0);
      });
    }
  }, [courtId]);

  useEffect(() => {
    if (courtId && selectedDate) {
      bookingAPI.getBookedSlots(courtId, dayjs(selectedDate).format("YYYY-MM-DD"))
        .then(res => setBookedSlots(res.data.bookedSlots || []));

      console.log(`Fetching booked slots for court ${courtId} on ${dayjs(selectedDate).format("YYYY-MM-DD")}`);
      console.log(`Booked slots:`, bookedSlots);
      
      
    } else {
      setBookedSlots([]);
    }
  }, [courtId, selectedDate]);

  // Hàm để kiểm tra và cập nhật các ô đã qua giờ hiện tại
  const updateLockedSlots = () => {
    const now = dayjs();
    const currentTime = now.format("HH:mm");
    const isToday =
      now.format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD");

    if (isToday) {
      const newLockedSlots = times.filter((time) => time <= currentTime);
      setCurrentLockedSlots([...lockedSlots, ...newLockedSlots]);
    } else {
      setCurrentLockedSlots(lockedSlots);
    }
  };

  // Cập nhật lockedSlots mỗi phút và khi ngày thay đổi
  useEffect(() => {
    updateLockedSlots();
    const interval = setInterval(updateLockedSlots, 60000); // Cập nhật mỗi phút
    return () => clearInterval(interval);
  }, [selectedDate]);

  const toggleSlot = (time, court) => {
    if (
      bookedSlots.includes(`${time}-${court}`) ||
      currentLockedSlots.includes(time)
    )
      return;
    const slot = `${time}-${court}`;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const totalMinutes = selectedSlots.length * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalHours = `${hours}:${minutes === 0 ? "00" : minutes}`;

  // Thêm hàm kiểm tra slot đã được book
  const isSlotBooked = (time, subCourtId) => {
    const date = dayjs(selectedDate).format("YYYY-MM-DD");
    const slotStart = dayjs(`${date}T${time}:00`);
    return bookedSlots.some(bs => {
      const bsStart = dayjs(bs.startTime);
      const bsEnd = dayjs(bs.endTime);
      return (
        slotStart.isSameOrAfter(bsStart) &&
        slotStart.isBefore(bsEnd) &&
        bs.subCourtIds.includes(subCourtId)
      );
    });
  };

  // Khi nhấn TIẾP THEO, gửi dữ liệu booking đúng format
  const handleBooking = () => {
    if (!courtId || selectedSlots.length === 0) {
      alert("Vui lòng chọn khung giờ!");
      return;
    }
    // Gom slot theo subCourtId
    const date = dayjs(selectedDate).format("YYYY-MM-DD");
    const slotsBySubCourt = {};
    selectedSlots.forEach(slot => {
      const [time, subCourtIdStr] = slot.split("-");
      const subCourtId = Number(subCourtIdStr);
      if (!slotsBySubCourt[subCourtId]) slotsBySubCourt[subCourtId] = [];
      slotsBySubCourt[subCourtId].push(time);
    });
    // Tạo bookings list
    const bookings = Object.entries(slotsBySubCourt).map(([subCourtId, times]) => {
      // Sắp xếp times
      const sortedTimes = times.sort();
      const startTime = `${date}T${sortedTimes[0]}:00`;
      // endTime là kết thúc slot cuối + 30 phút
      const endTime = dayjs(`${date}T${sortedTimes[sortedTimes.length-1]}:00`).add(30, "minute").format("YYYY-MM-DDTHH:mm:ss");
      return {
        subCourtId: Number(subCourtId),
        startTime,
        endTime,
      };
    });
    const bookingData = {
      courtId: Number(courtId),
      bookings,
      notes,
      paymentMethod,
    };
    paymentAPI.createCheckoutSession(bookingData)
      .then(res => {
        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          alert("Không nhận được link thanh toán!");
        }
      })
      .catch(() => alert("Đặt sân hoặc thanh toán thất bại!"));
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(/bg-home.avif)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "90vh",
      }}
    >
      <div
        className="calendar-wrapper"
        style={{
          width: "95%",
          maxWidth: "1300px",
          height: "auto",
          overflow: "hidden",
          padding: "20px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: "50px",
              padding: "8px 20px",
              borderColor: "#4263eb",
              color: "#4263eb",
              "&:hover": {
                borderColor: "#2541b2",
                backgroundColor: "rgba(66, 99, 235, 0.04)",
              },
            }}
          >
            Quay lại
          </Button>
          <h4
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Đặt lịch ngày trực quan
          </h4>
          <div className="d-flex justify-content-center mb-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Chọn ngày"
                value={dayjs(selectedDate)}
                onChange={(newValue) => {
                  setSelectedDate(newValue.toDate());
                }}
                renderInput={(params) => (
                  <TextField {...params} className="date-picker-custom" />
                )}
                inputFormat="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>
        </div>

        <div
          className="calendar-container"
          style={{ display: "flex", overflowX: "auto" }}
        >
          <div className="fixed-column">
            <div className="corner-cell"></div>
            {subCourts.map((court) => (
              <div
                key={court.id}
                className="court-label"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  padding: "5px",
                  textAlign: "center",
                  minWidth: "100px",
                }}
              >
                {court.name}
              </div>
            ))}
          </div>
          <div
            className="scrollable-section"
            style={{ overflowX: "auto", whiteSpace: "nowrap", flex: "1" }}
          >
            <div className="header-row" style={{ display: "flex" }}>
              {times.map((time) => (
                <div
                  key={time}
                  className="time-cell"
                  style={{
                    height: "40px",
                    padding: "10px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {time}
                </div>
              ))}
            </div>
            {subCourts.map((court) => (
              <div
                key={court.id}
                className="court-row"
                style={{ display: "flex" }}
              >
                {times.map((time) => {
                  const slot = `${time}-${court.id}`;
                  const isSelected = selectedSlots.includes(slot);
                  const isBooked = isSlotBooked(time, court.id);
                  const isLocked = currentLockedSlots.includes(time);
                  return (
                    <div
                      key={slot}
                      className={`slot ${isSelected ? "selected" : ""} ${
                        isBooked ? "booked" : ""
                      } ${isLocked ? "locked" : ""}`}
                      style={{
                        minWidth: "56px",
                        height: "50px",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: isLocked ? "not-allowed" : "pointer",
                      }}
                      onClick={() => toggleSlot(time, court.id)}
                    >
                      {isSelected ? "✔" : isBooked ? "✖" : isLocked ? "🔒" : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div
          className="summary"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "10px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "10px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Tổng giờ: {totalHours}h
          </p>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "10px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Tổng tiền: {selectedSlots.reduce((total, slot) => {
              const time = slot.split("-")[0];
              const hour = parseInt(time.split(":")[0], 10);

              let currentSlotPrice = courtHourlyPrice / 2; // Giá cơ bản 30 phút
              
              if (hour >= 17) {
                currentSlotPrice *= 1.10; // Tăng 10% cho giờ cao điểm
              }
              
              return total + currentSlotPrice;
            }, 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </p>
        </div>

        <button
          className="next-button"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "5px",
            background: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "block",
            margin: "0 auto",
          }}
          onClick={handleBooking}
        >
          TIẾP THEO
        </button>
      </div>
    </Box>
  );
};

export default ScheduleCalendar;
