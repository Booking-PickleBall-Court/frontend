import { useState, useEffect, useRef, useContext } from "react";
import Chart from "chart.js/auto";
import "../styles/AdminDashboard.css";
import { courtAPI, authAPI, adminAPI } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  IconButton,
  TablePagination,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";

function AdminDashboard() {
  const { user: currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("courts");
  const [courts, setCourts] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [users, setUsers] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topCourtsRevenue, setTopCourtsRevenue] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [courtMenuAnchor, setCourtMenuAnchor] = useState(null);
  const [selectedCourtForStatus, setSelectedCourtForStatus] = useState(null);

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
  }, [activeTab, ownerId, monthlyRevenue, topCourtsRevenue, topCustomers, selectedRole]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, selectedRole]);

  const fetchCourts = async () => {
    try {
      const response = await courtAPI.getAllCourts();
      setCourts(response.data);
    } catch (error) {
      console.error("Failed to fetch courts:", error);
      toast.error("Failed to fetch courts");
    }
  };

  const handleCourtMenuOpen = (event, court) => {
    setCourtMenuAnchor(event.currentTarget);
    setSelectedCourtForStatus(court);
  };

  const handleCourtMenuClose = () => {
    setCourtMenuAnchor(null);
    setSelectedCourtForStatus(null);
  };

  const handleCourtStatusChange = async (status) => {
    if (!selectedCourtForStatus) {
      console.log("No court selected for status change.");
      return;
    }

    console.log(`Attempting to change status for court ID: ${selectedCourtForStatus.id} to ${status}`);
    try {
      const response = await courtAPI.updateCourtStatus(selectedCourtForStatus.id, status);
      console.log("Court status update API response:", response.data);
      toast.success(`Court status updated to ${status}`);
      fetchCourts();
    } catch (error) {
      console.error("Failed to update court status:", error);
      toast.error("Failed to update court status");
    }
    handleCourtMenuClose();
  };

  const fetchUsers = async () => {
    try {
      let response;
      if (selectedRole === "ALL") {
        response = await adminAPI.getAllUsers();
      } else {
        response = await adminAPI.getUsersByRole(selectedRole);
      }
      // Filter out the current user from the list
      const filteredUsers = response.data.filter(user => user.id !== currentUser.id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const handleUserMenuOpen = (event, user) => {
    setUserMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      toast.success("User status updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status");
    }
    handleUserMenuClose();
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await adminAPI.updateUserRole(selectedUser.id, newRole);
      toast.success("User role updated successfully");
      fetchUsers();
      setRoleDialogOpen(false);
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                        position: "relative",
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
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
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                          <Chip
                            label={court.status === 'AVAILABLE' ? 'Sân trống' : court.status === 'UNAVAILABLE' ? 'Không khả dụng' : 'Đang bảo trì'}
                            color={court.status === 'AVAILABLE' ? 'success' : court.status === 'UNAVAILABLE' ? 'error' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {court.name}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{court.address}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {court.hourlyPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 VND'}/slot
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        <strong>Giờ hoạt động:</strong> {court.openingTime} - {court.closingTime}
                      </Typography>
                      {court.subCourts && court.subCourts.length > 0 && (
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          <strong>Sân con:</strong> {court.subCourts.map((subCourt) => subCourt.name).join(", ")}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleCourtMenuOpen(e, court)}
                          sx={{ width: "auto", borderRadius: "50px", border: "2px solid #ccc" }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Court Status Change Menu */}
            <Menu
              anchorEl={courtMenuAnchor}
              open={Boolean(courtMenuAnchor)}
              onClose={handleCourtMenuClose}
            >
              <MenuItem onClick={() => handleCourtStatusChange("AVAILABLE")}>
                Sân trống
              </MenuItem>
              <MenuItem onClick={() => handleCourtStatusChange("UNAVAILABLE")}>
                Không khả dụng
              </MenuItem>
              <MenuItem onClick={() => handleCourtStatusChange("MAINTENANCE")}>
                Đang bảo trì
              </MenuItem>
            </Menu>
          </div>
        );
      case "users":
        return (
          <div className="content-wrapper">
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Quản lý người dùng
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Vai trò</InputLabel>
                    <Select
                      value={selectedRole}
                      label="Vai trò"
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <MenuItem value="ALL">Tất cả</MenuItem>
                      <MenuItem value="ADMIN">Admin</MenuItem>
                      <MenuItem value="OWNER">Owner</MenuItem>
                      <MenuItem value="CLIENT">Client</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Vai trò</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => (
                          <TableRow 
                            key={user.id}
                            sx={{ 
                              '&:hover': { 
                                backgroundColor: '#f8f9fa',
                                transition: 'background-color 0.2s'
                              }
                            }}
                          >
                            <TableCell>{user.id}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar 
                                  src={user.avatarUrl}
                                  sx={{ width: 32, height: 32 }}
                                >
                                  {user.fullName?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography>{user.fullName}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Chip
                                label={user.role}
                                color={
                                  user.role === 'ADMIN' ? 'error' :
                                  user.role === 'OWNER' ? 'warning' :
                                  'success'
                                }
                                size="small"
                                sx={{ 
                                  fontWeight: 'medium',
                                  textTransform: 'uppercase'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                                color={user.status === 'ACTIVE' ? 'success' : 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={(e) => handleUserMenuOpen(e, user)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  component="div"
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    borderTop: '1px solid #e0e0e0',
                    '.MuiTablePagination-select': {
                      borderRadius: 1
                    }
                  }}
                />
              </Paper>
            </Box>

            {/* User Menu */}
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
            >
              <MenuItem onClick={() => {
                setNewRole(selectedUser?.role);
                setRoleDialogOpen(true);
                handleUserMenuClose();
              }}>
                Thay đổi vai trò
              </MenuItem>
              <MenuItem onClick={() => handleStatusChange(selectedUser?.id, selectedUser?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}>
                {selectedUser?.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
              </MenuItem>
            </Menu>

            {/* Role Change Dialog */}
            <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
              <DialogTitle>Thay đổi vai trò</DialogTitle>
              <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Vai trò mới</InputLabel>
                  <Select
                    value={newRole}
                    label="Vai trò mới"
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="OWNER">Owner</MenuItem>
                    <MenuItem value="CLIENT">Client</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setRoleDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleRoleChange} variant="contained">
                  Xác nhận
                </Button>
              </DialogActions>
            </Dialog>
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
    </div>
  );
}

export default AdminDashboard;
