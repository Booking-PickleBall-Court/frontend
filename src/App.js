import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courts from "./pages/Courts";
import CourtDetail from "./pages/CourtDetail";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import BookingConfirmation from "./pages/BookingConfirmation";
import CourtManagement from "./pages/CourtManagement";
import OwnerDashboard from "./pages/OwnerDashboard";


const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/courts/:id" element={<CourtDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/confirmBooking" element={<BookingConfirmation />} />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/courts" element={<CourtManagement />} />

        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
