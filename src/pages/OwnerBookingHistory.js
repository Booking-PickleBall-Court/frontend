import React, { useState, useEffect } from "react";
import "../styles/OwnerBookingHistory.css";
import { authAPI, bookingAPI } from "../services/api";
import dayjs from "dayjs";

function OwnerBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Lấy ownerId từ người dùng hiện tại
        const userRes = await authAPI.getCurrentUser();
        const ownerId = userRes.data.id;

        // Gọi API để lấy lịch sử booking của owner
        const res = await bookingAPI.getOwnerBookings(ownerId);
        setBookings(res.data);
      } catch (error) {
        setError("Failed to fetch booking history.");
        console.error("Fetching owner booking history failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="container">Loading booking history...</div>;
  }

  if (error) {
    return <div className="container error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h2>Lịch sử khách đặt sân</h2>
      {bookings.length === 0 ? (
        <p>Chưa có khách hàng nào đặt sân của bạn.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sân</th>
              <th>Sân nhỏ</th>
              <th>Thời gian đặt</th>
              <th>Trạng thái</th>
              <th>Giá tiền</th>
              <th>Phương thức TT</th>
              <th>Trạng thái TT</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const start = dayjs(booking.startTime);
              const end = dayjs(booking.endTime);
              return (
                <tr key={booking.id}>
                  <td>{booking.courtName}</td>
                  <td>
                    {booking.subCourts && booking.subCourts.length > 0
                      ? booking.subCourts.map(sc => sc.name).join(", ")
                      : "—"}
                  </td>
                  <td>{`${start.format("YYYY-MM-DD HH:mm")} - ${end.format("HH:mm")}`}</td>
                  <td>{booking.status}</td>
                  <td>{booking.totalPrice?.toLocaleString() || 'N/A'} đ</td>
                  <td>{booking.paymentMethod || 'N/A'}</td>
                  <td>{booking.paymentStatus || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OwnerBookingHistory;
