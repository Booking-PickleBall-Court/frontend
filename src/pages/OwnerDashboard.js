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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Tooltip as MuiTooltip,
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  Folder as FolderIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  Lock as LockIcon,
  Help as HelpIcon,
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

const drawerWidth = 240;

const OwnerDashboard = () => {
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

  useEffect(() => {
    // Mock data
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

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {" "}
      {/* Main flex container */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "relative", // Make the drawer part of the document flow
            height: "auto", // Allow drawer to take height of content
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ overflow: "auto", p: 2 }}>
          <Typography variant="overline" sx={{ mb: 1 }}>
            ME
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="My Bookings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="My Games" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="My Invoices" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1 }}>
            ACCOUNT SETTINGS
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LinkIcon />
              </ListItemIcon>
              <ListItemText primary="Link Social Accounts" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LockIcon />
              </ListItemIcon>
              <ListItemText primary="Create Password" />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
            MORE ON COURTSITE
          </Typography>
          <Typography variant="overline" sx={{ mb: 1, display: "block" }}>
            FOR BUSINESS
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="overline" sx={{ mb: 1 }}>
            SUPPORT
          </Typography>
          <List>
            <ListItem button>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help Centre" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            {/* Row 1: 4 cards */}
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

            {/* Row 2: 2 charts + table */}
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
};

export default OwnerDashboard;
