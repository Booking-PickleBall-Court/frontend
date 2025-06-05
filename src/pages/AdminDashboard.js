import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("courts");
  const [courts, setCourts] = useState([
    {
      id: 1,
      name: "Sân Pickleball 1",
      type: "Pickleball",
      status: "Sân Trống",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editCourt, setEditCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Pickleball",
    status: "Sân Trống",
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (activeTab === "revenue" && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
          datasets: [
            {
              label: "Doanh thu (VND)",
              data: [2000000, 2500000, 3000000, 2800000, 3200000],
              fill: false,
              borderColor: "#10b981",
              backgroundColor: "#10b981",
              tension: 0.4,
              borderWidth: 2,
              pointBackgroundColor: "#ffffff",
              pointBorderColor: "#10b981",
              pointBorderWidth: 2,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: "Tháng",
                color: "#ffffff",
                font: {
                  size: 14,
                },
              },
              ticks: {
                color: "#d1d5db",
              },
            },
            y: {
              title: {
                display: true,
                text: "Doanh thu (VND)",
                color: "#ffffff",
                font: {
                  size: 14,
                },
              },
              ticks: {
                color: "#d1d5db",
                callback: function (value) {
                  return value.toLocaleString() + " VND";
                },
              },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#ffffff",
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return (
                    context.dataset.label +
                    ": " +
                    context.parsed.y.toLocaleString() +
                    " VND"
                  );
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [activeTab]);

  const handleAddCourt = () => {
    if (editCourt) {
      setCourts(
        courts.map((court) =>
          court.id === editCourt.id ? { ...court, ...formData } : court
        )
      );
    } else {
      setCourts([...courts, { id: courts.length + 1, ...formData }]);
    }
    setShowModal(false);
    setFormData({ name: "", type: "Pickleball", status: "Sân Trống" });
    setEditCourt(null);
  };

  const handleEditCourt = (court) => {
    setEditCourt(court);
    setFormData({ name: court.name, type: court.type, status: court.status });
    setShowModal(true);
  };

  const handleDeleteCourt = (id) => {
    setCourts(courts.filter((court) => court.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "courts":
        return (
          <div className="content-wrapper">
            <h2 className="content-title">Quản lý sân Pickleball</h2>
            <button
              className="add-button"
              onClick={() => {
                setEditCourt(null);
                setFormData({
                  name: "",
                  type: "Pickleball",
                  status: "Sân Trống",
                });
                setShowModal(true);
              }}
            >
              <i className="fas fa-plus"></i> Thêm sân
            </button>
            <div className="court-cards">
              {courts.map((court) => (
                <div key={court.id} className="court-card">
                  <div className="court-header">
                    <h3 className="court-name">{court.name}</h3>
                    <span
                      className={`status-indicator ${
                        court.status === "Sân Trống"
                          ? "status-available"
                          : "status-booked"
                      }`}
                    >
                      {court.status}
                    </span>
                  </div>
                  <div className="court-details">
                    <p>
                      <strong>Loại sân:</strong> {court.type}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong> {court.status}
                    </p>
                  </div>
                  <div className="court-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEditCourt(court)}
                    >
                      <i className="fas fa-edit"></i> Sửa
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDeleteCourt(court.id)}
                    >
                      <i className="fas fa-trash"></i> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3 className="modal-title">
                    {editCourt ? "Sửa sân" : "Thêm sân"}
                  </h3>
                  <div className="form-group">
                    <label>Tên sân</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Loại sân</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.type}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      className="form-input"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Sân Trống">Sân Trống</option>
                      <option value="Đã Đặt">Đã Đặt</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button
                      className="modal-button cancel-button"
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="modal-button save-button"
                      onClick={handleAddCourt}
                    >
                      {editCourt ? "Lưu" : "Thêm"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "bookings":
        return (
          <div className="content-wrapper">
            <h2 className="content-title">Quản lý lịch đặt sân</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th>Sân</th>
                    <th>Thời gian</th>
                    <th>Khách hàng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td>Sân Pickleball 1</td>
                    <td>10:00 - 11:00, 24/05/2025</td>
                    <td>Nguyễn Văn A</td>
                    <td>
                      <button className="action-button confirm-button">
                        <i className="fas fa-check"></i> Xác nhận
                      </button>
                      <button className="action-button cancel-button">
                        <i className="fas fa-times"></i> Hủy
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="content-wrapper">
            <h2 className="content-title">Quản lý người dùng</h2>
            <button className="add-button">
              <i className="fas fa-user-plus"></i> Thêm người dùng
            </button>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td>Nguyễn Văn A</td>
                    <td>nva@example.com</td>
                    <td>Khách hàng</td>
                    <td>
                      <button className="action-button edit-button">
                        <i className="fas fa-edit"></i> Sửa
                      </button>
                      <button className="action-button delete-button">
                        <i className="fas fa-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case "revenue":
        return (
          <div className="content-wrapper">
            <h2 className="content-title">Quản lý doanh thu, giao dịch</h2>
            <div className="chart-section">
              <h3 className="chart-title">Doanh thu tháng này</h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th>ID Giao dịch</th>
                    <th>Khách hàng</th>
                    <th>Số tiền</th>
                    <th>Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-row">
                    <td>TX001</td>
                    <td>Nguyễn Văn A</td>
                    <td>500,000 VND</td>
                    <td>24/05/2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1 className="sidebar-title">
          <i className="fas fa-tachometer-alt"></i> Pickleball Dashboard
          <span className="new-badge">New</span>
        </h1>
        <ul className="sidebar-menu">
          <li
            className={`sidebar-item ${activeTab === "courts" ? "active" : ""}`}
            onClick={() => setActiveTab("courts")}
          >
            <i className="fas fa-futbol"></i>
            <span>Quản lý sân</span>
          </li>
          <li
            className={`sidebar-item ${
              activeTab === "bookings" ? "active" : ""
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            <i className="fas fa-calendar-alt"></i>
            <span>Quản lý lịch đặt sân</span>
          </li>
          <li
            className={`sidebar-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <i className="fas fa-users"></i>
            <span>Quản lý người dùng</span>
            <i
              className={`fas fa-plus sidebar-icon ${
                userMenuOpen ? "rotate" : ""
              }`}
            ></i>
          </li>
          {userMenuOpen && (
            <ul className="submenu">
              <li
                className={`submenu-item ${
                  activeTab === "users" ? "active" : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                Danh sách người dùng
              </li>
              <li
                className="submenu-item"
                onClick={() => alert("Chuyển đến trang thêm người dùng")}
              >
                Thêm người dùng
              </li>
            </ul>
          )}
          <li
            className={`sidebar-item ${
              activeTab === "revenue" ? "active" : ""
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            <i className="fas fa-chart-line"></i>
            <span>Quản lý doanh thu</span>
          </li>
        </ul>
        <div className="sidebar-footer">
          <div className="camera-icon">
            <i className="fas fa-camera"></i>
          </div>
        </div>
      </div>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;
