import React, { useState } from "react";
import "../styles/ScheduleCalendar.css";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

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

const courts = [
  "Court 1",
  "Court 2",
  "Court 3",
  "Court 4",
  "Court 5",
  "Court 6",
  "Court 7",
  "Court 8",
];

const bookedSlots = [
  "15:00-Court 1",
  "13:30-Court 1",
  "15:30-Court 2",
  "19:30-Court 5",
  "13:30-Court 6",
  "16:30-Court 7",
  "20:30-Court 8",
  "08:30-Court 3",
  "09:00-Court 4",
  "10:30-Court 6",
  "8:30-Court 2",
  "15:30-Court 5",
  "10:30-Court 8",
];

const lockedSlots = ["05:00", "05:30", "06:00", "06:30", "07:00"];

const ScheduleCalendar = () => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const navigate = useNavigate();

  const toggleSlot = (time, court) => {
    if (bookedSlots.includes(`${time}-${court}`) || lockedSlots.includes(time))
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

  const totalPrice = selectedSlots.reduce((total, slot) => {
    const time = slot.split("-")[0];
    const hour = parseInt(time.split(":")[0], 10);
    const pricePerSlot = hour >= 17 ? 60000 : 45000;
    return total + pricePerSlot;
  }, 0);

  const [selectedDate, setSelectedDate] = useState(new Date());

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
            justifyContent: "center",
            gap: "200px",
            marginBottom: "40px",
          }}
        >
          <h4
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              margin: 0,
              whiteSpace: "nowrap",
              justifyContent: "center",
              marginLeft: "500px",
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
            {courts.map((court) => (
              <div
                key={court}
                className="court-label"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  padding: "5px",
                  textAlign: "center",
                  minWidth: "100px",
                }}
              >
                {court}
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
            {courts.map((court) => (
              <div
                key={court}
                className="court-row"
                style={{ display: "flex" }}
              >
                {times.map((time) => {
                  const slot = `${time}-${court}`;
                  const isSelected = selectedSlots.includes(slot);
                  const isBooked = bookedSlots.includes(slot);
                  const isLocked = lockedSlots.includes(time);
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
                      }}
                      onClick={() => toggleSlot(time, court)}
                    >
                      {isSelected ? "✔" : isBooked ? "✖" : isLocked ? "" : ""}
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
            Tổng tiền: {totalPrice.toLocaleString()} đ
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
          onClick={() => navigate("/booking")}
        >
          TIẾP THEO
        </button>
      </div>
    </Box>
  );
};

export default ScheduleCalendar;
