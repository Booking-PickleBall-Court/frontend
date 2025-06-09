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
  const topCourtsChartRef = useRef(null);
  const topUsersChartRef = useRef(null);

  const chartInstanceRef = useRef(null);
  const topCourtsChartInstanceRef = useRef(null);
  const topUsersChartInstanceRef = useRef(null);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryBlue = rootStyles.getPropertyValue("--primary-blue").trim();
    const accentOrange = rootStyles.getPropertyValue("--accent-orange").trim();
    const darkOrange = rootStyles.getPropertyValue("--dark-orange").trim();
    const textMedium = rootStyles.getPropertyValue("--text-medium").trim();
    const textDark = rootStyles.getPropertyValue("--text-dark").trim();

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    if (topCourtsChartInstanceRef.current) {
      topCourtsChartInstanceRef.current.destroy();
      topCourtsChartInstanceRef.current = null;
    }
    if (topUsersChartInstanceRef.current) {
      topUsersChartInstanceRef.current.destroy();
      topUsersChartInstanceRef.current = null;
    }

    if (activeTab === "revenue") {
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        const lineChartOptions = {
          type: "line",
          data: {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
            datasets: [
              {
                label: "Doanh thu (VND)",
                data: [2000000, 2500000, 3000000, 2800000, 3200000],
                fill: false,
                borderColor: primaryBlue,
                backgroundColor: primaryBlue,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: "#ffffff",
                pointBorderColor: primaryBlue,
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
                  color: textMedium,
                  font: {
                    size: 14,
                  },
                },
                ticks: {
                  color: textMedium,
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Doanh thu (VND)",
                  color: textMedium,
                  font: {
                    size: 14,
                  },
                },
                ticks: {
                  color: textMedium,
                  callback: function (value) {
                    return value.toLocaleString() + " VND";
                  },
                },
                beginAtZero: true,
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: textDark,
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
        };
        console.log("Line Chart Options:", lineChartOptions);
        chartInstanceRef.current = new Chart(ctx, lineChartOptions);
      }

      if (topCourtsChartRef.current) {
        const ctx = topCourtsChartRef.current.getContext("2d");
        const topCourtsChartOptions = {
          type: "bar",
          data: {
            labels: [
              "Sân Pickleball A",
              "Sân Pickleball B",
              "Sân Pickleball C",
            ],
            datasets: [
              {
                label: "Tổng doanh thu (VND)",
                data: [15000000, 12000000, 10500000],
                backgroundColor: "#fbbc05",
                borderColor: "#f5a623",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Tổng doanh thu (VND)",
                  color: textMedium,
                },
                ticks: {
                  color: textMedium,
                  callback: function (value) {
                    return value.toLocaleString() + " VND";
                  },
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Sân",
                  color: textMedium,
                },
                ticks: {
                  color: textMedium,
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return (
                      context.dataset.label +
                      ": " +
                      context.parsed.x.toLocaleString() +
                      " VND"
                    );
                  },
                },
              },
            },
          },
        };
        console.log("Top Courts Chart Options:", topCourtsChartOptions);
        topCourtsChartInstanceRef.current = new Chart(
          ctx,
          topCourtsChartOptions
        );
      }

      if (topUsersChartRef.current) {
        const ctx = topUsersChartRef.current.getContext("2d");
        const topUsersChartOptions = {
          type: "bar",
          data: {
            labels: [
              "Trần Văn D",
              "Lê Thị E",
              "Phạm Văn F",
              "Nguyễn Thị G",
              "Hoàng Văn H",
            ],
            datasets: [
              {
                label: "Số lượt đặt",
                data: [25, 20, 18, 15, 12],
                backgroundColor: "#fbbc05",
                borderColor: "#f5a623",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Số lượt đặt",
                  color: textMedium,
                },
                ticks: {
                  color: textMedium,
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Khách hàng",
                  color: textMedium,
                },
                ticks: {
                  color: textMedium,
                },
                grid: {
                  color: "rgba(0,0,0,0.05)",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return context.dataset.label + ": " + context.parsed.x;
                  },
                },
              },
            },
          },
        };
        console.log("Top Users Chart Options:", topUsersChartOptions);
        topUsersChartInstanceRef.current = new Chart(ctx, topUsersChartOptions);
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      if (topCourtsChartInstanceRef.current) {
        topCourtsChartInstanceRef.current.destroy();
        topCourtsChartInstanceRef.current = null;
      }
      if (topUsersChartInstanceRef.current) {
        topUsersChartInstanceRef.current.destroy();
        topUsersChartInstanceRef.current = null;
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
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
            </div>
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
                  </div>
                  <div className="court-status-actions-wrapper">
                    <p>
                      <strong>Trạng thái:</strong> {court.status}
                    </p>
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
      case "users":
        return (
          <div className="content-wrapper">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 className="content-title">Quản lý người dùng</h2>
              <button className="add-button">
                <i className="fas fa-user-plus"></i> Thêm người dùng
              </button>
            </div>
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
            <h2 className="content-title">Thống kê doanh thu</h2>
            <div className="chart-section">
              <h3 className="chart-title">Doanh thu hàng tháng</h3>
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            <div className="section-spacing">
              <h3 className="chart-title">Top sân thu nhập cao nhất</h3>
              <div className="chart-container">
                <canvas ref={topCourtsChartRef}></canvas>
              </div>
            </div>

            <div className="section-spacing">
              <h3 className="chart-title">Top 5 người đặt sân nhiều nhất</h3>
              <div className="chart-container">
                <canvas ref={topUsersChartRef}></canvas>
              </div>
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
            className={`sidebar-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i>
            <span>Quản lý người dùng</span>
          </li>
          <li
            className={`sidebar-item ${
              activeTab === "revenue" ? "active" : ""
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            <i className="fas fa-chart-line"></i>
            <span>Thống kê doanh thu</span>
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
