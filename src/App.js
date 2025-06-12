import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AnimatePresence, motion } from "framer-motion";
import { Box } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courts from "./pages/Courts";
import CourtDetail from "./pages/CourtDetail";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import BookingConfirmation from "./pages/BookingConfirmation";
import CourtManagement from "./pages/CourtManagement";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerBookingHistory from "./pages/OwnerBookingHistory";
import ScheduleCalendar from "./pages/ScheduleCalendar";
import CourtCalendarManagement from "./pages/CourtCalendarManagement";

import { AuthProvider } from "./contexts/AuthContext";

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

theme.hero = {
  height: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  backgroundImage: `url(${process.env.PUBLIC_URL}/bg-home.avif)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const PageWrapper = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -30, scale: 0.98, filter: "blur(4px)" }}
    transition={{
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    }}
    style={{ willChange: "transform, opacity, filter", ...style }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  const hideAuthLayout =
    location.pathname === "/register" || location.pathname === "/login";
  const hideNavbar =
    hideAuthLayout || location.pathname === "/schedule-calendar";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {location.pathname === "/bookings" && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: -1,
            backgroundImage: `url(${process.env.PUBLIC_URL}/bg-home.avif)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register />
              </PageWrapper>
            }
          />
          <Route
            path="/courts"
            element={
              <PageWrapper>
                <Courts />
              </PageWrapper>
            }
          />
          <Route
            path="/courts/:id"
            element={
              <PageWrapper>
                <CourtDetail />
              </PageWrapper>
            }
          />
          <Route
            path="/payment"
            element={
              <PageWrapper>
                <Payment />
              </PageWrapper>
            }
          />
          <Route
            path="/bookings"
            element={
              <PageWrapper>
                <MyBookings />
              </PageWrapper>
            }
          />
          <Route
            path="/explore"
            element={
              <PageWrapper>
                <Explore />
              </PageWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <PageWrapper>
                <Profile />
              </PageWrapper>
            }
          />
          <Route
            path="/confirmBooking"
            element={
              <PageWrapper>
                <BookingConfirmation />
              </PageWrapper>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <PrivateRoute requiredRole="OWNER">
                <PageWrapper>
                  <OwnerDashboard />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/courts"
            element={
              <PageWrapper>
                <CourtManagement />
              </PageWrapper>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <PageWrapper>
                  <AdminDashboard />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/booking-history"
            element={
              <PrivateRoute requiredRole="OWNER">
                <PageWrapper>
                  <OwnerBookingHistory />
                </PageWrapper>
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule-calendar"
            element={
              <PageWrapper>
                <ScheduleCalendar />
              </PageWrapper>
            }
          />
          <Route
            path="/court-schedule/:courtId"
            element={
              <PageWrapper>
                <CourtCalendarManagement />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
      {!hideAuthLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
