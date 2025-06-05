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
import { useNavigate } from "react-router-dom";

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
    monthlyRevenueSum: 0,
  });
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const mockRevenue = [
      { month: "Jan", revenue: 12600 },
      { month: "Feb", revenue: 9670 },
      { month: "Mar", revenue: 45000 },
      { month: "Apr", revenue: 87000 },
      { month: "May", revenue: 40000 },
      { month: "Jun", revenue: 53000 },
      { month: "Jul", revenue: 62000 },
      { month: "Aug", revenue: 45000 },
      { month: "Sep", revenue: 35000 },
      { month: "Oct", revenue: 41000 },
      { month: "Nov", revenue: 47000 },
      { month: "Dec", revenue: 52000 },
    ];
    const mockHours = [
      { month: "Jan", hours: 50 },
      { month: "Feb", hours: 70 },
      { month: "Mar", hours: 80 },
      { month: "Apr", hours: 95 },
      { month: "May", hours: 60 },
      { month: "Jun", hours: 75 },
      { month: "Jul", hours: 85 },
      { month: "Aug", hours: 90 },
      { month: "Sep", hours: 70 },
      { month: "Oct", hours: 65 },
      { month: "Nov", hours: 60 },
      { month: "Dec", hours: 80 },
    ];
    const mockCustomers = [
      {
        id: 1,
        name: "Nguyen Van A",
        totalBookings: 5,
        totalHours: 20,
        totalSpent: 500,
        lastBooking: "2025-05-25T00:00:00Z",
      },
      {
        id: 2,
        name: "Tran Thi B",
        totalBookings: 3,
        totalHours: 12,
        totalSpent: 250,
        lastBooking: "2025-05-20T00:00:00Z",
      },
      {
        id: 3,
        name: "Le Van C",
        totalBookings: 7,
        totalHours: 25,
        totalSpent: 650,
        lastBooking: "2025-05-15T00:00:00Z",
      },
      {
        id: 4,
        name: "Pham Thi D",
        totalBookings: 4,
        totalHours: 15,
        totalSpent: 400,
        lastBooking: "2025-05-18T00:00:00Z",
      },
    ];

    const totalRev = mockRevenue.reduce((acc, cur) => acc + cur.revenue, 0);

    const mockSummary = {
      totalRevenue: 95000,
      totalHours: 230,
      totalBookings: 45,
      monthlyRevenueSum: totalRev,
    };

    setTimeout(() => {
      setMonthlyRevenue(mockRevenue);
      setMonthlyHours(mockHours);
      setPotentialCustomers(mockCustomers);
      setSummary(mockSummary);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelect = (key) => {
    setSelectedKey(key);
  };

  const handleLogout = () => {
    // Handle logout logic here
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
      <Sidebar
        sidebarItems={sidebarItems}
        accountSettings={accountSettings}
        selectedKey={selectedKey}
        onSelect={handleSelect}
        onLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 280px)` },
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
                      Total Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700">
                    ${summary.totalRevenue.toLocaleString()}
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
                      Total Hours Booked
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
                sx={{ p: 2, height: "100%", backgroundColor: "#fff3e0" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography color="textSecondary" gutterBottom>
                      Total Bookings
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
                      Monthly Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="700" color="#4b4b4b">
                    ${summary.monthlyRevenueSum.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card elevation={3} sx={{ p: 2, height: 370 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="700">
                    Monthly Revenue
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
                    Monthly Hours Booked
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
                    Potential Customers
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Customer Name</TableCell>
                          <TableCell>Total Bookings</TableCell>
                          <TableCell>Total Hours</TableCell>
                          <TableCell>Total Spent</TableCell>
                          <TableCell>Last Booking</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {potentialCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.totalBookings}</TableCell>
                            <TableCell>{customer.totalHours}</TableCell>
                            <TableCell>
                              ${customer.totalSpent.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                customer.lastBooking
                              ).toLocaleDateString()}
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
