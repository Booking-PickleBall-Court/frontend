import React, { useState, useEffect } from "react";
import "../styles/OwnerBookingHistory.css";

function OwnerBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/owner/bookings");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBookings(data);
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
              <th>Thời gian</th>
              <th>Khách hàng</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.courtName}</td>
                <td>{booking.timeSlot}</td>
                <td>{booking.customerName}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OwnerBookingHistory;
