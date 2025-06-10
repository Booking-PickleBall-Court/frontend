import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../styles/AdminDashboard.css";
import { courtAPI, authAPI } from "../services/api";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
} from "@mui/material";
import CourtFormDialog from "./CourtFormDialog";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("courts");
  const [courts, setCourts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const [users, setUsers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topCourtsRevenue, setTopCourtsRevenue] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const chartRef = useRef(null);
  const topCourtsChartRef = useRef(null);
  const topUsersChartRef = useRef(null);

  const chartInstanceRef = useRef(null);
  const topCourtsChartInstanceRef = useRef(null);
  const topUsersChartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchOwnerAndCourts = async () => {
      try {
        const userRes = await authAPI.getCurrentUser();
        setOwnerId(userRes.data.id);
        fetchCourts();
      } catch (error) {
        console.error("Failed to fetch owner or courts:", error);
      }
    };
    fetchOwnerAndCourts();

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

    const fetchDataForRevenue = async () => {
      if (ownerId) {
        try {
          const monthlyRevenueRes = await courtAPI.getMonthlyRevenueByCourt(ownerId);
          setMonthlyRevenue(monthlyRevenueRes.data);

          const topCourtsRes = await courtAPI.getOwnerRevenue(ownerId);
          setTopCourtsRevenue(topCourtsRes.data);

          const topCustomersRes = await courtAPI.getTopCustomersByOwner(ownerId);
          setTopCustomers(topCustomersRes.data);

        } catch (error) {
          console.error("Failed to fetch revenue data:", error);
        }
      }
    };

    if (activeTab === "revenue") {
      fetchDataForRevenue();
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d");
        const lineChartOptions = {
          type: "line",
          data: {
            labels: monthlyRevenue?.map(data => data.month) || [],
            datasets: [
              {
                label: "Doanh thu (VND)",
                data: monthlyRevenue?.map(data => data.revenue) || [],
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
                    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
                      context.parsed.y.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
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
            labels: topCourtsRevenue?.map(data => data.courtName) || [],
            datasets: [
              {
                label: "Tổng doanh thu (VND)",
                data: topCourtsRevenue?.map(data => data.totalRevenue) || [],
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
                    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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
                      context.parsed.x.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
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
            labels: topCustomers?.map(data => data.customerName) || [],
            datasets: [
              {
                label: "Số lượt đặt",
                data: topCustomers?.map(data => data.totalBookings) || [],
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
  }, [activeTab, ownerId, monthlyRevenue, topCourtsRevenue, topCustomers]);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAllCourts();
      setCourts(response.data);
    } catch (error) {
      console.error("Failed to fetch courts:", error);
      toast.error("Failed to fetch courts");
    }
  };

  const handleOpenDialog = (court = null) => {
    setSelectedCourt(court);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCourt(null);
    setOpenDialog(false);
  };

  const handleDeleteCourt = async (id) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      try {
        await courtAPI.deleteCourt(id);
        toast.success("Court deleted successfully");
        fetchCourts();
      } catch (error) {
        console.error("Failed to delete court:", error);
        toast.error("Failed to delete court");
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "courts":
        return (
          <div className="content-wrapper">
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Quản lý sân Pickleball
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog()}
                  sx={{
                    backgroundColor: "#4263eb",
                    "&:hover": { backgroundColor: "#2541b2" },
                  }}
                >
                  <i className="fas fa-plus"></i> Thêm sân
                </Button>
              </Box>

              <Grid container spacing={3}>
                {courts.map((court) => (
                  <Grid item xs={12} sm={6} md={4} key={court.id}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: "450px",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        width: "366px",
                        margin: "auto",
                      }}
                    >
                      <img
                        src={court.imageUrls?.[0] || "https://via.placeholder.com/300x200"}
                        alt={court.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <Typography variant="h6" sx={{ mt: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {court.name}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{court.address}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {court.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND'}/slot
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        <strong>Giờ hoạt động:</strong> 5:00 - 23:00
                      </Typography>
                      {court.subCourts && court.subCourts.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          <strong>Sân con:</strong> {court.subCourts.map((subCourt) => subCourt.name).join(", ")}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button
                          variant="outlined"
                          sx={{
                            borderRadius: "50px",
                            width: "48%",
                            background: "#fff",
                            color: "#4263eb",
                            border: "2px solid #4263eb",
                            "&:hover": { background: "#4263eb", color: "#fff" },
                          }}
                          onClick={() => handleOpenDialog(court)}
                        >
                          <i className="fas fa-edit"></i> Sửa
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: "50px",
                            width: "48%",
                            backgroundColor: "#dc3545",
                            "&:hover": { backgroundColor: "#c82333" },
                          }}
                          onClick={() => handleDeleteCourt(court.id)}
                        >
                          <i className="fas fa-trash"></i> Xóa
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
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
              <button className="add-button" onClick={() => setActiveTab('users')}>
                <i className="fas fa-user-plus"></i> Thêm người dùng
              </button>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr className="table-header">
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.roles && user.roles.length > 0 ? user.roles[0].name : "N/A"}</td>
                      <td>
                        <button className="action-button edit-button">
                          <i className="fas fa-edit"></i> Sửa
                        </button>
                        <button className="action-button delete-button">
                          <i className="fas fa-trash"></i> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
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
            className={`sidebar-item ${activeTab === "revenue" ? "active" : ""}`}
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
      <CourtFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        court={selectedCourt}
        onSuccess={fetchCourts}
      />
    </div>
  );
}

export default AdminDashboard;
