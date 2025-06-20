import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Tooltip as MuiTooltip,
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  BarChart as BarChartIcon,
  HelpOutline,
  WhatsApp,
} from "@mui/icons-material";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, courtAPI } from "../services/api";

const sidebarItems = [
  { label: "Dashboard", key: "dashboard", icon: <BarChartIcon /> },
  { label: "Courts", key: "courts", icon: <EventIcon /> },
  { label: "Customers", key: "customers", icon: <AccessTimeIcon /> },
  { label: "Revenue", key: "revenue", icon: <AttachMoneyIcon /> },
];

const accountSettings = [
  { label: "Help Centre", key: "help", icon: <HelpOutline /> },
  { label: "WhatsApp Us", key: "whatsapp", icon: <WhatsApp /> },
];

function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyHours, setMonthlyHours] = useState([]);
  const [potentialCustomers, setPotentialCustomers] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalHours: 0,
    totalBookings: 0,
    totalCourts: 0,
    monthlyRevenueSum: 0,
  });
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin người dùng hiện tại để có ownerId
        const userRes = await authAPI.getCurrentUser();
        const ownerId = userRes.data.id; 

        // Fetch dữ liệu doanh thu tổng quan
        const revenueRes = await courtAPI.getOwnerRevenue(ownerId);
        const { totalRevenue, totalHoursBooked, totalBookings, totalCourts } = revenueRes.data;

        setSummary({
          totalRevenue: totalRevenue || 0,
          totalHours: totalHoursBooked || 0,
          totalBookings: totalBookings || 0,
          totalCourts: totalCourts || 0,
          monthlyRevenueSum: totalRevenue || 0,
        });

        // Fetch danh sách các sân của chủ sở hữu
        const courtsRes = await courtAPI.getCourtsByOwner(ownerId);
        const ownerCourts = courtsRes.data;

        if (ownerCourts && ownerCourts.length > 0) {
          // Lấy ID của sân đầu tiên để fetch dữ liệu hàng tháng
          const firstCourtId = ownerCourts[0].id;
          const monthlyRevenueData = await courtAPI.getMonthlyRevenueByCourt(firstCourtId);
          
          // Map dữ liệu từ API vào định dạng biểu đồ
          const mappedMonthlyRevenue = monthlyRevenueData.data.map(item => ({
            month: item.month.substring(5), // Lấy MM từ YYYY-MM
            revenue: item.totalRevenue,
          }));

          const mappedMonthlyHours = monthlyRevenueData.data.map(item => ({
            month: item.month.substring(5), // Lấy MM từ YYYY-MM
            hours: item.totalHoursBooked,
          }));

          setMonthlyRevenue(mappedMonthlyRevenue);
          setMonthlyHours(mappedMonthlyHours);
        } else {
          // Nếu không có sân nào, reset biểu đồ về rỗng hoặc giữ mock data
          setMonthlyRevenue([]);
          setMonthlyHours([]);
        }

        // Fetch dữ liệu khách hàng tiềm năng từ API
        const customersRes = await courtAPI.getTopCustomersByOwner(ownerId);
        // Map dữ liệu từ API sang định dạng cũ nếu cần hoặc cập nhật bảng để khớp định dạng mới
        const mappedCustomers = customersRes.data.map(customer => ({
          id: customer.customerId,
          name: customer.customerName,
          totalBookings: customer.totalBookings,
          totalHours: customer.totalHoursBooked,
          totalSpent: customer.totalSpent,
          lastBooking: customer.lastBookingDate,
          email: customer.customerEmail, // Thêm email và phone nếu muốn hiển thị
          phone: customer.customerPhone,
        }));
        setPotentialCustomers(mappedCustomers);

      } catch (error) {
        console.error("Error fetching owner dashboard data:", error);
        // Có thể set error state để hiển thị thông báo lỗi trên UI
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (key) => {
    setSelectedKey(key);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {location.pathname !== "/owner/dashboard" && (
        <Sidebar
          sidebarItems={sidebarItems}
          accountSettings={accountSettings}
          selectedKey={selectedKey}
          onSelect={handleSelect}
          onLogout={handleLogout}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm:
              location.pathname === "/owner/dashboard"
                ? "100%"
                : `calc(100% - 280px)`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            <Grid item xs={12} md={3} sx={{ width: "23%" }}>
              <Card
                elevation={3}
                sx={{ p: 2, height: "100%", backgroundColor: "#e3f2fd" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography color="textSecondary" gutterBottom>
                      Tổng doanh thu
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700">
                    {summary.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} sx={{ width: "23%" }}>
              <Card
                elevation={3}
                sx={{ p: 2, height: "100%", backgroundColor: "#e8f5e9" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography color="textSecondary" gutterBottom>
                      Tổng số giờ đặt sân
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700">
                    {summary.totalHours.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} sx={{ width: "23%" }}>
              <Card
                elevation={3}
                sx={{ p: 2, height: "100%", backgroundColor: "#c8e6c9" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography color="textSecondary" gutterBottom>
                      Tổng sân
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700">
                    {summary.totalCourts.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} sx={{ width: "23%" }}>
              <Card
                elevation={3}
                sx={{ p: 2, height: "100%", backgroundColor: "#fff3e0" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography color="textSecondary" gutterBottom>
                      Tổng số đặt sân
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700">
                    {summary.totalBookings.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} sx={{ width: "23%" }}>
              <Card
                elevation={3}
                sx={{ p: 2, height: "100%", backgroundColor: "#f3e5f5" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <BarChartIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography color="textSecondary" gutterBottom>
                      Doanh thu hàng tháng
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" color="#4b4b4b">
                    {summary.monthlyRevenueSum.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ p: 2, height: 370 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="700">
                    Doanh thu hàng tháng
                  </Typography>
                  <ResponsiveContainer width={480} height={250}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#8884d8"
                        name="Revenue ($)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card elevation={1} sx={{ p: 2, height: 370 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="700">
                    Số giờ Đặt Sân Hàng Tháng
                  </Typography>
                  <ResponsiveContainer width={480} height={250}>
                    <BarChart data={monthlyHours}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" fill="#82ca9d" name="Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} sx={{ width: "1105px" }}>
              <Card elevation={3} sx={{ p: 2, height: 370 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="700">
                    Khách hàng Tiềm Năng
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên khách hàng</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Số điện thoại</TableCell>
                          <TableCell>Lượt đặt sân</TableCell>
                          <TableCell>Thời gian</TableCell>
                          <TableCell>Chi tiêu</TableCell>
                          <TableCell>Lượt đặt cuối</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {potentialCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email || 'N/A'}</TableCell>
                            <TableCell>{customer.phone || 'N/A'}</TableCell>
                            <TableCell>{customer.totalBookings}</TableCell>
                            <TableCell>{customer.totalHours}</TableCell>
                            <TableCell>
                              {customer.totalSpent.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </TableCell>
                            <TableCell>
                              {customer.lastBooking ? new Date(customer.lastBooking).toLocaleDateString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default OwnerDashboard;
